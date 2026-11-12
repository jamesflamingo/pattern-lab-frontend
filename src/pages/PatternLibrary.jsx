import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGarments } from '../services/api'
import CustomSelect from '../components/CustomSelect'

import modernDress from '../assets/icons/c1154689-812b-4dc0-bfb9-1ebc83f81e49.png'
import classicDress from '../assets/icons/77501021-30fe-4e11-9440-5280061ef369.png'
import classicCorset from '../assets/icons/3e3c09a4-cf23-433c-9bff-90f035d33442.png'
import modernCorset from '../assets/icons/8de6f20f-fde9-420e-8b99-41c32aca6aab.png'
import classicSkirt from '../assets/icons/d7842ebe-4288-4ddc-8f4b-bdedea52c77e.png'
import modernSkirt from '../assets/icons/268e3841-2374-4b35-a3f8-5656ddfb7484.png'
import editGarment from '../assets/595a5f3d-ef50-4a68-ace5-448853d31b5f.png'

const categories = [
  {
    name: 'Dresses',
    category: 'Dress',
    
  },
  {
    name: 'Corsets',
    category: 'Corset',
    
  },
  {
    name: 'Skirts',
    category: 'Skirt',
    
  },
]

const garmentImages = {
  '1': classicDress,
  '2': modernDress,
  '6': classicCorset,
  '7': modernCorset,
  '21': classicSkirt,
  '25': modernSkirt,
}

function PatternLibrary() {
  const [garments, setGarments] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchGarments() {
      try {
        setGarments(await getGarments())
      } catch (requestError) {
        console.error(requestError)
        setError('Unable to load the garment collection.')
      } finally {
        setLoading(false)
      }
    }

    fetchGarments()
  }, [])

  const apiUrl = (
    import.meta.env.VITE_API_URL || 'http://localhost:3001'
  ).replace(/\/+$/, '')
  const normalizedSearch = search.trim().toLowerCase()

  return (
    <main className="catalog-page">
      <div className="catalog-toolbar">
        <header className="page-heading">
          <p className="section-kicker">The pattern archive</p>
          <h1>Library</h1>
          <p></p>
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

          <CustomSelect
            label="Category"
            value={category}
            options={['All', ...categories.map((item) => item.category)].map((item) => ({ value: item, label: item }))}
            onChange={setCategory}
          />
        </section>
      </div>

      {loading && <p className="page-message" role="status">Loading collection...</p>}
      {error && <p className="page-message error-message" role="alert">{error}</p>}

      {!loading && !error && (
        <div className="garment-categories">
          {categories
            .filter((item) => category === 'All' || category === item.category)
            .map((item) => {
              const categoryGarments = garments.filter((garment) => {
                const searchableText =
                  `${garment.name} ${garment.style} ${garment.description} ${garment.silhouette}`
                    .toLowerCase()

                return (
                  garment.category === item.category &&
                  searchableText.includes(normalizedSearch)
                )
              })

              return (
                <section
                  className={`garment-category garment-category--${item.category.toLowerCase()}`}
                  key={item.category}
                >
                  <div className="category-heading">
                    <div>
                      <p className="eyebrow">The Collection</p>
                      <h2>{item.name}</h2>
                      <p>{item.description}</p>
                    </div>
                  </div>

                  {categoryGarments.length ? (
                    <div className="garment-grid">
                      {categoryGarments.map((garment) => (
                        <article className="garment-card" key={garment.id}>
                          <Link
                            to={`/editor/${garment.id}`}
                            className="garment-image-link"
                          >
                            <div className="garment-card-image">
                              <img
                                className={`garment-image--${garment.id}`}
                                src={
                                  garmentImages[String(garment.id)] ||
                                  `${apiUrl}${garment.image}`
                                }
                                alt={garment.name}
                              />
                            </div>
                          </Link>

                          <div className="garment-card-content">
                            <p className="garment-style">{garment.style}</p>
                            <h3>{garment.name}</h3>
                           <p>
  {String(garment.id) === '1'
    ? 'Timeless dress with a flattering silhouette and elegant details.'
    : garment.description}
</p>
                            <Link className="garment-edit-link" to={`/editor/${garment.id}`}>
                              <img src={editGarment} alt="Edit garment" />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>
                      {normalizedSearch
                        ? 'No garments match your search in this collection.'
                        : 'No garments available in this category.'}
                    </p>
                  )}
                </section>
              )
            })}
        </div>
      )}
    </main>
  )
}

export default PatternLibrary
