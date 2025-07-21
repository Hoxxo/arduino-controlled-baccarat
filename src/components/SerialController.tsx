import { useState, useEffect } from "react"

export type SerialControllerProps = {
  onInput: (ch: string) => void
}

export default function serialController({ onInput }: SerialControllerProps) {
  const [port, setPort] = useState<null | Awaited<ReturnType<
    typeof navigator.serial.requestPort
  >>> (null)
  const [error, setError] = useState<string | null> (null)

  const connect = async () => {
    try {
      const p = await navigator.serial.requestPort()
      await p.open({ baudRate: 9600 })
      setPort(p)
    } catch (e) {
      setError(e.message || 'Failed to open port')
    }
  }

  useEffect(() => {
    if (!port) return
    let cancelled = false;
    (async () => {
      try {
        const reader = port.readable?.getReader()
        while (!cancelled) {
          const { value, done } = await reader.read()
          if (done) break;
          if (value) {
            for (const byte of value) {
              onInput(String.fromCharCode(byte))
            }
          }
        }
        reader.releaseLock()
      } catch (e) {
        setError(e.message || 'Read error')
      }
    })();
    return () => {
      cancelled = true
      port.close().then(() => {})
    };
  }, [port, onInput]);
}