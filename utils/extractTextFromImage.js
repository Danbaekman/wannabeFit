const Tesseract = require('tesseract.js');

const extractTextFromImage = (filePath) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      filePath,
      'eng',
      {
        logger: (m) => console.log(m), // progress log
      }
    ).then(({ data: { text } }) => {
      resolve(text);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = extractTextFromImage;
