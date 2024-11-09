const express = require('express');
const multer = require('multer');
const Inbody = require('../models/Inbody');
const extractTextFromImage = require('../utils/extractTextFromImage.js');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// 인바디 파일 업로드 및 정보 저장
router.post('/upload', upload.single('inbodyFile'), async (req, res) => {
  try {
    const { userId, date } = req.body;
    const filePath = req.file.path;

    // 이미지에서 텍스트 추출
    const extractedText = await extractTextFromImage(filePath);

    // 필요한 정보 파싱 (정규 표현식 사용)
    const weight = parseFloat(extractedText.match(/Weight:\s*(\d+(\.\d+)?)/)[1]);
    const bodyFat = parseFloat(extractedText.match(/Body Fat:\s*(\d+(\.\d+)?)/)[1]);
    const muscleMass = parseFloat(extractedText.match(/Muscle Mass:\s*(\d+(\.\d+)?)/)[1]);
    const waterPercentage = parseFloat(extractedText.match(/Water:\s*(\d+(\.\d+)?)/)[1]);

    // 인바디 정보 저장
    const inbodyData = new Inbody({
      userId,
      date: new Date(date),
      weight,
      bodyFat,
      muscleMass,
      waterPercentage,
      filePath,
    });

    await inbodyData.save();

    // Blender 스크립트 실행
    exec(`blender --background --python ${path.join(__dirname, '../blender/blender_script.py')} -- ${weight} ${bodyFat} ${muscleMass} ${waterPercentage}`, (error) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }

      const modelUrl = `${req.protocol}://${req.get('host')}/api/inbody/model`;
      res.status(201).json({ message: 'Inbody data uploaded successfully.', inbodyData, modelUrl });
    });
  } catch (error) {
    console.error('Error uploading inbody data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3D 모델 파일 제공
router.get('/model', (req, res) => {
  const modelPath = path.join(__dirname, '../output_model.obj');
  res.sendFile(modelPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    }
  });
});

// 사용자 사진 업로드 라우터 추가
router.post('/upload-photo', upload.single('userPhoto'), async (req, res) => {
  try {
    const filePath = req.file.path;
    res.status(201).json({ message: 'Photo uploaded successfully.', filePath });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
