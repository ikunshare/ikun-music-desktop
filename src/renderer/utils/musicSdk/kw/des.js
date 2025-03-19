const arrayE = [
  31, 0, 1, 2, 3, 4, -1, -1,
  3, 4, 5, 6, 7, 8, -1, -1,
  7, 8, 9, 10, 11, 12, -1, -1,
  11, 12, 13, 14, 15, 16, -1, -1,
  15, 16, 17, 18, 19, 20, -1, -1,
  19, 20, 21, 22, 23, 24, -1, -1,
  23, 24, 25, 26, 27, 28, -1, -1,
  27, 28, 29, 30, 31, 30, -1, -1,
]

const arrayIP = [
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
  56, 48, 40, 32, 24, 16, 8, 0,
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
]

const arrayIP_1 = [
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25,
  32, 0, 40, 8, 48, 16, 56, 24,
]

const arrayLs = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]
const arrayLsMask = [0, 0x100001, 0x300003]
const arrayMask = Array.from({ length: 64 }, (_, i) => BigInt(2) ** BigInt(i))
arrayMask[63] = -arrayMask[63] // Handle the sign for the last element

const arrayP = [
  15, 6, 19, 20, 28, 11, 27, 16,
  0, 14, 22, 25, 4, 17, 30, 9,
  1, 7, 23, 13, 31, 26, 2, 8,
  18, 12, 29, 5, 21, 10, 3, 24,
]

const arrayPC_1 = [
  56, 48, 40, 32, 24, 16, 8, 0,
  57, 49, 41, 33, 25, 17, 9, 1,
  58, 50, 42, 34, 26, 18, 10, 2,
  59, 51, 43, 35, 62, 54, 46, 38,
  30, 22, 14, 6, 61, 53, 45, 37,
  29, 21, 13, 5, 60, 52, 44, 36,
  28, 20, 12, 4, 27, 19, 11, 3,
]

const arrayPC_2 = [
  13, 16, 10, 23, 0, 4, -1, -1,
  2, 27, 14, 5, 20, 9, -1, -1,
  22, 18, 11, 3, 25, 7, -1, -1,
  15, 6, 26, 19, 12, 1, -1, -1,
  40, 51, 30, 36, 46, 54, -1, -1,
  29, 39, 50, 44, 32, 47, -1, -1,
  43, 48, 38, 55, 33, 52, -1, -1,
  45, 41, 49, 35, 28, 31, -1, -1,
]

const matrixNSBox = [
  [
    14, 4, 3, 15, 2, 13, 5, 3, 13, 14, 6, 9, 11, 2, 0, 5,
    4, 1, 10, 12, 15, 6, 9, 10, 1, 8, 12, 7, 8, 11, 7, 0,
    0, 15, 10, 5, 14, 4, 9, 10, 7, 8, 12, 3, 13, 1, 3, 6,
    15, 12, 6, 11, 2, 9, 5, 0, 4, 2, 11, 14, 1, 7, 8, 13,
  ],
  [
    15, 0, 9, 5, 6, 10, 12, 9, 8, 7, 2, 12, 3, 13, 5, 2,
    1, 14, 7, 8, 11, 4, 0, 3, 14, 11, 13, 6, 4, 1, 10, 15,
    3, 13, 12, 11, 15, 3, 6, 0, 4, 10, 1, 7, 8, 4, 11, 14,
    13, 8, 0, 6, 2, 15, 9, 5, 7, 1, 10, 12, 14, 2, 5, 9,
  ],
  [
    10, 13, 1, 11, 6, 8, 11, 5, 9, 4, 12, 2, 15, 3, 2, 14,
    0, 6, 13, 1, 3, 15, 4, 10, 14, 9, 7, 12, 5, 0, 8, 7,
    13, 1, 2, 4, 3, 6, 12, 11, 0, 13, 5, 14, 6, 8, 15, 2,
    7, 10, 8, 15, 4, 9, 11, 5, 9, 0, 14, 3, 10, 7, 1, 12,
  ],
  [
    7, 10, 1, 15, 0, 12, 11, 5, 14, 9, 8, 3, 9, 7, 4, 8,
    13, 6, 2, 1, 6, 11, 12, 2, 3, 0, 5, 14, 10, 13, 15, 4,
    13, 3, 4, 9, 6, 10, 1, 12, 11, 0, 2, 5, 0, 13, 14, 2,
    8, 15, 7, 4, 15, 1, 10, 7, 5, 6, 12, 11, 3, 8, 9, 14,
  ],
  [
    2, 4, 8, 15, 7, 10, 13, 6, 4, 1, 3, 12, 11, 7, 14, 0,
    12, 2, 5, 9, 10, 13, 0, 3, 1, 11, 15, 5, 6, 8, 9, 14,
    14, 11, 5, 6, 4, 1, 3, 10, 2, 12, 15, 0, 13, 2, 8, 5,
    11, 8, 0, 15, 7, 14, 9, 4, 12, 7, 10, 9, 1, 13, 6, 3,
  ],
  [
    12, 9, 0, 7, 9, 2, 14, 1, 10, 15, 3, 4, 6, 12, 5, 11,
    1, 14, 13, 0, 2, 8, 7, 13, 15, 5, 4, 10, 8, 3, 11, 6,
    10, 4, 6, 11, 7, 9, 0, 6, 4, 2, 13, 1, 9, 15, 3, 8,
    15, 3, 1, 14, 12, 5, 11, 0, 2, 12, 14, 7, 5, 10, 8, 13,
  ],
  [
    4, 1, 3, 10, 15, 12, 5, 0, 2, 11, 9, 6, 8, 7, 6, 9,
    11, 4, 12, 15, 0, 3, 10, 5, 14, 13, 7, 8, 13, 14, 1, 2,
    13, 6, 14, 9, 4, 1, 2, 14, 11, 13, 5, 0, 1, 10, 8, 3,
    0, 11, 3, 5, 9, 4, 15, 2, 7, 8, 12, 15, 10, 7, 6, 12,
  ],
  [
    13, 7, 10, 0, 6, 9, 5, 15, 8, 4, 3, 10, 11, 14, 12, 5,
    2, 11, 9, 6, 15, 12, 0, 3, 4, 1, 14, 13, 1, 2, 7, 8,
    1, 2, 12, 15, 10, 4, 0, 3, 13, 14, 6, 9, 7, 8, 9, 6,
    15, 1, 5, 12, 3, 10, 14, 5, 8, 7, 11, 0, 4, 13, 2, 11,
  ],
]

const SECRET_KEY = 'ylzsxkwm'

/**
* Transform bits based on array mapping
* @param {Array} arrInt Transformation array
* @param {Number} n Length of transformation
* @param {BigInt} l Input value
* @returns {BigInt} Transformed value
*/
function bit_transform(arrInt, n, l) {
  let l2 = BigInt(0)
  for (let i = 0; i < n; i++) {
    if (arrInt[i] < 0 || ((l & arrayMask[arrInt[i]]) === BigInt(0))) {
      continue
    }
    l2 |= arrayMask[i]
  }
  return l2
}

/**
* DES 64-bit block encryption/decryption
* @param {Array} longs Array of subkeys
* @param {BigInt} l Input block
* @returns {BigInt} Encrypted/decrypted block
*/
function des64(longs, l) {
  let out = BigInt(0)
  let SOut = 0
  let pR = new Array(8).fill(0)
  let pSource = [BigInt(0), BigInt(0)]
  let sbi = 0
  let L = BigInt(0)
  let R = BigInt(0)

  out = bit_transform(arrayIP, 64, l)
  pSource[0] = out & BigInt(0xFFFFFFFF)
  pSource[1] = (out & (BigInt(-1) << BigInt(32))) >> BigInt(32)

  for (let i = 0; i < 16; i++) {
    R = pSource[1]
    R = bit_transform(arrayE, 64, R)
    R = R ^ longs[i]

    for (let j = 0; j < 8; j++) {
      pR[j] = Number((R >> BigInt(j * 8)) & BigInt(255))
    }

    SOut = 0
    for (sbi = 7; sbi >= 0; sbi--) {
      SOut <<= 4
      SOut |= matrixNSBox[sbi][pR[sbi]]
    }

    R = bit_transform(arrayP, 32, BigInt(SOut))
    L = pSource[0]
    pSource[0] = pSource[1]
    pSource[1] = L ^ R
  }

  // Swap
  [pSource[0], pSource[1]] = [pSource[1], pSource[0]]

  out = ((pSource[1] << BigInt(32)) & (BigInt(-1) << BigInt(32))) | (pSource[0] & BigInt(0xFFFFFFFF))
  out = bit_transform(arrayIP_1, 64, out)

  return out
}

/**
* Generate subkeys for encryption/decryption
* @param {BigInt} l Key value
* @param {Array} longs Array to store subkeys
* @param {Number} n Mode (0 for encryption, 1 for decryption)
*/
function sub_keys(l, longs, n) {
  let l2 = bit_transform(arrayPC_1, 56, l)

  for (let i = 0; i < 16; i++) {
    l2 = ((l2 & BigInt(arrayLsMask[arrayLs[i]])) << BigInt(28 - arrayLs[i])) |
           ((l2 & ~BigInt(arrayLsMask[arrayLs[i]])) >> BigInt(arrayLs[i]))
    longs[i] = bit_transform(arrayPC_2, 64, l2)
  }

  if (n === 1) {
    for (let j = 0; j < 8; j++) {
      [longs[j], longs[15 - j]] = [longs[15 - j], longs[j]]
    }
  }
}

/**
* Convert string to UTF-8 Uint8Array
* @param {String} str String to convert
* @returns {Uint8Array} UTF-8 encoded bytes
*/
function stringToBytes(str) {
  return new TextEncoder().encode(str)
}

/**
* Convert bytes to string
* @param {Uint8Array} bytes Bytes to convert
* @returns {String} Decoded string
*/
function bytesToString(bytes) {
  return new TextDecoder().decode(bytes)
}

/**
* Main encryption/decryption function
* @param {String|Uint8Array} msg Message to encrypt/decrypt
* @param {String|Uint8Array} key Encryption key (default: SECRET_KEY)
* @param {Number} mode Mode (0 for encryption, 1 for decryption)
* @returns {Uint8Array} Encrypted/decrypted bytes
*/
function encrypt(msg, key = SECRET_KEY, mode = 0) {
  // Convert inputs to bytes if they are strings
  if (typeof msg === 'string') {
    msg = stringToBytes(msg)
  }
  if (typeof key === 'string') {
    key = stringToBytes(key)
  }

  // Build key value
  let l = BigInt(0)
  for (let i = 0; i < 8; i++) {
    l = l | (BigInt(key[i]) << BigInt(i * 8))
  }

  const j = Math.floor(msg.length / 8)

  // Generate subkeys
  const arrLong1 = new Array(16).fill(BigInt(0))
  sub_keys(l, arrLong1, mode)

  // Process full blocks
  const arrLong2 = new Array(j).fill(BigInt(0))
  for (let m = 0; m < j; m++) {
    for (let n = 0; n < 8; n++) {
      arrLong2[m] |= BigInt(msg[n + m * 8]) << BigInt(n * 8)
    }
  }

  const arrLong3 = new Array(Math.floor((1 + 8 * (j + 1)) / 8)).fill(BigInt(0))

  for (let i1 = 0; i1 < j; i1++) {
    arrLong3[i1] = des64(arrLong1, arrLong2[i1])
  }

  // Process remaining bytes
  const arrByte1 = msg.slice(j * 8)
  let l2 = BigInt(0)
  for (let i1 = 0; i1 < msg.length % 8; i1++) {
    l2 |= BigInt(arrByte1[i1]) << BigInt(i1 * 8)
  }

  if (!mode) {
    arrLong3[j] = des64(arrLong1, l2)
  }

  // Convert results back to bytes
  const arrByte2 = new Uint8Array(8 * arrLong3.length)
  let i4 = 0
  for (const l3 of arrLong3) {
    for (let i6 = 0; i6 < 8; i6++) {
      arrByte2[i4] = Number((l3 >> BigInt(i6 * 8)) & BigInt(255))
      i4++
    }
  }

  return arrByte2
}

/**
* Base64 encrypt a message
* @param {String|Uint8Array} msg Message to encrypt
* @returns {String} Base64 encoded encrypted message
*/
function base64_encrypt(msg) {
  const b1 = encrypt(msg)
  const b64 = btoa(String.fromCharCode(...b1))
  return b64
}

/**
* Decrypt a base64 encrypted message
* @param {String} msg Base64 encoded encrypted message
* @returns {String} Decrypted message
*/
function base64_decrypt(msg) {
  const bytes = Uint8Array.from(atob(msg), c => c.charCodeAt(0))
  const b1 = encrypt(bytes, SECRET_KEY, 1)

  let endIndex = b1.length
  while (endIndex > 0 && b1[endIndex - 1] === 0) {
    endIndex--
  }

  return bytesToString(b1.slice(0, endIndex))
}

module.exports = {
  encrypt,
  base64_encrypt,
  base64_decrypt,
}
