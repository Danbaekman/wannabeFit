# 헬스 통합 앱 서비스 '워너비핏'
> 2024.11 ~ 2025.02, 2025.02 ~ (리팩토링 진행 중)

<br />

<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/1bc8e573-5612-438a-a128-38d121dbeec0" 
    alt="Image" 
    width="100%"
    />
</div>
<br />

<table>
  <tr>
    <td width="30%" align="center" style="vertical-align: middle;">
      <img 
        src="https://github.com/user-attachments/assets/27096968-50d2-41b9-82ca-cc8850a0e0ad" 
        width="50%" 
        style="display: block; margin: auto;"
      />
    </td>
    <td style="vertical-align: middle;">
      <h2>워너비핏은 어떤 앱인가요?</h2>
      <p>
        워너비핏은 사용자의 신체 정보를 바탕으로 벌크업, 다이어트 등 원하는 목적에 맞춰 
        운동과 식단을 관리할 수 있는 모바일 앱입니다. 
      </p>
      <p>
        약 7년간의 웨이트 경력을 갖고있는 본 개발자는 여러 헬스 앱을 사용하면서 불편함을 느꼈던 
        복잡함을 대폭 줄여 간단한 UI를 바탕으로 필수 기능들을 구현했습니다.
      </p>
    </td>
  </tr>
</table>

<br />

- 원하는 몸에 맞춘 운동법 추천
- 운동 및 식단 기록 관리
- 스톱워치 기능
- 통계를 통해 성장 그래프 확인

<br />
<br />

## 워너비핏이 제공하는 서비스를 소개합니다!
### 🎯 운동목적 방향성 추천
<table>
  <tr>
    <td width="40%" align="center">
      <img 
        src="https://github.com/user-attachments/assets/cc0e8d15-ae68-4418-b6f4-8c06ff6b1f62" 
        width="90%"
        style="display: block; margin: auto;"
      />
    </td>
    <td width="60%">
      <h2>워너비핏은 사용자의 TDEE를 기준으로 개인의 목표에 맞춘 최적의 칼로리와 영양소 비율을 추천합니다 😊</h2>
      <h3>TDEE란?</h3>
      <p>
        TDEE(Total Daily Energy Expenditure, 총 일일 에너지 소모량)는 하루 동안 소비하는 총 칼로리를 의미합니다.  
        기초대사량(BMR)과 활동량을 고려하여 계산되며, 신체 활동 수준에 따라 달라집니다.
      </p>
      <h3 align="center">💡 사용된 TDEE 계산법</h3>
      <table align="center" border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>요소</th>
          <th>계산식</th>
        </tr>
        <tr>
          <td><b>BMR</b> (기초대사량)</td>
          <td>10 × 체중(kg) + 6.25 × 키(cm) - 5 × 나이 + 성별 보정</td>
        </tr>
        <tr>
          <td><b>성별 보정</b></td>
          <td>남성: +5 / 여성: -161</td>
        </tr>
        <tr>
          <td><b>활동량 보정</b></td>
          <td>BMR × 활동계수</td>
        </tr>
        <tr>
          <td><b>활동계수</b></td>
          <td>
            - 1.2: 거의 운동 안함<br>
            - 1.375: 가벼운 운동 (주 1~3회)<br>
            - 1.55: 보통 운동 (주 3~5회)<br>
            - 1.725: 격렬한 운동 (주 6~7회)<br>
            - 1.9: 운동 선수 수준
          </td>
        </tr>
        <tr>
          <td><b>최종 TDEE</b></td>
          <td>BMR × 활동계수</td>
        </tr>
      </table>
    </td>
  </tr>
</table>


<br />
  
### 🏋️ 실시간 운동 세트 기록
<p>스톱워치를 이용해 실시간으로 운동하면서 무게와 횟수를 기록해보세요</p>
<p>메모를 남겨 핵심 포인트들을 저장하세요</p>

<p align="center">
   <img src="https://github.com/user-attachments/assets/465adfe9-64ef-4d0f-bae2-db88246b0a66" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://github.com/user-attachments/assets/4530a897-3262-46c6-b64c-07c7e44e9b12" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://github.com/user-attachments/assets/a17d360c-aced-413d-a2a7-a3a8ce73d557" width="30%" />
</p>

<br />

### 🥗 오늘 먹은 음식 기록하기
<p>매일 식단을 기록하며 추천 칼로리와 영양소 비율에 맞게 식사했는지 점검해보세요!</p>
<p align="center">
   <img src="https://github.com/user-attachments/assets/8d1df22c-630e-4e23-966e-eeca734fea63" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://github.com/user-attachments/assets/93a3090b-ea6c-4362-a86a-a2f615fdc18f" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/85a7ae80-bb25-4ef6-b0ec-83e5c9a67303" width="30%" />
</p>

<br />

### 📊 얼만큼 성장했는지, 통계를 통해 확인해보세요
<p>운동 목적에 맞게 얼만큼 노력했는지 점검하고 개선해보세요</p>
<p align="center">
   <img src="https://github.com/user-attachments/assets/626d10ba-9114-4449-aaa5-e7a20329f915" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://github.com/user-attachments/assets/6dd5d1fb-3e92-42a9-9307-a4b4e6eaa584" width="30%" />
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/4c31fbd5-3b23-4950-89aa-5e05440fa9e7" width="30%" />
</p>

## 사용된 기술
### **프론트엔드**
- 프레임워크: React Native
- 상태 관리: React Hooks (useState, useEffect)
- API 통신: Fetch API
- 로컬 저장소: AsyncStorage
- UI 스타일링: React Native StyleSheet
- 애니메이션: React Native Animated, PanResponder
- 로그인: @react-native-seoul/naver-login

### **백엔드** 
- Node.js, Express
- 데이터베이스: MongoDB

## 개발 환경
- **기기**: Pixel 4 XL
- **API 레벨**: 35
- **Android 버전**: Android 12.0 ("S")
- **아키텍처**: ARM 64

## 개발 참여 인원(총 1명)
- 프론트 엔드 : 이시헌

