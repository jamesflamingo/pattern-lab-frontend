import { useEffect, useMemo, useState } from 'react'
import FabricEstimate from '../components/FabricEstimate'
import CustomSelect from '../components/CustomSelect'
import { getBodySizes } from '../services/api'

const measurementRows = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulderWidth', label: 'Shoulder' },
  { key: 'armLength', label: 'Arm' },
]

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
    <main className="catalog-page measurements-page">
      <header className="page-heading">
        <h1>The Atelier</h1>
        <p>A space to design, customize and create your own garments.</p>
      </header>

      <div className="measurements-layout">
        <section className="measurements-layout__sizes" aria-labelledby="body-measurements-title">
          <h2 className="measurements-panel-title" id="body-measurements-title">Body Measurements</h2>
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

            <CustomSelect
              className="measurement-unit"
              label="Units"
              value={unit}
              options={[
                { value: 'cm', label: 'Metric (cm)' },
                { value: 'in', label: 'US / Imperial (in)' },
              ]}
              onChange={setUnit}
            />
          </section>

          {loading && <p className="page-message" role="status">Loading size references…</p>}
          {error && <p className="page-message error-message" role="alert">Could not load size references: {error}</p>}

          {!loading && !error && (
            <div className="measurement-table-wrap">
              {filteredSizes.length > 0 && (
                <table className="measurement-table measurement-table--sizes">
                  <caption>
                    Standard body measurements in {unit === 'cm' ? 'centimeters (cm)' : 'inches (in)'}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Size</th>
                      {filteredSizes.map((item) => (
                        <th scope="col" key={item.id}>{item.size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {measurementRows.map(({ key, label }) => (
                      <tr key={key}>
                        <th scope="row">{label}</th>
                        {filteredSizes.map((item) => (
                          <td key={item.id}>{formatMeasurement(item[key])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!filteredSizes.length && <p className="empty-state">No size references match that number.</p>}
            </div>
          )}
        </section>
        <FabricEstimate />
      </div>
    </main>
  )
}

export default Measurements
