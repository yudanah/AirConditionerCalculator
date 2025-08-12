# 📄 PRD - 에어컨 전기요금 계산기

## 1. 제품 개요
사용자가 에어컨 사용 조건(전력, 온도, 바람 세기, 시간)을 입력하면, 사용 내역이 장바구니처럼 누적되고 하루 예상 전기요금을 계산해주는 웹앱.  
로그인 후 일자별/주별/월별 통계와 다른 사용자 평균 비교가 가능함.

---

## 2. 주요 기능

### 2.1 에어컨 사용량 입력
- **입력 항목**
  - 에어컨 전력(W)
  - 설정 온도 (18°C ~ 28°C)
  - 바람 세기 (약풍 / 중풍 / 강풍 / 터보)
  - 사용 시간 (0.5시간 단위)
- 입력 값 변경 시 예상 전기요금 자동 계산
- “사용내역 추가하기” 버튼 클릭 시 장바구니 형태로 누적

---

### 2.2 사용 내역 관리
- 오늘 사용한 내역 목록 표시
- 각 내역에 시간, 전력, 온도, 바람 세기, 사용 요금 표시
- 전체 합계, 총 사용 전력(kWh), 평균 시간당 요금 표시
- 초기화 기능 제공

---

### 2.3 데이터 저장
- Supabase DB에 매일 데이터 저장
- 날짜별 기록 관리 가능
- 카카오톡 로그인 기반 개인화 저장

---

### 2.4 통계 대시보드
- 로그인 후 사용 가능
- 일별/주별/월별 사용량 및 요금 통계
- 평균 사용량과 다른 사용자 평균 비교 차트 제공

---

### 2.5 카카오 로그인
- 카카오 계정으로 로그인
- 로그인 시 DB에 사용자 고유 ID와 사용 데이터 연결

---

## 3. 기술 스택
- **프레임워크**: React
- **언어**: TypeScript
- **데이터베이스**: Supabase
- **기타**: 카카오 로그인 API
- **배포 환경**: Vercel

---

## 4. 데이터베이스 구조

### 4.1 테이블: `users`
| 컬럼명       | 타입         | 설명                  |
|--------------|--------------|-----------------------|
| id           | uuid         | 사용자 고유 ID (PK)   |
| kakao_id     | text         | 카카오 로그인 ID      |
| nickname     | text         | 사용자 닉네임         |
| created_at   | timestamp    | 가입 일자             |

---

### 4.2 테이블: `usage_logs`
| 컬럼명       | 타입         | 설명                                |
|--------------|--------------|-------------------------------------|
| id           | uuid         | 로그 ID (PK)                        |
| user_id      | uuid         | `users.id` 참조                     |
| date         | date         | 사용 일자                           |
| power_w      | integer      | 에어컨 전력(W)                      |
| temperature  | integer      | 설정 온도(°C)                       |
| wind_level   | text         | 바람 세기 (low, mid, high, turbo)   |
| hours        | numeric      | 사용 시간 (0.5 단위)                 |
| kwh          | numeric      | 사용 전력량(kWh)                    |
| cost         | integer      | 사용 요금(원)                       |
| created_at   | timestamp    | 기록 생성일                         |

---

### 4.3 테이블: `statistics`
| 컬럼명       | 타입         | 설명                                |
|--------------|--------------|-------------------------------------|
| id           | uuid         | 통계 ID (PK)                        |
| user_id      | uuid         | `users.id` 참조                     |
| period_type  | text         | daily / weekly / monthly            |
| period_start | date         | 기간 시작일                         |
| period_end   | date         | 기간 종료일                         |
| total_hours  | numeric      | 총 사용 시간                         |
| total_kwh    | numeric      | 총 전력 사용량(kWh)                 |
| total_cost   | integer      | 총 요금(원)                         |
| avg_hours    | numeric      | 평균 시간                           |
| avg_cost     | numeric      | 평균 요금                           |
| created_at   | timestamp    | 기록 생성일                         |

---

## 5. 테이블 생성 쿼리

```sql
-- Users table
create table users (
    id uuid primary key default gen_random_uuid(),
    kakao_id text unique not null,
    nickname text,
    created_at timestamp default now()
);

-- Usage logs
create table usage_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    date date not null,
    power_w integer not null,
    temperature integer not null,
    wind_level text not null,
    hours numeric(4,1) not null,
    kwh numeric(6,3) not null,
    cost integer not null,
    created_at timestamp default now()
);

-- Statistics table
create table statistics (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    period_type text check (period_type in ('daily','weekly','monthly')),
    period_start date not null,
    period_end date not null,
    total_hours numeric(6,1) not null,
    total_kwh numeric(8,3) not null,
    total_cost integer not null,
    avg_hours numeric(6,2),
    avg_cost numeric(8,2),
    created_at timestamp default now()
);
