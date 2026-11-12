import { useRef } from 'react'

function SizeInput({ id, value, onChange }) {
  const inputRef = useRef(null)

  function changeStep(direction) {
    const input = inputRef.current
    if (direction === 'up') {
      input.stepUp()
    } else {
      input.stepDown()
    }
    onChange(input.value)
  }

  return (
    <div className="size-input">
      <input
        ref={inputRef}
        id={id}
        type="number"
        required
        min="30"
        max="60"
        step="2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="size-input__controls">
        <button type="button" aria-label="Increase size" onClick={() => changeStep('up')}>
          <span className="size-input__arrow size-input__arrow--up" />
        </button>
        <button type="button" aria-label="Decrease size" onClick={() => changeStep('down')}>
          <span className="size-input__arrow size-input__arrow--down" />
        </button>
      </div>
    </div>
  )
}

export default SizeInput
