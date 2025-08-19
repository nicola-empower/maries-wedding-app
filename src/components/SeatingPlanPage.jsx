import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './SeatingPlanPage.css'; // Import the dedicated CSS file

const SeatingPlanPage = () => {
  const [eventId, setEventId] = useState('wedding_001');
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // The search logic remains the same
  const handleSearch = async () => {
    if (!searchName.trim()) {
      setMessage('Please enter a name to search.');
      return;
    }
    if (!eventId) {
      setMessage('Event ID is missing. Cannot perform search.');
      return;
    }

    setIsLoading(true);
    setSearchResult(null);
    setMessage('');

    try {
      const searchTermLowercase = searchName.trim().toLowerCase();
      const seatingCol = collection(firestore, 'seating');
      
      const guestQuery = query(
        seatingCol,
        where('guestName_lowercase', '==', searchTermLowercase),
        where('eventId', '==', eventId)
      );
      const guestSnapshot = await getDocs(guestQuery);

      if (guestSnapshot.empty) {
        setMessage(`Sorry, we couldn't find "${searchName}". Please check the spelling.`);
        setIsLoading(false);
        return;
      }

      const guestDoc = guestSnapshot.docs[0].data();
      const { guestName: foundGuestName, tableName: foundTableName } = guestDoc;

      const tableQuery = query(
        seatingCol,
        where('tableName', '==', foundTableName),
        where('eventId', '==', eventId)
      );
      const tableSnapshot = await getDocs(tableQuery);

      const tableMates = tableSnapshot.docs
        .map(doc => doc.data().guestName)
        .filter(name => name !== foundGuestName);
      
      setSearchResult({
        guestName: foundGuestName,
        tableName: foundTableName,
        tableMates: tableMates,
      });

    } catch (error) {
      console.error("Error searching seating plan: ", error);
      setMessage('Oh no! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="seating-plan-container">
      
      <h1>Seating Plan</h1>

      <div className="seating-plan-box">
        
        <h2>Find Your Seat</h2>
        <p>Enter your name to find your table and who you're sitting with.</p>
        
        <div className="search-form">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter your full name..."
            className="search-input"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {message && <p style={{ color: 'white', backgroundColor: 'rgba(255, 0, 0, 0.5)', padding: '0.5rem', borderRadius: '8px' }}>{message}</p>}
          
          {searchResult && (
            <div className="results-box">
              <p>
                Hi <strong>{searchResult.guestName}</strong>,
              </p>
              <p>
                You are sitting at <strong>{searchResult.tableName}</strong>.
              </p>
              
              {searchResult.tableMates.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p><strong>You'll be sitting with:</strong></p>
                  <ul className="table-mates-list">
                    {searchResult.tableMates.map(name => <li key={name}>{name}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatingPlanPage;
