function CorsetPreview({
  components,
  selectedComponentId,
  onSelectComponent
}) {
  function selectComponent(type) {
    const component = components.find(
      (item) => item.type === type
    )

    if (component) {
      onSelectComponent(component.id)
    }
  }

  function getZoneStyle(type) {
    const component = components.find(
      (item) => item.type === type
    )

    const selected = component?.id === selectedComponentId

    return {
      fill: selected ? '#b58b63' : 'transparent',
      fillOpacity: selected ? 0.2 : 0,
      stroke: selected ? '#8b6848' : 'transparent',
      strokeWidth: 2,
      cursor: 'pointer'
    }
  }

  return (
    <section className="corset-preview">
      <h2>Garment Sketch</h2>

      <div className="corset-sketch">
        <img
          src="/images/corset-sketch.png"
          alt="Hand-drawn corset illustration"
        />

        <svg
          viewBox="0 0 400 500"
          className="corset-hotspots"
        >
          <path
            d="M65 100 Q200 150 335 100 L320 230 Q200 270 80 230 Z"
            style={getZoneStyle('neckline')}
            onClick={() => selectComponent('neckline')}
          />

          <path
            d="M80 120 Q140 100 195 190 L195 280 L80 250 Z"
            style={getZoneStyle('cupShape')}
            onClick={() => selectComponent('cupShape')}
          />

          <path
            d="M205 190 Q260 100 320 120 L320 250 L205 280 Z"
            style={getZoneStyle('cupShape')}
            onClick={() => selectComponent('cupShape')}
          />

          <path
            d="M90 250 Q200 280 310 250 L345 440 Q200 470 55 440 Z"
            style={getZoneStyle('waist')}
            onClick={() => selectComponent('waist')}
          />

          <path
            d="M190 180 L210 180 L210 440 L190 440 Z"
            style={getZoneStyle('closure')}
            onClick={() => selectComponent('closure')}
          />

          <path
            d="M55 420 Q200 470 345 420 L345 455 Q200 495 55 455 Z"
            style={getZoneStyle('hem')}
            onClick={() => selectComponent('hem')}
          />
        </svg>
      </div>
    </section>
  )
}
