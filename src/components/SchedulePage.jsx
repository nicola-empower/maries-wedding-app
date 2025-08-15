import './SchedulePage.css'; // We'll create this file next for styling

function SchedulePage() {
  return (
    <div className="schedule-container">
      <h1>Today's Schedule 🗓️</h1>
      <div className="schedule-timeline">
        <div className="schedule-item">
          <p className="time">1:30 PM</p>
          <p className="event">Guests Arrive & Welcome Drinks</p>
        </div>
        <div className="schedule-item">
          <p className="time">2:00 PM</p>
          <p className="event">The Ceremony Begins 💍</p>
        </div>
        <div className="schedule-item">
          <p className="time">2:45 PM</p>
          <p className="event">Confetti & Cocktails</p>
        </div>
         <div className="schedule-item">
          <p className="time">5:00 PM</p>
          <p className="event">Speeches & Toasts 🥂</p>
        </div>
        <div className="schedule-item">
          <p className="time">7:30 PM</p>
          <p className="event">Cutting of the Cake 🍰</p>
        </div>
        <div className="schedule-item">
          <p className="time">7:45 PM</p>
          <p className="event">The First Dance</p>
        </div>
         <div className="schedule-item">
          <p className="time">11:00 PM</p>
          <p className="event">Carriages</p>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;