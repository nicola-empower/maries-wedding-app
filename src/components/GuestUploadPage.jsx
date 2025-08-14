// src/components/GuestUploadPage.jsx

import UploadComponent from './UploadComponent.jsx';

function GuestUploadPage() {
  const eventId = "maries-wedding-2025";

  // This "App" class is what connects our CSS to the page
  return (
    <div className="App"> 
      <header className="App-header">
        <h1>Marie & Christopher</h1>
      </header>
      <main>
        <UploadComponent eventId={eventId} />
      </main>
    </div>
  );
}

export default GuestUploadPage;