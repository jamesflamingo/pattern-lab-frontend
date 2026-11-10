
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGarments } from '../services/api'

import modernDress from '../assets/9401d9ef-082f-464b-b45a-49f69ecabff6.png'
import classicDress from '../assets/45e9085b-bcaf-4f3a-ae4c-8c28deba562a.png'

import classicCorset from '../assets/corset-clasico.png'
import modernCorset from '../assets/corset-moderno.png'

import classicSkirt from '../assets/910c3e25-63d8-4067-86d6-d91d0945bac1.png'
import modernSkirt from '../assets/f42f5492-ca92-4705-bc75-2dc7c7bc50bb.png'

const categories = [
  {
    name: 'Dresses',
    category: 'Dress',
    description: 'Explore timeless and contemporary dress designs.'
  },
  {
    name: 'Corsets',
    category: 'Corset',
    description: 'Customize structure, shape and silhouette.'
  },
  {
    name: 'Skirts',
    category: 'Skirt',
    description: 'Create your own skirt with customizable details.'
  }
]

function Dashboard() {
  const [garments, setGarments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchGarments() {
      try {
        const data = await getGarments()
        setGarments(data)
      } catch (err) {
        console.error(err)
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

  function getGarmentImage(garment) {
    const id = String(garment.id)

    const images = {
      '1': classicDress,
      '2': modernDress,
      '6': classicCorset,
      '7': modernCorset,
      '21': classicSkirt,
      '25': modernSkirt
    }

    return images[id] || `${apiUrl}${garment.image}`
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <p className="eyebrow">Pattern Lab · Atelier</p>

        <h1>Pattern Lab</h1>

        <p className="dashboard-intro">
          Design, customize and create your own garment patterns.
          Explore silhouettes, experiment with details and bring
          your designs to life.
        </p>
      </header>

      {loading && <p>Loading collection...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="garment-categories">
          {categories.map(category => {
            const categoryGarments = garments.filter(
              garment => garment.category === category.category
            )

            return (
              <section
                className="garment-category"
                key={category.category}
              >
                <div className="category-heading">
                  <div>
                    <p className="eyebrow">The Collection</p>
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                  </div>
                </div>

                <div className="garment-grid">
                  {categoryGarments.map(garment => (
                    <article
                      className="garment-card"
                      key={garment.id}
                    >
                      <Link
                        to={`/editor/${garment.id}`}
                        className="garment-image-link"
                      >
                        <div className="garment-card-image">
                          <img
                            src={getGarmentImage(garment)}
                            alt={garment.name}
                          />
                        </div>
                      </Link>

                      <div className="garment-card-content">
                        <p className="garment-style">
                          {garment.style}
                        </p>

                        <h3>{garment.name}</h3>

                        <p>{garment.description}</p>

                        <Link to={`/editor/${garment.id}`}>
                          Customize garment →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {categoryGarments.length === 0 && (
                  <p>No garments available in this category.</p>
                )}
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Dashboard
