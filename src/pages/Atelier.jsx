
import { Link } from 'react-router-dom'
import '../styles/atelier.css'

const categories = [
  {
    id: 'dresses',
    number: '01',
    title: 'Dresses',
    description: 'Explore timeless and contemporary dress designs.',
    link: '/library',
  },
  {
    id: 'corsets',
    number: '02',
    title: 'Corsets',
    description: 'Discover structure, shape and couture details.',
    link: '/library',
  },
  {
    id: 'skirts',
    number: '03',
    title: 'Skirts',
    description: 'Experiment with silhouettes, lengths and volume.',
    link: '/library',
  },
  {
    id: 'other',
    number: '04',
    title: 'Other Garments',
    description: 'Explore new possibilities in garment construction.',
    link: '/library',
  },
]

function Atelier() {
  return (
    <main className="atelier-page">

      <section className="atelier-hero">
        <span className="atelier-eyebrow">
          PATTERN LAB · CREATIVE STUDIO
        </span>

        <h1>The Atelier</h1>

        <p className="atelier-intro">
          A space to design, customize and create
          your own garments.
        </p>

        <span className="atelier-hero-line" />

        <p className="atelier-subtitle">
          From the first sketch to the final pattern.
        </p>

        <Link to="/library" className="atelier-button">
          Explore the collection
          <span>↗</span>
        </Link>
      </section>

      <section className="atelier-collections">

        <div className="atelier-section-heading">
          <div>
            <span className="atelier-eyebrow">
              YOUR CREATIVE SPACE
            </span>

            <h2>Choose your starting point</h2>
          </div>

          <span className="atelier-section-number">
            COLLECTION · 001
          </span>
        </div>

        <div className="atelier-grid">
          {categories.map((category) => (
            <Link
              to={category.link}
              className="atelier-category"
              key={category.id}
            >
              <div className="atelier-category-top">
                <span>{category.number}</span>
                <span>↗</span>
              </div>

              <div className="atelier-category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <div className="atelier-category-footer">
                <span>EXPLORE CATEGORY</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="atelier-bottom">
        <span>THE ART OF PATTERN MAKING</span>
        <p>Imagine. Design. Create.</p>
      </section>

    </main>
  )
}

export default Atelier
