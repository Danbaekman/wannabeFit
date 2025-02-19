const express = require('express');
const router = express.Router();

// auth 라우터 설정
const authRoutes = require('./auth');
router.use('/auth', authRoutes);

// 사용자 라우터
const userRouter = require('./user');
router.use('/user', userRouter);

// 음식 라우터
const foodRouter = require('./food');
router.use('/food', foodRouter);

// 식단 라우터
const mealRouter = require('./meal');
router.use('/meal', mealRouter);

// 식단홈 라우터
const dietHomeRouter = require('./dietHome');
router.use('/dietHome', dietHomeRouter);

// 프로필 라우터
const profileRouter = require('./profile');
router.use('/profile', profileRouter);

// 인바디 라우터
const inbodyRouter = require('./inbody');
router.use('/inbody', inbodyRouter);

// 헬스 라우터
const workoutRouter = require('./workout');
router.use('/workout', workoutRouter);

// 운동 라우터
const exerciseRouter = require('./exercise');
router.use('/exercise', exerciseRouter);

// 통계 라우터
const statisticRouter = require('./statistic');
router.use('/statistic', statisticRouter);

// 체중 라우터
const weightRouter = require('./weight');
router.use('/weight', weightRouter);
module.exports = router;
