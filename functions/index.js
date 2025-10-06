// functions/index.js

const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const logger = require("firebase-functions/logger");
const path = require("path");
const os = require("os");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require("ffmpeg-static");

initializeApp();

// This is the new V2 syntax for Cloud Functions
exports.transcodeVideo = onObjectFinalized(
  {
    region: "europe-west2",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    logger.log("File detected:", filePath);

    if (!contentType.startsWith("video/")) {
      return logger.log("This is not a video.");
    }

    if (filePath.endsWith("_transcoded.mp4")) {
      return logger.log("This video has already been transcoded.");
    }

    const bucket = getStorage().bucket(fileBucket);
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const newFileName = `${path.parse(fileName).name}_transcoded.mp4`;
    const tempNewFilePath = path.join(os.tmpdir(), newFileName);
    const newFilePath = path.join(path.dirname(filePath), newFileName);

    await bucket.file(filePath).download({ destination: tempFilePath });
    logger.log("Video downloaded locally to", tempFilePath);

    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .setFfmpegPath(ffmpeg_static)
        .format("mp4")
        .outputOptions("-c:v", "libx264")
        .outputOptions("-crf", "23")
        .outputOptions("-preset", "veryfast")
        .outputOptions("-c:a", "aac")
        .outputOptions("-b:a", "128k")
        .on("end", resolve)
        .on("error", (err) => {
          logger.error("FFmpeg error:", err);
          reject(err);
        })
        .save(tempNewFilePath);
    });

    logger.log("Video transcoded successfully.");

    await bucket.upload(tempNewFilePath, {
      destination: newFilePath,
      metadata: { contentType: "video/mp4" },
    });

    logger.log("Transcoded video uploaded to Storage at", newFilePath);
    
    const newFile = bucket.file(newFilePath);
    const [newUrl] = await newFile.getSignedUrl({ action: "read", expires: "03-09-2491" });

    const db = getFirestore();
    const uploadsRef = db.collection("uploads");
    const originalFileUrl = `https://firebasestorage.googleapis.com/v0/b/${fileBucket}/o/${encodeURIComponent(filePath)}?alt=media`;
    const snapshot = await uploadsRef.where("fileUrl", "==", originalFileUrl).get();

    if (snapshot.empty) {
      logger.warn("No matching document found in Firestore for URL:", originalFileUrl);
    } else {
      snapshot.forEach(async (doc) => {
        await doc.ref.update({
          fileUrl: newUrl,
          fileType: "video/mp4",
          transcoded: true,
        });
        logger.log("Firestore document updated:", doc.id);
      });
    }

    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(tempNewFilePath);
  }
);