import { useState } from 'react';

interface LandingPageProps {
    onCreateSession: () => void;
    onJoinSession: (sessionId: string) => void;
    isJoining: boolean;
    setIsJoining: (value: boolean) => void;
}

const LandingPage = ({
    onCreateSession,
    onJoinSession,
    isJoining,
    setIsJoining,
}: LandingPageProps) => {
    const [joinSessionId, setJoinSessionId] = useState('');

    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinSessionId.trim()) {
            onJoinSession(joinSessionId.trim());
        }
    };

    return (
        <div className="landing">
            <div className="landing-hero animate-slide-in">
                <h1 className="landing-title text-glow">CODE_COLLAB</h1>
                <p className="landing-subtitle">
                    Real-time collaborative coding interview platform
                    <br />
                    Built for hackers, by hackers
                </p>

                <div className="landing-actions">
                    <button className="btn btn-primary" onClick={onCreateSession}>
                        [+] Create New Session
                    </button>
                    <button className="btn" onClick={() => setIsJoining(true)}>
                        [→] Join Existing Session
                    </button>
                </div>

                <div className="landing-features">
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">Real-Time Sync</h3>
                        <p className="feature-description">
                            Collaborate with multiple users simultaneously with instant updates
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3 className="feature-title">Syntax Highlighting</h3>
                        <p className="feature-description">
                            Support for JavaScript and Python with Monaco Editor
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Execute Code</h3>
                        <p className="feature-description">
                            Run code safely in the browser using WASM technology
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔗</div>
                        <h3 className="feature-title">Easy Sharing</h3>
                        <p className="feature-description">
                            Share session links instantly with candidates
                        </p>
                    </div>
                </div>
            </div>

            {isJoining && (
                <div className="modal-overlay" onClick={() => setIsJoining(false)}>
                    <div className="modal animate-slide-in" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">Join Session</h2>
                        <form onSubmit={handleJoinSubmit}>
                            <input
                                type="text"
                                className="modal-input"
                                placeholder="Enter session ID..."
                                value={joinSessionId}
                                onChange={(e) => setJoinSessionId(e.target.value)}
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsJoining(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
