export function getBlob (base64) {
  return b64toBlob(base64)
}
// function getContentType (base64) {
//   return /data:([^;]*);/i.exec(base64)[1]
// }
// function getData (base64) {
//   return base64.substr(base64.indexOf('base64,') + 7, base64.length)
// }
function b64toBlob (b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray)
  }
  var blob = new Blob(byteArrays, { type: contentType });
  return blob
}
