import { configureStore, createSlice } from '@reduxjs/toolkit';

// 날짜 관리 Slice
const dateSlice = createSlice({
  name: 'date',
  initialState: { selectedDate: new Date().toISOString().split('T')[0] }, // 초기값: 오늘 날짜
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload; // 날짜 변경
    },
  },
});

// 액션 내보내기
export const { setSelectedDate } = dateSlice.actions;

// 스토어 생성
const store = configureStore({
  reducer: {
    date: dateSlice.reducer,
  },
});

export default store;
