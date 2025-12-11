import { useState } from 'react'
import './App.css'
import { MODEL_ENDPOINT } from './config'

function App() {
  const [mood, setMood] = useState('happy')
  const [genre, setGenre] = useState('pop')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  async function handleRecommend() {
    setLoading(true)
    setError('')
    setResults([])
    try {
      const res = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, genre })
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data = await res.json()
      let recs = []
      if (Array.isArray(data)) {
        recs = data
      } else if (Array.isArray(data?.recommendations)) {
        recs = data.recommendations
      } else if (Array.isArray(data?.data)) {
        recs = data.data
      } else if (typeof data === 'object' && data) {
        recs = Object.values(data)
      } else if (typeof data === 'string') {
        recs = [data]
      }
      setResults(recs)
    } catch (e) {
      setError(e?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
  <h1 className='text-2xl'>Music Recommendation</h1>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <label>
          Mood
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="energetic">Energetic</option>
            <option value="calm">Calm</option>
          </select>
        </label>
        <label>
          Genre
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="hiphop">Hip-Hop</option>
            <option value="classical">Classical</option>
          </select>
        </label>
        <button onClick={handleRecommend} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendation'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Results</h2>
        {results?.length === 0 && !loading && !error && (
          <p>Belum ada hasil.</p>
        )}
        <ul>
          {results?.map((item, idx) => {
            if (typeof item === 'string') {
              return <li key={idx}>{item}</li>
            }
            if (item && typeof item === 'object') {
              const title = item.title || item.name || item.song || 'Unknown Title'
              const artist = item.artist || item.singer || ''
              const url = item.url || item.link
              return (
                <li key={idx}>
                  <span>{title}{artist ? ` — ${artist}` : ''}</span>
                  {url ? (
                    <span>
                      {' '}
                      <a href={url} target="_blank" rel="noreferrer">Open</a>
                    </span>
                  ) : null}
                </li>
              )
            }
            return <li key={idx}>{String(item)}</li>
          })}
        </ul>
      </div>
    </>
  )
}

export default App
