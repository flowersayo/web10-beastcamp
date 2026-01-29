# 티켓팅 스케줄러 리팩토링

## 개요
불안정한 `setTimeout` 연쇄 실행 방식을 제거하고, **독립 CronJob**과 **상태 머신(State Machine)** 기반으로 구조 변경.

## 핵심 변경: CycleStatus 도입
각 단계의 실행 순서를 엄격히 제어하기 위해 상태 머신 적용.

### 상태 전이 규칙 (State Transition)
`CycleStatus`에 따라 다음 단계 실행 여부를 결정.

- **SETUP** (매시 4분, 9분...):
  - 조건: 현재 상태가 `CLOSE` 또는 `ERROR` 일 때만 실행
  - 성공 시: `SETUP` 상태로 전환
- **OPEN** (매시 0분, 5분...):
  - 조건: 현재 상태가 `SETUP` 일 때만 실행
  - 성공 시: `OPEN` 상태로 전환
- **CLOSE** (매시 3분, 8분...):
  - 조건: 현재 상태가 `OPEN` 일 때만 실행
  - 성공 시: `CLOSE` 상태로 전환

### 예외 처리 (Fail-Safe)
- **ERROR 상태**: 각 단계 실행 중 오류 발생 시 즉시 `ERROR` 상태로 전환.
- **Skip 로직**: 이전 상태 조건이 맞지 않으면 해당 스케줄은 **실행되지 않고 건너뜀**.
  - *예: Setup 실패 시 → Open 실행 Skip → Close 실행 Skip → 다음 Setup 주기에 복구.*

## 기타 변경 사항
- **환경 변수**: `DELAY`(ms) 방식 제거 → Cron 표현식(`OPEN_INTERVAL`, `CLOSE_INTERVAL`) 도입.
- **테스트**: 상태 전이 및 차단 로직 검증을 위한 테스트 코드 전면 재작성.