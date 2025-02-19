const express = require('express');
const mongoose = require('mongoose');
const Muscle = require('../models/Muscle'); // 수정된 운동 부위 모델
const ExerciseName = require('../models/ExerciseName'); // 수정된 운동 이름 모델
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // 인증 미들웨어 추가

// 공통 에러 메시지 핸들링 함수
const handleServerError = (res, error, customMessage) => {
    console.error(customMessage, error);
    res.status(500).json({ message: customMessage, error: error.message });
};

// 운동 부위 목록 가져오기 (그룹화된 형태로)
//01.25 시헌 변경
router.get('/muscles/grouped', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const muscles = await Muscle.aggregate([
            {
                $match: {
                    $or: [
                        { user: null }, // 기본 제공 부위
                        { user: new mongoose.Types.ObjectId(userId) } // 사용자가 추가한 부위
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    muscles: {
                        $push: {
                            _id: '$_id', // _id 필드 추가
                            name: '$name',
                            isCustom: '$isCustom',
                            user: '$user',
                            createdAt: '$createdAt'
                        }
                    }
                }
            }
        ]);
        res.status(200).json(muscles);
    } catch (error) {
        handleServerError(res, error, "운동 부위를 가져오는 중 오류가 발생했습니다.");
    }
});

// 사용자 정의 운동 부위 등록하기 (Create)
router.post('/customMuscle', authenticateToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "근육 이름을 입력해야 합니다." });
    }

    try {
        const existingMuscle = await Muscle.findOne({
            name,
            user: req.user.id
        });

        if (existingMuscle) {
            return res.status(409).json({ message: "이미 동일한 이름의 근육이 등록되어 있습니다." });
        }

        const newMuscle = new Muscle({
            name,
            isCustom: true,
            user: req.user.id
        });

        await newMuscle.save();
        res.status(201).json({ message: "근육이 성공적으로 등록되었습니다.", muscle: newMuscle });
    } catch (error) {
        handleServerError(res, error, "근육 등록 중 오류가 발생했습니다.");
    }
});


// 사용자 정의 운동 부위 조회하기 (Read)
router.get('/customMuscles', authenticateToken, async (req, res) => {
    try {
        const muscles = await Muscle.find({ user: req.user.id, isCustom: true });

        if (!muscles || muscles.length === 0) {
            return res.status(404).json({ message: "등록된 사용자 정의 근육이 없습니다." });
        }

        res.status(200).json(muscles);
    } catch (error) {
        handleServerError(res, error, "근육 목록 조회 중 오류가 발생했습니다.");
    }
});

// 사용자 정의 운동 부위 수정하기 (Update)
router.put('/customMuscle/:id', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const muscleId = req.params.id;

    if (!name) {
        return res.status(400).json({ message: "근육 이름을 입력해야 합니다." });
    }

    try {
        const muscle = await Muscle.findById(muscleId);

        if (!muscle) {
            return res.status(404).json({ message: "해당 근육을 찾을 수 없습니다." });
        }

        if (muscle.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "해당 근육을 수정할 권한이 없습니다." });
        }

        // 중복 확인 로직 추가
        const existingMuscle = await Muscle.findOne({
            name,
            user: req.user.id,
            _id: { $ne: muscleId } // 현재 수정 중인 항목은 제외
        });

        if (existingMuscle) {
            return res.status(409).json({ message: "이미 동일한 이름의 근육이 등록되어 있습니다." });
        }

        muscle.name = name;
        await muscle.save();
        res.status(200).json({ message: "근육이 성공적으로 수정되었습니다.", muscle });
    } catch (error) {
        handleServerError(res, error, "근육 수정 중 오류가 발생했습니다.");
    }
});

// 사용자 정의 운동 부위 삭제하기 (Delete)
router.delete('/customMuscle/:id', authenticateToken, async (req, res) => {
    const muscleId = req.params.id;
    console.log('서버로 전달된 삭제 요청 ID:', muscleId);

    if (!mongoose.Types.ObjectId.isValid(muscleId)) {
        console.log('유효하지 않은 ID 형식:', muscleId);
        return res.status(400).json({ message: '유효하지 않은 ID 형식입니다.' });
    }

    try {
        const muscle = await Muscle.findById(muscleId);
        console.log('찾은 근육 데이터:', muscle);

        if (!muscle) {
            return res.status(404).json({ message: '근육을 찾을 수 없습니다.' });
        }

        if (!muscle.isCustom) {
            return res.status(403).json({ message: '기본 제공 근육은 삭제할 수 없습니다.' });
        }

        // findByIdAndDelete를 사용해 삭제
        await Muscle.findByIdAndDelete(muscleId);
        res.status(200).json({ message: '근육이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('근육 삭제 중 오류 발생:', error);
        res.status(500).json({ message: '근육 삭제 중 오류가 발생했습니다.', error: error.message });
    }
});




// 운동 이름 등록하기 (Create)
router.post('/exercises', authenticateToken, async (req, res) => {
    const { name, muscles } = req.body;

    if (!name) {
        return res.status(400).json({ message: "운동명을 입력해야 합니다." });
    }

    if (!muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: "운동 부위를 최소 하나 이상 입력해야 합니다." });
    }

    try {
        const existingExercise = await ExerciseName.findOne({
            name,
            user: req.user.id
        });

        if (existingExercise) {
            return res.status(409).json({ message: "이미 동일한 이름의 운동이 등록되어 있습니다." });
        }

        const newExercise = new ExerciseName({
            name,
            muscles,
            user: req.user.id
        });

        await newExercise.save();
        res.status(201).json({ message: "운동이 성공적으로 등록되었습니다.", exercise: newExercise });
    } catch (error) {
        handleServerError(res, error, "운동 등록 중 오류가 발생했습니다.");
    }
});


// 운동 이름 조회하기 (Read)
router.get('/exercises/all', authenticateToken, async (req, res) => {
    try {
        // 기본 제공 운동과 사용자 정의 운동 모두 가져오기
        const query = {
            $or: [
                { user: null }, // 기본 제공 운동
                { user: req.user.id } // 사용자 정의 운동
            ]
        };

        // 운동 데이터 조회
        const exercises = await ExerciseName.find(query).populate('muscles', 'name');

        if (!exercises || exercises.length === 0) {
            return res.status(404).json({ message: "운동이 없습니다." });
        }

        res.status(200).json(exercises);
    } catch (error) {
        handleServerError(res, error, "운동 목록 조회 중 오류가 발생했습니다.");
    }
});


router.get('/exercises', authenticateToken, async (req, res) => {
    const { muscleId } = req.query; // 쿼리 매개변수에서 muscleId를 가져옴

    try {
        const query = {
            $or: [
                { user: null }, // 기본 제공 운동
                { user: req.user.id } // 사용자 정의 운동
            ]
        };

        // muscleId가 있는 경우, 해당 부위에 맞는 운동만 필터링
        if (muscleId) {
            query.muscles = muscleId;
        }

        const exercises = await ExerciseName.find(query).populate('muscles', 'name');

        if (!exercises || exercises.length === 0) {
            return res.status(404).json({ message: "해당 조건에 맞는 운동이 없습니다." });
        }

        res.status(200).json(exercises);
    } catch (error) {
        handleServerError(res, error, "운동 목록 조회 중 오류가 발생했습니다.");
    }
});


// 운동 이름 삭제하기 (Delete)
router.delete('/exercises/:id', authenticateToken, async (req, res) => {
    const exerciseId = req.params.id;

    try {
        const exercise = await ExerciseName.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: "해당 운동을 찾을 수 없습니다." });
        }

        // 기본 제공 운동 여부 확인
        if (!exercise.isCustom) {
            return res.status(403).json({ message: "기본 제공 운동은 삭제할 수 없습니다." });
        }

        // 소유권 확인 (커스텀 운동인 경우만)
        if (exercise.user && exercise.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "해당 운동을 삭제할 권한이 없습니다." });
        }

        // 삭제 수행
        await exercise.deleteOne(); 

        res.status(200).json({ message: "운동이 성공적으로 삭제되었습니다." });
    } catch (error) {
        console.error('운동 삭제 중 오류 발생:', error);
        res.status(500).json({ message: "운동 삭제 중 오류가 발생했습니다.", error: error.message });
    }
});



router.put('/exercises/:id', authenticateToken, async (req, res) => {
    const { name, muscles } = req.body;
    const exerciseId = req.params.id;

    if (!name) {
        return res.status(400).json({ message: "운동명을 입력해야 합니다." });
    }

    if (!muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: "운동 부위를 최소 하나 이상 입력해야 합니다." });
    }

    try {
        const exercise = await ExerciseName.findById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: "해당 운동을 찾을 수 없습니다." });
        }

        if (exercise.user && exercise.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "해당 운동을 수정할 권한이 없습니다." });
        }

        // 중복 확인 로직 추가
        const existingExercise = await ExerciseName.findOne({
            name,
            user: req.user.id,
            _id: { $ne: exerciseId } // 현재 수정 중인 항목은 제외
        });

        if (existingExercise) {
            return res.status(409).json({ message: "이미 동일한 이름의 운동이 등록되어 있습니다." });
        }

        exercise.name = name;
        exercise.muscles = muscles;
        await exercise.save();
        res.status(200).json({ message: "운동이 성공적으로 수정되었습니다.", exercise });
    } catch (error) {
        handleServerError(res, error, "운동 수정 중 오류가 발생했습니다.");
    }
});

// 사용자 정의 운동 종목 추가 
router.post('/add-exercises', authenticateToken, async (req, res) => {
    const { name, muscles } = req.body;
    console.log('POST /add-exercises 호출됨');
    console.log('요청 데이터:', req.body);

    if (!name) {
        return res.status(400).json({ message: '운동명을 입력해야 합니다.' });
    }

    if (!muscles || !Array.isArray(muscles) || muscles.length === 0) {
        return res.status(400).json({ message: '운동 부위를 최소 하나 이상 입력해야 합니다.' });
    }

    try {
        const existingExercise = await ExerciseName.findOne({
            name,
            user: req.user.id,
        });

        if (existingExercise) {
            return res.status(409).json({
                message: '이미 등록된 운동입니다.',
                exercise: existingExercise,
            });
        }

        // 사용자 정의 운동으로 isCustom: true 설정
        const newExercise = new ExerciseName({
            name,
            muscles,
            user: req.user.id,
            isCustom: true, // 사용자 정의 운동 여부 추가
        });

        console.log('저장 전 데이터:', newExercise);
        await newExercise.save();
        res.status(201).json({ message: '운동이 성공적으로 추가되었습니다.', exercise: newExercise });
    } catch (error) {
        res.status(500).json({ message: '운동 추가 중 오류가 발생했습니다.', error: error.message });
    }
});

  


module.exports = router;
