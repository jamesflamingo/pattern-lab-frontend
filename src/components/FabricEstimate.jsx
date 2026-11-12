import { useState } from 'react'

const currencyFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

const numberFormatter = new Intl.NumberFormat('en-IE', {
  maximumFractionDigits: 3,
})

function FabricEstimate() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [price, setPrice] = useState('')

  const parseValue = (value) => {
    const normalized = value.trim().replace(',', '.')
    return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : NaN
  }
  const lengthValue = parseValue(length)
  const widthValue = parseValue(width)
  const priceValue = parseValue(price)
  const validLength = Number.isFinite(lengthValue) && lengthValue > 0
  const validWidth = Number.isFinite(widthValue) && widthValue > 0
  const validPrice = Number.isFinite(priceValue) && priceValue >= 0
  const meters = validLength ? lengthValue / 100 : null
  const total = meters !== null && validPrice ? meters * priceValue : null

  return (
    <section className="fabric-estimate" aria-labelledby="pattern-composer-title">
      <h2 className="measurements-panel-title" id="pattern-composer-title">Pattern Composer</h2>
      <div className="fabric-estimate__controls">
        <label className="catalog-search">
          <span>Fabric length (cm)</span>
          <input
            type="text"
            inputMode="decimal"
            value={length}
            onChange={(event) => setLength(event.target.value)}
            placeholder="For example, 150"
            aria-describedby={length !== '' && !validLength ? 'fabric-length-help' : undefined}
            aria-invalid={length !== '' && !validLength}
          />
          {length !== '' && !validLength && (
            <span id="fabric-length-help" className="fabric-estimate__help">
              Enter a length greater than zero.
            </span>
          )}
        </label>

        <label className="catalog-search">
          <span>Fabric width (cm)</span>
          <input
            type="text"
            inputMode="decimal"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
            placeholder="For example, 140"
            aria-describedby={width !== '' && !validWidth ? 'fabric-width-help' : undefined}
            aria-invalid={width !== '' && !validWidth}
          />
          {width !== '' && !validWidth && (
            <span id="fabric-width-help" className="fabric-estimate__help">
              Enter a width greater than zero.
            </span>
          )}
        </label>

        <label className="catalog-search">
          <span>Price per meter (€)</span>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="For example, 12"
            aria-describedby={price !== '' && !validPrice ? 'fabric-price-help' : undefined}
            aria-invalid={price !== '' && !validPrice}
          />
          {price !== '' && !validPrice && (
            <span id="fabric-price-help" className="fabric-estimate__help">
              Enter a valid price of zero or more.
            </span>
          )}
        </label>
      </div>

      <div className="measurement-table-wrap">
        <table className="measurement-table fabric-estimate__table">
          <caption>Estimated fabric and cost</caption>
          <thead>
            <tr>
              <th scope="col">Measurement</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody aria-live="polite">
            <tr>
              <th scope="row">Length (cm)</th>
              <td>{validLength ? numberFormatter.format(lengthValue) : '—'}</td>
            </tr>
            <tr>
              <th scope="row">Width (cm)</th>
              <td>{validWidth ? numberFormatter.format(widthValue) : '—'}</td>
            </tr>
            <tr>
              <th scope="row">Length (m)</th>
              <td>{meters !== null ? numberFormatter.format(meters) : '—'}</td>
            </tr>
            <tr>
              <th scope="row">Price per meter</th>
              <td>{validPrice ? currencyFormatter.format(priceValue) : '—'}</td>
            </tr>
            <tr>
              <th scope="row">Estimated cost</th>
              <td>{total !== null && Number.isFinite(total) ? currencyFormatter.format(total) : '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="fabric-estimate__note">
        {total !== null && !Number.isFinite(total)
          ? 'The estimate is too large to calculate. Enter smaller values.'
          : null}
      </p>
    </section>
  )
}

export default FabricEstimate
