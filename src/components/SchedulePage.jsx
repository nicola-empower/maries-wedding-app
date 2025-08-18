import './SchedulePage.css'; // I'll create this file next for styling

function SchedulePage() {
  return (
    <div className="schedule-container">
      <h1>Today's Schedule</h1>
      <div className="schedule-timeline">
        <div className="schedule-item">
          <p className="time">1:00 - 1:30 PM</p>
          <p className="event">Guests Arrive</p>
        </div>
        <div className="schedule-item">
          <p className="time">2:00 PM</p>
          <p className="event">The Ceremony Begins</p>
        </div>
        <div className="schedule-item">
          <p className="time">2:45 PM</p>
          <p className="event">Bridal Photos</p>
        </div>
         <div className="schedule-item">
          <p className="time">4:30 PM</p>
          <p className="event">Guests Seated for Meal</p>
        </div>
         <div className="schedule-item">
          <p className="time">5:00 PM</p>
          <p className="event">Speeches & Toasts</p>
        </div>
        <div className="schedule-item">
          <p className="time">6:30 PM</p>
          <p className="event">Meal Ends</p>
        </div>
        <div className="schedule-item">
          <p className="time">7:30 PM</p>
          <p className="event">Evening Guests Arrive</p>
        </div>
         <div className="schedule-item">
          <p className="time">8:00 PM</p>
          <p className="event">First Dance</p>
        </div>
        <div className="schedule-item">
          <p className="time">12:00 AM</p>
          <p className="event">Ends</p>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;