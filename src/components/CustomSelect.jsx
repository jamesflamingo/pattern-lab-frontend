import { useEffect, useId, useRef, useState } from 'react'

function CustomSelect({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const id = useId()
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (!open) return

    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    return () => document.removeEventListener('pointerdown', handleOutsideClick)
  }, [open])

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  function showOptions() {
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)))
    setOpen(true)
  }

  function selectOption(option) {
    onChange(option)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + options.length) % options.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
    }
  }

  return (
    <div
      className={`catalog-category category-filter ${className}`}
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <span id={`${id}-label`}>{label}</span>
      <button
        ref={buttonRef}
        type="button"
        className="category-filter__trigger"
        disabled={options.length === 0}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-options` : undefined}
        onClick={() => open ? setOpen(false) : showOptions()}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault()
            showOptions()
          }
        }}
      >
        <span id={`${id}-value`}>{options.find((option) => option.value === value)?.label}</span>
        <span className="category-filter__arrow" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={`${id}-options`}
          className="category-filter__options"
          role="listbox"
          aria-labelledby={`${id}-label`}
          onKeyDown={handleKeyDown}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => { optionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={value === option.value}
              tabIndex={activeIndex === index ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
