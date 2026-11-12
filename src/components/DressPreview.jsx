import { Fragment, useId } from 'react'
import { dressConfigs } from './dressConfigs'

function DressPreview({
  garmentId,
  selectedOptions = {},
  selectedComponentId,
}) {
  const uid = useId().replace(/:/g, '')
  const config = dressConfigs[garmentId]

  if (!config) return null

  const previewOptions =
    String(garmentId) === '2' && selectedComponentId
      ? {
          ...selectedOptions,
          8: selectedOptions[selectedComponentId] ?? selectedOptions['8'],
        }
      : selectedOptions

  // Capas con pieza elegida: la pieza sustituye la zona del vestido base.
  const activeLayers = config.layers
    .map((layer) => ({
      layer,
      piece: layer.pieces[previewOptions[layer.componentId]],
    }))
    .filter(({ piece }) => piece)
  const base = activeLayers.find(({ piece }) => piece.base)?.piece.base ?? config.base

  const baseMaskId = `${uid}-base`
  const isCorset = ['6', '7'].includes(String(garmentId))
  const isDress = ['1', '2'].includes(String(garmentId))

  return (
    <section className="dress-preview">
      <svg
        className={`dress-preview__canvas${isCorset ? ' dress-preview__canvas--corset' : ''}${isDress ? ' dress-preview__canvas--dress' : ''}`}
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
            {activeLayers.flatMap(({ layer, piece }) =>
              [].concat(piece.hide ?? layer.hide ?? []).map((points) => (
                <polygon key={`${layer.slot}-${points}`} points={points} fill="black" />
              ))
            )}
          </mask>

          <linearGradient id={`${uid}-ribbon`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbf1e7" />
            <stop offset="1" stopColor="#efdcc7" />
          </linearGradient>

          <filter id={`${uid}-modern-base-tone`}>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.96" />
              <feFuncG type="linear" slope="0.96" />
              <feFuncB type="linear" slope="0.96" />
            </feComponentTransfer>
          </filter>

          <filter id={`${uid}-modern-bodice-tone`}>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.035" />
              <feFuncG type="linear" slope="1.06" />
              <feFuncB type="linear" slope="1.11" />
            </feComponentTransfer>
          </filter>

          {activeLayers.map(({ layer, piece }) => {
            const clip = piece.clip ?? layer.clip

            return clip ? (
              <clipPath key={layer.slot} id={`${uid}-${layer.slot}-clip`}>
                <polygon points={clip} />
              </clipPath>
            ) : null
          })}

          {activeLayers.map(({ layer, piece }) => {
            if (!piece.topFade && !piece.bottomFade) return null

            const maskId = `${uid}-${layer.slot}-fade`
            const topFadeStart = piece.topFade
              ? piece.y + piece.topFade.inset
              : null
            const bottomFadeStart = piece.bottomFade
              ? piece.y + piece.height - piece.bottomFade.height
              : null

            return (
              <Fragment key={layer.slot}>
                {piece.topFade && (
                  <linearGradient
                    id={`${uid}-${layer.slot}-top-fade-gradient`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={topFadeStart}
                    x2="0"
                    y2={topFadeStart + piece.topFade.height}
                  >
                    <stop offset="0" stopColor="black" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                )}
                {piece.bottomFade && (
                  <linearGradient
                    id={`${uid}-${layer.slot}-bottom-fade-gradient`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1={bottomFadeStart}
                    x2="0"
                    y2={piece.y + piece.height}
                  >
                    <stop offset="0" stopColor="white" />
                    <stop offset="1" stopColor="black" />
                  </linearGradient>
                )}
                <mask
                  id={maskId}
                  maskUnits="userSpaceOnUse"
                  maskContentUnits="userSpaceOnUse"
                  x={piece.x}
                  y={piece.y}
                  width={piece.width}
                  height={piece.height}
                >
                  <rect x={piece.x} y={piece.y} width={piece.width} height={piece.height} fill="white" />
                  {piece.topFade && (
                    <>
                      <rect
                        x={piece.x}
                        y={piece.y}
                        width={piece.width}
                        height={piece.topFade.inset}
                        fill="black"
                      />
                      <rect
                        x={piece.x}
                        y={topFadeStart}
                        width={piece.width}
                        height={piece.topFade.height}
                        fill={`url(#${uid}-${layer.slot}-top-fade-gradient)`}
                      />
                    </>
                  )}
                  {piece.bottomFade && (
                    <rect
                      x={piece.x}
                      y={bottomFadeStart}
                      width={piece.width}
                      height={piece.bottomFade.height}
                      fill={`url(#${uid}-${layer.slot}-bottom-fade-gradient)`}
                    />
                  )}
                </mask>
              </Fragment>
            )
          })}
        </defs>

        {base && (
          <image
            href={base}
            width={config.width}
            height={config.height}
            mask={`url(#${baseMaskId})`}
            filter={
              config.baseFilter ? `url(#${uid}-${config.baseFilter})` : undefined
            }
          />
        )}

        {activeLayers.map(({ layer, piece }) => (
          <image
            key={`${layer.slot}-${piece.src}`}
            href={piece.src}
            x={piece.x}
            y={piece.y}
            width={piece.width}
            height={piece.height}
            preserveAspectRatio="none"
            clipPath={piece.clip || layer.clip ? `url(#${uid}-${layer.slot}-clip)` : undefined}
            mask={
              piece.topFade || piece.bottomFade
                ? `url(#${uid}-${layer.slot}-fade)`
                : undefined
            }
            filter={
              config.layerFilter
                ? `url(#${uid}-${config.layerFilter})`
                : undefined
            }
          >
            <title>{layer.alt}</title>
          </image>
        ))}

        {activeLayers.map(({ layer, piece }) =>
          piece.bottomEdge ? (
            <path
              key={`${layer.slot}-bottom-edge`}
              d={piece.bottomEdge}
              transform={`translate(${piece.x} ${piece.y}) scale(${piece.width / piece.sourceWidth} ${piece.height / piece.sourceHeight})`}
              fill="none"
              stroke="#4b3220"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null
        )}

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
