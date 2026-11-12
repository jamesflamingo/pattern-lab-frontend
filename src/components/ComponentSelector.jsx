function ComponentSelector({
  components,
  selectedComponentId,
  onSelectComponent
}) {
  return (
    <section className="component-selector">
      <h2>Garment Components</h2>

      <div className="component-list">
        {components.map((component) => (
          <button
            key={component.id}
            type="button"
            className={
              String(component.id) === String(selectedComponentId)
                ? 'component-button active'
                : 'component-button'
            }
            onClick={() => onSelectComponent(component.id)}
          >
            <span>{component.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ComponentSelector