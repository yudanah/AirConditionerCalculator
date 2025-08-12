# 🌡️ 에어컨 전기요금 계산기

에어컨 사용 조건을 입력하고 전기요금을 계산하는 웹앱입니다.

## ✨ 주요 기능

- **에어컨 사용량 입력**: 전력, 온도, 바람세기, 사용시간 설정
- **실시간 요금 계산**: 입력값 변경시 자동으로 예상 요금 계산
- **사용내역 관리**: 장바구니처럼 내역 추가/삭제/초기화
- **총 사용량 통계**: 총 시간, 전력량, 요금, 평균 시간당 요금 표시
- **카카오 로그인**: 사용자 인증 및 데이터 저장 (구현 예정)
- **통계 대시보드**: 일/주/월별 통계 및 다른 사용자와 비교 (구현 예정)

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 참고해서 `.env` 파일을 생성하세요:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일에서 다음 값들을 설정하세요:
- `VITE_KAKAO_APP_KEY`: 카카오 개발자 콘솔에서 발급받은 JavaScript 앱 키
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL (구현 예정)
- `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키 (구현 예정)

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 🛠️ 기술 스택

- **프론트엔드**: React + TypeScript + Vite
- **스타일링**: CSS3 (Gradient, Flexbox, Grid)
- **인증**: 카카오 로그인 API
- **데이터베이스**: Supabase (구현 예정)
- **배포**: Vercel (구현 예정)

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── LoginButton.tsx  # 카카오 로그인 버튼
│   └── KakaoInit.tsx    # 카카오 SDK 초기화
├── contexts/            # React Context
│   └── AuthContext.tsx  # 인증 상태 관리
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 앱 진입점
├── index.css           # 글로벌 스타일
└── vite-env.d.ts       # TypeScript 환경 타입
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 📋 TODO

- [ ] Supabase 데이터베이스 연동
- [ ] 사용 내역 저장/불러오기
- [ ] 통계 대시보드 구현
- [ ] 다른 사용자와 평균 비교 기능
- [ ] Vercel 배포 설정

## 🎯 전기요금 계산 방식

현재 kWh당 300원으로 계산하고 있습니다.
- 사용 전력량(kWh) = 에어컨 전력(W) × 사용시간(h) ÷ 1000
- 예상 요금(원) = 사용 전력량(kWh) × 300원

## 📄 라이선스

MIT License
