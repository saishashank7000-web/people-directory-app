import { useEffect, useState } from 'react'

type HealthResponse = {
  status: string
}

type HealthState =
  | { status: 'loading' }
  | { status: 'connected' }
  | { status: 'error'; message: string }

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export default function App() {
  const [health, setHealth] = useState<HealthState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function checkApi() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`The API returned HTTP ${response.status}.`)
        }

        const body = (await response.json()) as HealthResponse
        setHealth(body.status === 'UP'
          ? { status: 'connected' }
          : { status: 'error', message: 'The API did not report a healthy status.' })
      } catch (error) {
        if (controller.signal.aborted) return

        setHealth({
          status: 'error',
          message: error instanceof Error ? error.message : 'Could not reach the API.',
        })
      }
    }

    void checkApi()
    return () => controller.abort()
  }, [])

  return (
    <main className="page-shell">
      <section className="setup-card" aria-labelledby="page-title">
        <p className="eyebrow">Full stack learning project</p>
        <h1 id="page-title">People Directory</h1>
        <p className="intro">
          A React and TypeScript app connected to a Spring Boot API.
        </p>

        <div className={`api-status api-status--${health.status}`} role="status" aria-live="polite">
          {health.status === 'loading' && <><span className="status-dot" /> Connecting to the API…</>}
          {health.status === 'connected' && <><span className="status-dot" /> API connected</>}
          {health.status === 'error' && <><span className="status-dot" /> {health.message}</>}
        </div>

        <p className="setup-note">
          Start the backend on port 8080 to see the connection status here.
        </p>
      </section>
    </main>
  )
}
