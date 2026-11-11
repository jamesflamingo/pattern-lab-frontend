
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3001'
).replace(/\/+$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(
      detail || `Request failed (${response.status} ${response.statusText})`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function getGarments() {
  return request('/garments')
}

export function getGarment(id) {
  return request(`/garments/${encodeURIComponent(id)}`)
}

// Download all components and filter them by garmentId in JavaScript.
export async function getComponents(garmentId) {
  const components = await request('/components')

  if (!garmentId) {
    return components
  }

  return components.filter(
    (component) =>
      String(component.garmentId) === String(garmentId)
  )
}

export function getBodySizes() {
  return request('/bodySizes')
}

export function getDesigns() {
  return request('/designs')
}

export function getDesign(id) {
  return request(`/designs/${encodeURIComponent(id)}`)
}

export function createDesign(design) {
  return request('/designs', {
    method: 'POST',
    body: JSON.stringify(design),
  })
}

export function updateDesign(id, design) {
  return request(`/designs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(design),
  })
}

export function deleteDesign(id) {
  return request(`/designs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
