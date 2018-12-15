import CryptoJS from 'crypto-js'

export function encrypts (word, keyStr) { // 加密
  var key = CryptoJS.enc.Utf8.parse(keyStr)

  var srcs = CryptoJS.enc.Utf8.parse(word)

  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }) // 加密模式为ECB，补码方式为PKCS5Padding（也就是PKCS7）

  return encrypted.toString()
}

export function decrypts (word, keyStr) { // 解密
  var key = CryptoJS.enc.Utf8.parse(keyStr)

  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })

  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
