import { useEffect, useMemo, useState } from 'react'
import { getBodySizes } from '../services/api'

function Measurements() {
  const [sizes, setSizes] = useState([])
  const [search, setSearch] = useState('')
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

  return (
    <main className="catalog-page">
      <header className="page-heading">
        <p className="section-kicker">The fit reference</p>
        <h1>Body Measurements</h1>
        <p>Compare standard measurements before choosing a pattern size.</p>
      </header>

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

      {loading && <p className="page-message" role="status">Loading size references…</p>}
      {error && <p className="page-message error-message" role="alert">Could not load size references: {error}</p>}

      {!loading && !error && (
        <div className="measurement-table-wrap">
          <table className="measurement-table">
            <caption>Standard body measurements in centimeters</caption>
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
                  <td>{item.bust}</td>
                  <td>{item.waist}</td>
                  <td>{item.hips}</td>
                  <td>{item.shoulderWidth}</td>
                  <td>{item.armLength}</td>
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
