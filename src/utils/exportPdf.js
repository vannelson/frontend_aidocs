import html2pdf from 'html2pdf.js'

function buildFileName(title) {
  const safeTitle = (title || 'untitled-document')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${safeTitle || 'untitled-document'}.pdf`
}

function buildExportMarkup(title, content) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; padding: 32px 40px;">
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #dbeafe;">
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #2563eb; margin-bottom: 12px;">
          GoodDocs export
        </div>
        <h1 style="margin: 0; font-size: 28px; line-height: 1.1; color: #0f172a;">
          ${title || 'Untitled document'}
        </h1>
      </div>
      <div style="font-size: 14px; line-height: 1.7;">
        ${content || '<p></p>'}
      </div>
    </div>
  `
}

export async function exportDocumentToPdf({ title, content }) {
  const container = window.document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '0'
  container.style.width = '794px'
  container.style.background = '#ffffff'
  container.innerHTML = buildExportMarkup(title, content)

  window.document.body.appendChild(container)

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: buildFileName(title),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'pt',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .from(container)
      .save()
  } finally {
    container.remove()
  }
}
