
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
import CustomSelect from '../components/CustomSelect'
import SizeInput from '../components/SizeInput'
import DressPreview from '../components/DressPreview'
import { dressConfigs, getAvailableOptions } from '../components/dressConfigs'
import editorPencils from '../assets/c46a9cca-1ea3-4309-9015-12cc2b9905c7.png'
import classicSkirtPreview from '../assets/classic-skirt-basic-v2.png'
import classicSkirtRuffles from '../assets/classic-skirt-ruffles-v2.png'
import classicSkirtOrnate from '../assets/classic-skirt-ornate-v2.png'
import modernSkirtPunk from '../assets/modern-skirt-punk-v2.png'
import modernSkirtShort from '../assets/modern-skirt-short-v2.png'
import modernSkirtLong from '../assets/modern-skirt-long-v2.png'

const skirtDesignId = 'modern-skirt-design'
const classicSkirtDesignId = 'classic-skirt-design'
const classicSkirtDesigns = {
  Basic: { src: classicSkirtPreview, x: 7, y: -7, width: 1219, height: 1290 },
  Ruffles: { src: classicSkirtRuffles, x: 0, y: 0, width: 1233, height: 1275 },
  'Ornate ruffles': { src: classicSkirtOrnate, x: 0, y: 0, width: 1233, height: 1276 },
}
const skirtDesignLabels = {
  Plain: 'Short basic',
  'Chains and buckles': 'Punk',
  'Long wrap': 'Long basic',
}
const modernSkirtPreviews = {
  Plain: { src: modernSkirtShort, x: 55, y: -117, width: 922, height: 1382 },
  'Chains and buckles': { src: modernSkirtPunk, x: 55, y: -117, width: 922, height: 1382 },
  'Long wrap': { src: modernSkirtLong, x: 0, y: 0, width: 1024, height: 1535 },
}

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
  const isModernDress = String(id) === '2'
  const isClassicCorset = String(id) === '6'
  const isModernCorset = String(id) === '7'
  const isModernSkirt = String(id) === '25'
  const isClassicSkirt = String(id) === '21'
  const hasGarmentPreview = String(id) in dressConfigs || isModernSkirt || isClassicSkirt

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

        const editorComponents = (isClassicDress
          ? componentData.filter((component) =>
              ['2', '3', '7', '40'].includes(String(component.id))
            )
          : isClassicCorset
            ? componentData.filter(
                (component) => component.type === 'neckline'
              )
          : isModernCorset
            ? componentData.filter((component) => component.type === 'straps')
          : isModernDress
            ? componentData.filter((component) =>
                ['8', '9'].includes(String(component.id))
              )
          : componentData
        ).map((component) => {
          const modernOptions = {
            8: ['Sweetheart Straps'],
            9: ['High Neck'],
          }
          const modernCorsetOptions = {
            73: [
              'Bow-tie Straps',
              'Buckle Straps',
              'Ruffle Straps',
            ],
          }
          const available = isModernDress
            ? modernOptions[component.id]
            : isModernCorset
              ? modernCorsetOptions[component.id]
            : getAvailableOptions(id, component.id)
          const configuredComponent = available
            ? {
                ...component,
                options: available,
                defaultOption:
                  isClassicDress && String(component.id) === '40'
                    ? 'Asymmetric'
                    : available.includes(component.defaultOption)
                      ? component.defaultOption
                      : available[0],
              }
            : component

          return isModernDress && String(component.id) === '8'
            ? { ...configuredComponent, name: 'Strap' }
            : configuredComponent
        })

        const visibleComponents = isModernDress
          ? [
              {
                ...editorComponents.find((component) => String(component.id) === '8'),
                name: 'Strap',
              },
              ...editorComponents.filter((component) => String(component.id) === '9'),
              {
                id: 'arms',
                name: 'Arms',
                options: ['Off-Shoulder'],
                defaultOption: 'Off-Shoulder',
                defaultSize: editorComponents[0]?.defaultSize ?? 38,
              },
            ]
          : isModernSkirt
            ? [
                {
                  id: 'modern-skirt-long',
                  name: 'Long',
                  components: [{
                    id: skirtDesignId,
                    options: ['Long wrap'],
                    defaultOption: 'Long wrap',
                    defaultSize: garmentData.defaultSize ?? 38,
                  }],
                },
                {
                  id: 'modern-skirt-short',
                  name: 'Short',
                  components: [{
                    id: skirtDesignId,
                    options: ['Plain', 'Chains and buckles'],
                    defaultOption: 'Plain',
                    defaultSize: garmentData.defaultSize ?? 38,
                  }],
                },
              ]
            : isClassicSkirt
              ? [{
                  id: classicSkirtDesignId,
                  name: 'Design',
                  options: Object.keys(classicSkirtDesigns),
                  defaultOption: 'Basic',
                  defaultSize: garmentData.defaultSize ?? 38,
                }]
              : editorComponents

        const initialOptions = {}
        const initialSizes = {}

        visibleComponents
          .flatMap((component) => component.components ?? [component])
          .forEach((component) => {
            if (isModernSkirt && component.id === skirtDesignId) {
              const savedOption = designData?.options?.[skirtDesignId]
              initialOptions[skirtDesignId] =
                savedOption && Object.hasOwn(skirtDesignLabels, savedOption)
                  ? savedOption
                  : 'Long wrap'
              initialSizes[skirtDesignId] =
                designData?.sizes?.[skirtDesignId] ?? component.defaultSize
              return
            }
            const savedOption = designData?.options?.[component.id]
            const hasSavedOption = component.options.includes(savedOption)
            if (!isModernDress || designData || hasSavedOption) {
              initialOptions[component.id] = hasSavedOption
                ? savedOption
                : component.defaultOption
            }

            initialSizes[component.id] =
              designData?.sizes?.[component.id] ?? component.defaultSize
          })

        setGarment(garmentData)
        setComponents(visibleComponents)
        setSelectedOptions(initialOptions)
        setSelectedSizes(initialSizes)
        setSelectedComponentId(
          isModernSkirt
            ? initialOptions[skirtDesignId] === 'Long wrap'
              ? 'modern-skirt-long'
              : 'modern-skirt-short'
            : visibleComponents[0]?.id ?? null
        )
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
  }, [
    designId,
    id,
    isClassicDress,
    isClassicCorset,
    isModernCorset,
    isModernDress,
    isModernSkirt,
    isClassicSkirt,
  ])

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

  function handleComponentSelect(componentId) {
    setSelectedComponentId(componentId)

    if (isModernSkirt) {
      const component = components.find((item) => item.id === componentId)?.components?.[0]
      if (component) {
        setSelectedOptions((previousOptions) => ({
          ...previousOptions,
          [skirtDesignId]: component.options.includes(previousOptions[skirtDesignId])
            ? previousOptions[skirtDesignId]
            : component.defaultOption,
        }))
      }
      return
    }

    if (!isModernDress) return

    const component = components.find(
      (item) => String(item.id) === String(componentId)
    )
    if (!component?.options?.length) return

    setSelectedOptions((previousOptions) => ({
      ...previousOptions,
      [component.id]: component.defaultOption ?? component.options[0],
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    const createPattern = event.nativeEvent.submitter?.value === 'create-pattern'
    setSaving(true)
    setError(null)

    const now = new Date().toISOString()

    const design = {
      name: designName.trim(),
      garmentId: String(id),
      options: selectedOptions,
      sizes: selectedSizes,
      updatedAt: now,
      ...(createPattern ? { pattern2d: 'generic-v1' } : {}),
    }

    try {
      const savedDesign = designId
        ? await updateDesign(designId, design)
        : await createDesign({ ...design, createdAt: now })

      if (createPattern && savedDesign.pattern2d !== 'generic-v1') {
        throw new Error('The server did not save the example pattern.')
      }

      navigate('/collection', createPattern ? { state: { designId: savedDesign.id } } : undefined)
    } catch (requestError) {
      setError(`Could not save your design: ${requestError.message}`)
      setSaving(false)
    }
  }

  const selectedComponent = components.find(
    (component) =>
      String(component.id) === String(selectedComponentId)
  )
  const classicSkirtOption = selectedOptions[classicSkirtDesignId] ?? 'Basic'
  const classicPreview = classicSkirtDesigns[classicSkirtOption] ?? classicSkirtDesigns.Basic
  const modernPreview = modernSkirtPreviews[selectedOptions[skirtDesignId]] ?? modernSkirtPreviews['Long wrap']

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
    <main
      className={`catalog-page editor-page${hasGarmentPreview ? ' editor-page--with-preview' : ''}${isModernSkirt || isClassicSkirt ? ' editor-page--skirt' : ''}`}
    >
      <header className="page-heading">
        <p className="section-kicker">
          {garment.category} <i>·</i> Pattern editor
        </p>

        <h1>{garment.name}</h1>
        <p>{garment.description}</p>
      </header>

      {isModernSkirt || isClassicSkirt ? (
        <section className="dress-preview skirt-preview" aria-label={`${isModernSkirt ? 'Modern' : 'Classic'} skirt preview`}>
          <svg
            className={`dress-preview__canvas skirt-preview__image${isModernSkirt ? ' skirt-preview__image--modern' : ' skirt-preview__image--classic'}`}
            viewBox={isModernSkirt ? '0 0 1024 1535' : '0 0 1233 1276'}
            role="img"
            aria-label={isModernSkirt ? `Modern skirt: ${skirtDesignLabels[selectedOptions[skirtDesignId]] ?? 'Long basic'}` : `Classic skirt: ${classicSkirtOption}`}
          >
            <image
              key={isModernSkirt ? modernPreview.src : classicPreview.src}
              href={isModernSkirt ? modernPreview.src : classicPreview.src}
              x={isModernSkirt ? modernPreview.x : classicPreview.x}
              y={isModernSkirt ? modernPreview.y : classicPreview.y}
              width={isModernSkirt ? modernPreview.width : classicPreview.width}
              height={isModernSkirt ? modernPreview.height : classicPreview.height}
            />
          </svg>
        </section>
      ) : hasGarmentPreview && (
        <DressPreview
          garmentId={String(id)}
          selectedOptions={selectedOptions}
          selectedComponentId={selectedComponentId}
        />
      )}

      <form className="editor-layout" onSubmit={handleSave}>
        <ComponentSelector
          key={id}
          components={components}
          selectedComponentId={selectedComponentId}
          onSelectComponent={handleComponentSelect}
        />

        <div className="editor-form">
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

              {(selectedComponent.components ?? [selectedComponent]).map(
                (component) => (
                  <div className="component-editor__fields" key={component.id}>
                    {selectedComponent.components && !isModernSkirt && (
                      <h3>{component.name}</h3>
                    )}

                    <CustomSelect
                      className="component-style-select"
                      label="Style"
                      value={
                        selectedOptions[component.id] ??
                        component.defaultOption ??
                        component.options[0] ??
                        ''
                      }
                      options={component.options.map((option) => ({
                        value: option,
                        label: isModernSkirt ? skirtDesignLabels[option] : option,
                      }))}
                      onChange={(option) => handleOptionChange(component.id, option)}
                    />

                    <label
                      className="select-label size-label"
                      htmlFor={`component-size-${component.id}`}
                    >
                      Size
                    </label>

                    <SizeInput
                      id={`component-size-${component.id}`}
                      value={
                        selectedSizes[component.id] ??
                        component.defaultSize ??
                        38
                      }
                      onChange={(value) => handleSizeChange(component.id, value)}
                    />
                  </div>
                )
              )}

              <p className="field-note">
                Available sizes:{' '}
                {(garment.availableSizes || []).join(', ')}
              </p>
            </section>
          ) : (
            <p className="empty-state">
              {components.length
                ? 'Select a garment component to add it to the preview.'
                : 'No components are configured for this pattern yet.'}
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>

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
                : 'Save Design'}
          </button>

          <button type="submit" className="next-step pattern-create" value="create-pattern" disabled={saving || !components.length}>
            Create 2D Pattern
          </button>

          <Link className="text-link" to="/collection">
            Cancel
          </Link>
        </div>
        <img className="editor-decoration" src={editorPencils} alt="" />
      </form>
    </main>
  )
}

export default PatternEditor
