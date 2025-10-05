// src/services/storage.service.js
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(fileBuffer, fileName) {
  try {
     const result = await imagekit.upload({
        file: fileBuffer, // required
        fileName: fileName, // required
    })

    return result;
  } catch (err) {
    console.error("ImageKit upload error:", err);
    throw err;
  }
}

module.exports = { uploadImage };
