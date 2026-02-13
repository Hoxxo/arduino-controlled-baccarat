import { useState, useEffect } from 'react';

type SerialControllerProps = {
  onInput: (ch: string) => void;
};

export default function SerialController({ onInput }: SerialControllerProps) {
  const [port, setPort] = useState<null | Awaited<
    ReturnType<typeof navigator.serial.requestPort>
  >>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      const p = await navigator.serial.requestPort();
      await p.open({ baudRate: 9600 });
      setPort(p);
    } catch (e) {
      setError(e.message || 'Failed to open port');
    }
  };

  useEffect(() => {
    if (!port) return;
    let cancelled = false;
    (async () => {
      try {
        const reader = port.readable?.getReader();
        while (!cancelled) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            for (const byte of value) {
              onInput(String.fromCharCode(byte).trim());
            }
          }
        }
        reader.releaseLock();
      } catch (e) {
        setError(e.message || 'Read error');
      }
    })();
    return () => {
      cancelled = true;
      port.close().then(() => {});
    };
  }, [port, onInput]);

  const isSupported = typeof navigator !== 'undefined' && 'serial' in navigator;
  if (!isSupported) {
    return (
      <>
        <div style={{ padding: '5px', border: '1px solid' }}>
          <p>
            <span style={{ color: 'orange' }}>
              Arduino feature not supported for your browser!
            </span>
            <br />
            If you want to use this feature, use a Chromium browser, or a
            browser that supports <code>navigator.serial</code>.
            <br />
            Additionally, this feature will <em>not</em> work outside localhost
            or secure HTTPS environments.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <button onClick={connect} disabled={!!port} style={{ margin: '10px' }}>
        {port ? 'Connection Successful!' : 'Connect Arduino'}
      </button>
      {error && (
        <h3>
          Error connecting Arduino! Error details:
          <br />
          <span style={{ color: 'cyan' }}>{error}</span>
        </h3>
      )}
    </>
  );
}
