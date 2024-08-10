import React, { useState, useEffect } from 'react';
import { generateContent, checkAPIStatus } from './api/gemini';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkAPIStatus();
      setApiStatus(status);
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await generateContent(query);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gemini AI Chat</h1>
      {apiStatus === false && (
        <div className="alert alert-danger" role="alert">
          API is currently unavailable. Please try again later.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here..."
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || apiStatus === false}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      {response && (
        <div className="mt-4">
          <h2>Response:</h2>
          <pre className="bg-light p-3 rounded">{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;