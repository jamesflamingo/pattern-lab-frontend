
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  createDesign,
  getComponents,
  getDesign,
  getGarment,
  updateDesign,
} from '../services/api'
import ComponentSelector from '../components/ComponentSelector'
import DressPreview from '../components/DressPreview'
import { dressConfigs, getAvailableOptions } from '../components/dressConfigs'

function PatternEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const designId = searchParams.get('design')

  const [garment, setGarment] = useState(null)
  const [components, setComponents] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedComponentId, setSelectedComponentId] = useState(null)
  const [designName, setDesignName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const isClassicDress = String(id) === '1'
  const hasDressPreview = String(id) in dressConfigs

  useEffect(() => {
    let active = true

    async function loadEditor() {
      setLoading(true)
      setError(null)

      try {
        const [garmentData, componentData, designData] = await Promise.all([
          getGarment(id),
          getComponents(id),
          designId ? getDesign(designId) : Promise.resolve(null),
        ])

        if (designData && String(designData.garmentId) !== String(id)) {
          throw new Error('This saved design belongs to a different pattern.')
        }

        if (!active) return

        const visibleComponents = (isClassicDress
          ? componentData.filter((component) =>
              ['2', '3', '7', '40'].includes(String(component.id))
            )
          : componentData
        ).map((component) => {
          const available = getAvailableOptions(id, component.id)
          if (!available) return component
          const options = component.options.filter((option) =>
            available.includes(option)
          )
          return {
            ...component,
            options,
            defaultOption: options.includes(component.defaultOption)
              ? component.defaultOption
              : options[0],
          }
        })

        const initialOptions = {}
        const initialSizes = {}

        visibleComponents.forEach((component) => {
          const savedOption = designData?.options?.[component.id]
          initialOptions[component.id] = component.options.includes(savedOption)
            ? savedOption
            : component.defaultOption

          initialSizes[component.id] =
            designData?.sizes?.[component.id] ?? component.defaultSize
        })

        setGarment(garmentData)
        setComponents(visibleComponents)
        setSelectedOptions(initialOptions)
        setSelectedSizes(initialSizes)
        setSelectedComponentId(visibleComponents[0]?.id ?? null)
        setDesignName(
          designData?.name ?? `${garmentData.name} — my design`
        )
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEditor()

    return () => {
      active = false
    }
  }, [designId, id, isClassicDress])

  function handleOptionChange(componentId, newOption) {
    setSelectedOptions((previousOptions) => ({
      ...previousOptions,
      [componentId]: newOption,
    }))
  }

  function handleSizeChange(componentId, newSize) {
    setSelectedSizes((previousSizes) => ({
      ...previousSizes,
      [componentId]: Number(newSize),
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const now = new Date().toISOString()

    const design = {
      name: designName.trim(),
      garmentId: String(id),
      options: selectedOptions,
      sizes: selectedSizes,
      updatedAt: now,
    }

    try {
      if (designId) {
        await updateDesign(designId, design)
      } else {
        await createDesign({ ...design, createdAt: now })
      }

      navigate('/collection')
    } catch (requestError) {
      setError(`Could not save your design: ${requestError.message}`)
      setSaving(false)
    }
  }

  const selectedComponent = components.find(
    (component) =>
      String(component.id) === String(selectedComponentId)
  )

  if (loading) {
    return (
      <main className="catalog-page">
        <p className="page-message" role="status">
          Loading pattern editor…
        </p>
      </main>
    )
  }

  if (error && !garment) {
    return (
      <main className="catalog-page">
        <p className="page-message error-message" role="alert">
          Could not load the pattern: {error}
        </p>
        <Link className="text-link" to="/library">
          Back to the pattern library
        </Link>
      </main>
    )
  }

  if (!garment) {
    return (
      <main className="catalog-page">
        <p className="page-message">Pattern not found.</p>
      </main>
    )
  }

  return (
    <main className="catalog-page editor-page">
      <header className="page-heading">
        <p className="section-kicker">
          {garment.category} <i>·</i> Pattern editor
        </p>

        <h1>{garment.name}</h1>
        <p>{garment.description}</p>
      </header>

      {hasDressPreview && (
        <DressPreview garmentId={String(id)} selectedOptions={selectedOptions} />
      )}

      <div className="editor-layout">
        <ComponentSelector
          components={components}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
        />

        <form className="editor-form" onSubmit={handleSave}>
          <label className="catalog-search">
            <span>Design name</span>
            <input
              required
              maxLength={80}
              value={designName}
              onChange={(event) => setDesignName(event.target.value)}
            />
          </label>

          {selectedComponent ? (
            <section className="component-editor">
              <p className="section-kicker">Pattern component</p>

              <h2>{selectedComponent.name}</h2>

              <label className="select-label" htmlFor="component-option">
                Style
              </label>

              <select
                id="component-option"
                value={selectedOptions[selectedComponent.id] ?? ''}
                onChange={(event) =>
                  handleOptionChange(
                    selectedComponent.id,
                    event.target.value
                  )
                }
              >
                {selectedComponent.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="select-label size-label" htmlFor="component-size">
                Size
              </label>

              <input
                id="component-size"
                type="number"
                required
                min="30"
                max="60"
                step="2"
                value={
                  selectedSizes[selectedComponent.id] ??
                  selectedComponent.defaultSize ??
                  38
                }
                onChange={(event) =>
                  handleSizeChange(
                    selectedComponent.id,
                    event.target.value
                  )
                }
              />

              <p className="field-note">
                Available sizes:{' '}
                {(garment.availableSizes || []).join(', ')}
              </p>
            </section>
          ) : (
            <p className="empty-state">
              No components are configured for this pattern yet.
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="next-step"
              disabled={saving || !components.length}
            >
              {saving
                ? 'Saving…'
                : designId
                  ? 'Update design'
                  : 'Save design'}
            </button>

            <Link className="text-link" to="/collection">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default PatternEditor
