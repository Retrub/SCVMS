const CryptoJS = require("crypto-js");

const encrypt = (obj) => {
  if (!process.env.SECRET_KEY_ENCRYPTION) {
    throw new Error("SECRET_KEY_ENCRYPT kintamasis nenustatytas.");
  }

  const jsonString = JSON.stringify(obj);

  const encrypted = CryptoJS.AES.encrypt(
    jsonString,
    process.env.SECRET_KEY_ENCRYPTION
  ).toString();
  return encrypted;
};

const decrypt = (encryptedObj, SECRET_KEY) => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY_DECRYPT kintamasis nenustatytas.");
  }

  const bytes = CryptoJS.AES.decrypt(encryptedObj, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};

module.exports = {
  encrypt,
  decrypt,
};
