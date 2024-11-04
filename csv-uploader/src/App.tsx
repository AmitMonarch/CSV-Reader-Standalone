import React from 'react';
import CsvUploader from './components/CsvUploader';

const API_URL = 'http://localhost:7174/api/Csv/upload';

function App() {
  return (
    <div className="App">
      <CsvUploader apiUrl={API_URL} />
    </div>
  );
}

export default App;
