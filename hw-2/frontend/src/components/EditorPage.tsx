import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';
import OutputConsole from './OutputConsole';

interface EditorPageProps {
    sessionId: string;
}

type Language = 'javascript' | 'python';

interface User {
    id: string;
    name: string;
}

const EditorPage = ({ sessionId }: EditorPageProps) => {
    const [code, setCode] = useState('// Start coding...\n');
    const [language, setLanguage] = useState<Language>('javascript');
    const [output, setOutput] = useState<string[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [pyodide, setPyodide] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const isRemoteChange = useRef(false);

    // Initialize Socket.io connection
    useEffect(() => {
        const socket = io('http://localhost:3001', {
            query: { sessionId },
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to server');
            const userId = socket.id || Math.random().toString(36).substring(7);
            socket.emit('join-session', {
                sessionId,
                user: { id: userId, name: `User_${userId.substring(0, 4)}` },
            });
        });

        socket.on('code-update', (newCode: string) => {
            isRemoteChange.current = true;
            setCode(newCode);
        });

        socket.on('language-change', (newLanguage: Language) => {
            setLanguage(newLanguage);
        });

        socket.on('users-update', (updatedUsers: User[]) => {
            setUsers(updatedUsers);
        });

        socket.on('initial-state', (state: { code: string; language: Language; users: User[] }) => {
            isRemoteChange.current = true;
            setCode(state.code);
            setLanguage(state.language);
            setUsers(state.users);
        });

        return () => {
            socket.disconnect();
        };
    }, [sessionId]);

    // Load Pyodide for Python execution
    useEffect(() => {
        if (language === 'python' && !pyodide) {
            const loadPyodide = async () => {
                try {
                    // @ts-ignore
                    const pyodideInstance = await window.loadPyodide({
                        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
                    });
                    setPyodide(pyodideInstance);
                    setOutput((prev) => [...prev, '[INFO] Python runtime loaded successfully']);
                } catch (error) {
                    setOutput((prev) => [...prev, `[ERROR] Failed to load Python runtime: ${error}`]);
                }
            };
            loadPyodide();
        }
    }, [language, pyodide]);

    const handleCodeChange = (value: string | undefined) => {
        if (isRemoteChange.current) {
            isRemoteChange.current = false;
            return;
        }

        const newCode = value || '';
        setCode(newCode);

        if (socketRef.current) {
            socketRef.current.emit('code-change', { sessionId, code: newCode });
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as Language;
        setLanguage(newLanguage);

        if (socketRef.current) {
            socketRef.current.emit('language-change', { sessionId, language: newLanguage });
        }
    };

    const executeCode = async () => {
        setIsExecuting(true);
        setOutput([]);

        try {
            if (language === 'javascript') {
                // Execute JavaScript
                const logs: string[] = [];
                const originalLog = console.log;
                const originalError = console.error;

                console.log = (...args: any[]) => {
                    logs.push(args.map(String).join(' '));
                    originalLog(...args);
                };

                console.error = (...args: any[]) => {
                    logs.push(`[ERROR] ${args.map(String).join(' ')}`);
                    originalError(...args);
                };

                try {
                    // eslint-disable-next-line no-eval
                    const result = eval(code);
                    if (result !== undefined) {
                        logs.push(String(result));
                    }
                    setOutput(logs.length > 0 ? logs : ['[SUCCESS] Code executed successfully']);
                } catch (error: any) {
                    setOutput([...logs, `[ERROR] ${error.message}`]);
                } finally {
                    console.log = originalLog;
                    console.error = originalError;
                }
            } else if (language === 'python') {
                // Execute Python with Pyodide
                if (!pyodide) {
                    setOutput(['[ERROR] Python runtime not loaded yet. Please wait...']);
                    return;
                }

                try {
                    // Redirect stdout
                    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

                    // Run the code
                    await pyodide.runPythonAsync(code);

                    // Get stdout and stderr
                    const stdout = pyodide.runPython('sys.stdout.getvalue()');
                    const stderr = pyodide.runPython('sys.stderr.getvalue()');

                    const outputs: string[] = [];
                    if (stdout) outputs.push(stdout);
                    if (stderr) outputs.push(`[ERROR] ${stderr}`);

                    setOutput(outputs.length > 0 ? outputs : ['[SUCCESS] Code executed successfully']);
                } catch (error: any) {
                    setOutput([`[ERROR] ${error.message}`]);
                }
            }
        } catch (error: any) {
            setOutput([`[ERROR] ${error.message}`]);
        } finally {
            setIsExecuting(false);
        }
    };

    const copySessionLink = () => {
        const link = `${window.location.origin}?session=${sessionId}`;
        navigator.clipboard.writeText(link);
        alert('Session link copied to clipboard!');
    };

    return (
        <div className="editor-page">
            <header className="editor-header">
                <div className="header-left">
                    <h2 className="session-id">
                        SESSION: <span>{sessionId}</span>
                    </h2>
                    <button className="btn copy-link-btn" onClick={copySessionLink}>
                        📋 Copy Link
                    </button>
                </div>

                <div className="header-controls">
                    <select
                        className="language-selector"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>

                    <button
                        className="btn btn-execute"
                        onClick={executeCode}
                        disabled={isExecuting}
                    >
                        {isExecuting ? '⏳ Running...' : '▶ Execute'}
                    </button>
                </div>
            </header>

            <div className="editor-container">
                <div className="editor-main">
                    <div className="code-editor-wrapper">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                            }}
                        />
                    </div>

                    <OutputConsole output={output} onClear={() => setOutput([])} />
                </div>

                <aside className="editor-sidebar">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Connected Users ({users.length})</h3>
                        <ul className="users-list">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <li key={user.id} className="user-item">
                                        <span className="user-indicator"></span>
                                        {user.name}
                                    </li>
                                ))
                            ) : (
                                <li className="user-item" style={{ border: 'none', background: 'transparent' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>
                                        Waiting for users...
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EditorPage;
