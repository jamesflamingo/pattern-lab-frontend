import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGarments } from '../services/api'

function PatternLibrary() {
  const [garments, setGarments] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    getGarments()
      .then((data) => {
        if (active) setGarments(data)
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

  const categories = useMemo(
    () => ['All', ...new Set(garments.map((garment) => garment.category))],
    [garments]
  )

  const filteredGarments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return garments.filter((garment) => {
      const matchesCategory = category === 'All' || garment.category === category
      const matchesSearch =
        !normalizedSearch ||
        `${garment.name} ${garment.category} ${garment.silhouette}`
          .toLowerCase()
          .includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [category, garments, search])

  return (
    <main className="catalog-page">
      <header className="page-heading">
        <p className="section-kicker">The pattern archive</p>
        <h1>Pattern Library</h1>
        <p>Find a silhouette to make your own.</p>
      </header>

      <section className="catalog-controls" aria-label="Filter patterns">
        <label className="catalog-search">
          <span>Search patterns</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try “corset” or “dress”"
          />
        </label>

        <label className="catalog-category">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      {loading && <p className="page-message" role="status">Loading patterns…</p>}
      {error && <p className="page-message error-message" role="alert">Could not load patterns: {error}</p>}

      {!loading && !error && (
        <>
          <p className="result-count">
            {filteredGarments.length} {filteredGarments.length === 1 ? 'pattern' : 'patterns'}
          </p>
          {filteredGarments.length ? (
            <section className="garment-grid" aria-label="Available patterns">
              {filteredGarments.map((garment) => (
                <article className="garment-card" key={garment.id}>
                  <div className="garment-card-art" aria-hidden="true">
                    <span>{garment.category}</span>
                    <strong>{garment.name.split(' ').map((word) => word[0]).join('')}</strong>
                  </div>
                  <div className="garment-card-copy">
                    <p className="section-kicker">{garment.category} <i>·</i> {garment.silhouette}</p>
                    <h2>{garment.name}</h2>
                    <p>{garment.description}</p>
                    <Link className="text-link" to={`/editor/${garment.id}`}>
                      Customize pattern <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <p className="empty-state">No patterns match those filters. Try another search.</p>
          )}
        </>
      )}
    </main>
  )
}

export default PatternLibrary
