import { jsPDF as PDF } from 'jspdf'

// todo: split text to pages and put text in a template
const downloadPage = (text) => {
  const doc = new PDF()
  doc.setFontSize(11)
  doc.text(text, 10, 10)
  // doc.addPage()
  // doc.save(`${path}.pdf`)
  window.open(doc.output('bloburl'))
}

export default downloadPage
