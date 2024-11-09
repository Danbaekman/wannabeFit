import requests

# 사용자 이름과 비밀번호 설정
username = 'ssm0427'  # 여기에 실제 사용자 이름 입력
password = 'tmdals1003'    # 여기에 실제 비밀번호 입력

# 1. 토큰 가져오기
def get_tokens(username, password):
    url = 'https://wger.de/api/v2/token'
    response = requests.post(url, data={'username': username, 'password': password})
    if response.status_code == 200:
        tokens = response.json()
        return tokens['access'], tokens['refresh']
    else:
        print("토큰 요청 실패:", response.json())
        return None, None

# 2. 인증 헤더 생성
def get_auth_header(access_token):
    return {'Authorization': f'Bearer {access_token}'}

# 3. Equipment 데이터 가져오기
def get_equipment(access_token):
    url = 'https://wger.de/api/v2/equipment/'
    headers = get_auth_header(access_token)
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Equipment 데이터 요청 실패:", response.json())
        return None

# 3. exercise 데이터 가져오기
def get_exercise(access_token):
    url = 'https://wger.de/api/v2/exercise/'
    headers = get_auth_header(access_token)
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Exercise 데이터 요청 실패:", response.json())
        return None

# 4. 토큰 갱신
def refresh_access_token(refresh_token):
    url = 'https://wger.de/api/v2/token/refresh/'
    response = requests.post(url, data={'refresh': refresh_token})
    if response.status_code == 200:
        return response.json()['access']
    else:
        print("토큰 갱신 실패:", response.json())
        return None

# 실행 로직
access_token, refresh_token = get_tokens(username, password)

if access_token and refresh_token:
    equipment_data = get_exercise(access_token)
    if equipment_data and 'results' in equipment_data:
        # 모든 Equipment 이름 출력
        # equipment_names = [item['name'] for item in equipment_data['results']]
        # print("Equipment 이름 목록:")
        # for name in equipment_names:
        #     print(name)
        print(equipment_data)
    else:
        # 액세스 토큰 만료 시 갱신
        print("토큰 갱신 시도")
        access_token = refresh_access_token(refresh_token)
        if access_token:
            equipment_data = get_equipment(access_token)
            if equipment_data:
                print("Equipment 데이터:", equipment_data)
else:
    print("인증 실패")
