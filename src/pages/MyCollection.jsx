import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { deleteDesign, getDesigns, getGarments } from '../services/api'
import examplePattern from '../assets/ccc0b5e0-51ff-46f1-8e01-d2a1f7af5347.png'

function MyCollection() {
  const { state } = useLocation()
  const [designs, setDesigns] = useState([])
  const [garmentNames, setGarmentNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    let active = true

    Promise.all([getDesigns(), getGarments()])
      .then(([designData, garments]) => {
        if (!active) return
        const names = Object.fromEntries(garments.map((garment) => [garment.id, garment.name]))

        setDesigns(designData)
        setGarmentNames(names)
        const selectedIndex = designData.findIndex((design) => String(design.id) === String(state?.designId))
        if (selectedIndex >= 0) setPage(selectedIndex)
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
  }, [state?.designId])

  async function handleDelete(design) {
    if (!window.confirm(`Delete “${design.name}” from your collection?`)) return

    setDeletingId(design.id)
    setActionError(null)

    try {
      await deleteDesign(design.id)
      setDesigns((current) => current.filter((item) => item.id !== design.id))
    } catch (requestError) {
      setActionError(`Could not delete the design: ${requestError.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const currentPage = Math.min(page, Math.max(0, designs.length - 1))

  return (
    <main className="catalog-page collection-page">
      <header className="page-heading">
        <h1>My Collection</h1>
        <p>Your saved patterns, ready for another fitting.</p>
      </header>

      {loading && <p className="page-message" role="status">Loading your designs…</p>}
      {error && <p className="page-message error-message" role="alert">{error}</p>}
      {actionError && <p className="page-message error-message" role="alert">{actionError}</p>}

      {!loading && !error && !designs.length && (
        <section className="empty-state collection-empty">
          <h2>Your collection is waiting.</h2>
          <p>Save a design from the editor and it will appear here.</p>
          <Link className="text-link" to="/library">Explore the pattern library <span aria-hidden="true">→</span></Link>
        </section>
      )}

      {!loading && !!designs.length && (
        <section className="design-list" aria-label="Saved designs">
          {designs.slice(currentPage, currentPage + 1).map((design) => {
            const options = Object.entries(design.options || {})
            const garmentName = garmentNames[design.garmentId] || 'Unknown pattern'

            return (
              <article className="design-card" key={design.id}>
                <div className="design-card-main">
                  <p className="section-kicker">{garmentName} <i>·</i> Saved design</p>
                  <h2>{design.name}</h2>
                  <p className="design-date">
                    Updated {design.updatedAt ? new Date(design.updatedAt).toLocaleDateString() : 'just now'}
                  </p>
                  {!!options.length && (
                    <ul className="design-options">
                      {options.map(([componentId, option]) => (
                        <li key={componentId}><strong>{option}</strong></li>
                      ))}
                    </ul>
                  )}
                  {design.pattern2d === 'generic-v1' && (
                    <div className="design-pattern">
                      <p>Example only — not adapted to your design or suitable for cutting.</p>
                      <a className="text-link" href={examplePattern} target="_blank" rel="noreferrer">
                        View 2D pattern
                      </a>
                      <button type="button" className="text-link design-pattern__download" disabled title="Download is not available for this example">
                        Download Model
                      </button>
                    </div>
                  )}
                </div>
                <div className="design-actions">
                  <Link
                    className="text-link"
                    to={`/editor/${design.garmentId}?design=${encodeURIComponent(design.id)}`}
                  >
                    Edit design
                  </Link>
                  <button
                    type="button"
                    className="delete-button"
                    disabled={deletingId === design.id}
                    onClick={() => handleDelete(design)}
                  >
                    {deletingId === design.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
      {!loading && designs.length > 1 && (
        <nav className="collection-pagination" aria-label="Saved design pages">
          <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
            Previous
          </button>
          <span>{currentPage + 1} / {designs.length}</span>
          <button type="button" disabled={currentPage === designs.length - 1} onClick={() => setPage(currentPage + 1)}>
            Next
          </button>
        </nav>
      )}
    </main>
  )
}

export default MyCollection
