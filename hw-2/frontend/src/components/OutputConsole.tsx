interface OutputConsoleProps {
    output: string[];
    onClear: () => void;
}

const OutputConsole = ({ output, onClear }: OutputConsoleProps) => {
    return (
        <div className="output-console">
            <div className="console-header">
                <span className="console-title">OUTPUT</span>
                <button className="btn console-clear" onClick={onClear}>
                    Clear
                </button>
            </div>
            <div className="console-content">
                {output.length > 0 ? (
                    <div className="console-output">
                        {output.map((line, index) => {
                            const isError = line.includes('[ERROR]');
                            const isSuccess = line.includes('[SUCCESS]');
                            const isInfo = line.includes('[INFO]');

                            const className = isError
                                ? 'console-error'
                                : isSuccess
                                    ? 'console-success'
                                    : isInfo
                                        ? 'console-info'
                                        : '';

                            return (
                                <div key={index} className={className}>
                                    {line}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="console-empty">No output yet. Execute code to see results...</div>
                )}
            </div>
        </div>
    );
};

export default OutputConsole;
