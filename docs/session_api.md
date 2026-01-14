# 📅 공연 회차(Session) API 명세서

## 1. 개요
하나의 공연(`Performance`)은 여러 번의 회차(`Session`)로 진행될 수 있다.
각 회차는 고유한 공연 일시를 가지며, 예매의 실질적인 단위가 된다.

## 2. 데이터베이스 설계 (ERD)

### Session (공연 회차)
- 특정 공연의 개별 회차 정보를 관리한다.
- `id`: number (PK)
- `performanceId`: number (FK)
- `sessionDate`: datetime (회차별 공연 일시)
- **Unique Constraint**: `(performanceId, sessionDate)` - 한 공연 내 동일 시간 중복 방지

### 참고 사항
- `Performance` 엔티티의 `performanceDate`는 제거될 예정이며, 대신 `Session` 테이블을 통해 공연 일시를 관리한다.

## 3. 구현 가이드 (Nest.js + TypeORM)

### Entity 정의
1. **Session Entity**
   - `Performance`와 N:1 관계
   - `@Unique(['performanceId', 'sessionDate'])` 적용

### API 구현 계획

#### 1. 회차 (Session)
*   **회차 생성**
    *   **Method**: `POST`
    *   **Path**: `/api/performances/:id/sessions`
    *   **Body**: `[{ sessionDate: '2026-01-14T19:00:00' }, ...]`
    *   **Description**: 특정 공연의 회차 정보를 일괄 생성한다.
    *   **Validation**: 동일한 시간에 중복된 회차가 포함되면 `400 Bad Request` 반환.

*   **회차 조회**
    *   **Method**: `GET`
    *   **Path**: `/api/performances/:id/sessions`
    *   **Description**: 특정 공연의 모든 회차 목록을 공연 일시 오름차순으로 조회한다.
