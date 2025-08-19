import { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Make sure this path is correct for your project
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../App.css'; // Using the main App.css for the global font style and new content-box style

const SeatingPlanPage = () => {
  const [eventId, setEventId] = useState('wedding_001');
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // This would be replaced with logic to get the eventId from the URL in a real app
  }, []);

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
    <div className="min-h-screen flex flex-col items-center pt-8 sm:pt-12 px-4 bg-cover bg-center" style={{ backgroundImage: "url('/mariebaground1.jpg')" }}>
      
      <h1 className="parisienne-font text-5xl md:text-6xl mb-6 md:mb-8 text-center" style={{ color: '#EFE3C5' }}>Seating Plan</h1>

      <div className="w-full max-w-md p-6 md:p-8 space-y-4 rounded-lg" style={{ backgroundColor: 'rgba(122, 122, 148, 0.8)' }}>
        
        <div className="text-center text-white">
            <h2 className="text-xl md:text-2xl font-bold">Find Your Seat</h2>
            <p className="mt-2 text-sm md:text-base">Enter your name to find your table and who you're sitting with.</p>
        </div>
        
        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter your full name..."
            className="w-full p-3 border-none rounded-md text-gray-800"
            style={{ backgroundColor: '#EFE3C5' }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full px-6 py-3 font-semibold text-white rounded-md"
            style={{ backgroundColor: '#5A5A7B' }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="mt-6 text-center">
          {message && <p className="text-white bg-red-500/50 p-2 rounded-md">{message}</p>}
          
          {searchResult && (
            <div className="p-4 md:p-6 rounded-lg text-left" style={{ backgroundColor: '#EFE3C5', color: '#5A5A7B' }}>
              <p className="text-lg md:text-xl">
                Hi <strong className="font-bold">{searchResult.guestName}</strong>,
              </p>
              <p className="mt-2 text-base md:text-lg">
                You are sitting at <strong className="font-bold">{searchResult.tableName}</strong>.
              </p>
              
              {searchResult.tableMates.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-base">You'll be sitting with:</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm md:text-base">
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
