import crypto from "crypto-js"

const secret_key = process.env.SECRET_KEY //prod only
//const secret_key = "abcd"


export function encryptData(data) {

    return {
        id: encrypt(data.id),
        label: encrypt(data.label),
        nationality: encrypt(data.nationality),
        year_of_birth: encrypt(data.year_of_birth),
        image_url: encrypt(data.image_url)
    }
  }

  function encrypt(data) {
    return crypto.AES.encrypt(data, secret_key).toString();
  }

  function decrypt(encryptedData) {
    return crypto.AES.decrypt(encryptedData, secret_key).toString(crypto.enc.Utf8)
}

export function decryptPerson(data) {

    return {
        id: decrypt(data.id),
        label: decrypt(data.label),
        nationality: decrypt(data.nationality),
        year_of_birth: decrypt(data.year_of_birth),
        image_url: decrypt(data.image_url)
    }
}