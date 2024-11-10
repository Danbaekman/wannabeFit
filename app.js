const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const env = require('dotenv')

const app = express();

// Middleware 설정
app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 요청 처리
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 요청 처리

env.config();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/wannabeFit')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 라우터 설정
app.use('/api', routes); // '/api' 경로에 라우터 적용

// 포트 설정
const PORT = process.env.PORT || 5000; // 환경변수 PORT 또는 기본값 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Express 애플리케이션을 모듈로 내보냅니다.
