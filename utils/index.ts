import html2canvas from 'html2canvas'
const download = require('downloadjs')

const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement('a')

  //fakeLink.style = 'display:none;'
  fakeLink.download = fileName

  fakeLink.href = blob

  document.body.appendChild(fakeLink)
  fakeLink.click()
  document.body.removeChild(fakeLink)

  fakeLink.remove()
}
export const exportAsImage = async (
  el: HTMLDivElement | null,
  imageFileName: string,
) => {
  if (el != null) {
    const canvas = await html2canvas(el)
    const image = canvas.toDataURL('image/png')
    download(image, imageFileName)
    //downloadImage(image, imageFileName)
  }
}
