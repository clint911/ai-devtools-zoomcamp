import { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import EditorPage from './components/EditorPage';

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Check if there's a session ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('session');
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  const handleCreateSession = () => {
    // Generate a random session ID
    const newSessionId = Math.random().toString(36).substring(2, 10);
    setSessionId(newSessionId);

    // Update URL
    window.history.pushState({}, '', `?session=${newSessionId}`);
  };

  const handleJoinSession = (sid: string) => {
    setSessionId(sid);
    setIsJoining(false);

    // Update URL
    window.history.pushState({}, '', `?session=${sid}`);
  };

  return (
    <div className="app">
      {sessionId ? (
        <EditorPage sessionId={sessionId} />
      ) : (
        <LandingPage
          onCreateSession={handleCreateSession}
          onJoinSession={handleJoinSession}
          isJoining={isJoining}
          setIsJoining={setIsJoining}
        />
      )}
    </div>
  );
}

export default App;
