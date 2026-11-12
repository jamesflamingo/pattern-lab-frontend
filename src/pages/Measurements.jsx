import { useEffect, useMemo, useState } from 'react'
import { getBodySizes } from '../services/api'

function Measurements() {
  const [sizes, setSizes] = useState([])
  const [search, setSearch] = useState('')
  const [unit, setUnit] = useState('cm')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    getBodySizes()
      .then((data) => {
        if (active) setSizes(data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredSizes = useMemo(() => {
    const query = search.trim()
    if (!query) return sizes

    return sizes.filter((item) => String(item.size).includes(query))
  }, [search, sizes])

  function formatMeasurement(value) {
    if (value == null || value === '') return '—'
    const measurement = Number(value)
    if (!Number.isFinite(measurement)) return value

    return unit === 'in' ? (measurement / 2.54).toFixed(1) : measurement
  }

  return (
    <main className="catalog-page">
      <header className="page-heading">
        <p className="section-kicker">The fit reference</p>
        <h1>Body Measurements</h1>
        <p>Compare standard measurements before choosing a pattern size.</p>
      </header>

      <section className="measurement-controls" aria-label="Measurement options">
        <label className="catalog-search measurement-search">
          <span>Find a size</span>
          <input
            type="search"
            inputMode="numeric"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="For example, 38"
          />
        </label>

        <label className="catalog-category measurement-unit">
          <span>Units</span>
          <select value={unit} onChange={(event) => setUnit(event.target.value)}>
            <option value="cm">Metric (cm)</option>
            <option value="in">US / Imperial (in)</option>
          </select>
        </label>
      </section>

      {loading && <p className="page-message" role="status">Loading size references…</p>}
      {error && <p className="page-message error-message" role="alert">Could not load size references: {error}</p>}

      {!loading && !error && (
        <div className="measurement-table-wrap">
          <table className="measurement-table">
            <caption>
              Standard body measurements in {unit === 'cm' ? 'centimeters (cm)' : 'inches (in)'}
            </caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Bust</th>
                <th scope="col">Waist</th>
                <th scope="col">Hips</th>
                <th scope="col">Shoulder</th>
                <th scope="col">Arm</th>
              </tr>
            </thead>
            <tbody>
              {filteredSizes.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.size}</th>
                  <td>{formatMeasurement(item.bust)}</td>
                  <td>{formatMeasurement(item.waist)}</td>
                  <td>{formatMeasurement(item.hips)}</td>
                  <td>{formatMeasurement(item.shoulderWidth)}</td>
                  <td>{formatMeasurement(item.armLength)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredSizes.length && <p className="empty-state">No size references match that number.</p>}
        </div>
      )}
    </main>
  )
}

export default Measurements
