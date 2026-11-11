import { useId } from 'react'
import { dressConfigs } from './dressConfigs'

function DressPreview({ garmentId, selectedOptions = {} }) {
  const uid = useId().replace(/:/g, '')
  const config = dressConfigs[garmentId]

  if (!config) return null

  // Capas con pieza elegida: la pieza sustituye la zona del vestido base.
  const activeLayers = config.layers
    .map((layer) => ({
      layer,
      piece: layer.pieces[selectedOptions[layer.componentId]],
    }))
    .filter(({ piece }) => piece)

  const baseMaskId = `${uid}-base`

  return (
    <section className="dress-preview">
      <h2>Garment preview</h2>

      <svg
        className="dress-preview__canvas"
        viewBox={`0 0 ${config.width} ${config.height}`}
        role="img"
        aria-label={config.name}
      >
        <defs>
          <mask
            id={baseMaskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={config.width}
            height={config.height}
          >
            <rect width={config.width} height={config.height} fill="white" />
            {activeLayers.flatMap(({ layer }) =>
              [].concat(layer.hide).map((points) => (
                <polygon key={`${layer.slot}-${points}`} points={points} fill="black" />
              ))
            )}
          </mask>

          <linearGradient id={`${uid}-ribbon`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf1e7" />
            <stop offset="1" stopColor="#efdcc7" />
          </linearGradient>

          {activeLayers.map(({ layer }) =>
            layer.clip ? (
              <clipPath key={layer.slot} id={`${uid}-${layer.slot}-clip`}>
                <polygon points={layer.clip} />
              </clipPath>
            ) : null
          )}
        </defs>

        <image
          href={config.base}
          width={config.width}
          height={config.height}
          mask={`url(#${baseMaskId})`}
        />

        {activeLayers.map(({ layer, piece }) => (
          <image
            key={`${layer.slot}-${piece.src}`}
            href={piece.src}
            x={piece.x}
            y={piece.y}
            width={piece.width}
            height={piece.height}
            preserveAspectRatio="none"
            clipPath={layer.clip ? `url(#${uid}-${layer.slot}-clip)` : undefined}
          >
            <title>{layer.alt}</title>
          </image>
        ))}

            {activeLayers.map(({ layer }) =>
          layer.overlay ? (
            <image
              key={`${layer.slot}-overlay`}
              href={layer.overlay.src}
              x={layer.overlay.x}
              y={layer.overlay.y}
              width={layer.overlay.width}
              height={layer.overlay.height}
              preserveAspectRatio="none"
            />
          ) : null
        )}

        {activeLayers.map(({ layer }) =>
          layer.drawings ? (
            <g
              key={`${layer.slot}-drawings`}
              fill={`url(#${uid}-ribbon)`}
              stroke="#4b3220"
              strokeWidth="3.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {layer.drawings.map((drawing) => (
                <g key={drawing.d}>
                  <path d={drawing.d} />
                  <path d={drawing.shade} fill="none" strokeWidth="1.6" opacity="0.45" />
                </g>
              ))}
            </g>
          ) : null
        )}
      </svg>
    </section>
  )
}

export default DressPreview
