export function extractTextPreview(html) {
  if (!html) {
    return ''
  }

  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)
}

export function formatRelativeTime(dateString) {
  if (!dateString) {
    return 'just now'
  }

  const now = new Date()
  const target = new Date(dateString)
  const diffInMinutes = Math.round((now - target) / 60000)

  if (diffInMinutes < 1) {
    return 'just now'
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  }

  const diffInHours = Math.round(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`
  }

  const diffInDays = Math.round(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  return target.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTimestamp(dateString) {
  if (!dateString) {
    return ''
  }

  return new Date(dateString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatRoleLabel(role) {
  if (!role) {
    return 'Viewer'
  }

  const normalized = role.toLowerCase()
  if (normalized === 'owner') {
    return 'Owner'
  }

  if (normalized === 'editor') {
    return 'Editor'
  }

  return 'Viewer'
}
