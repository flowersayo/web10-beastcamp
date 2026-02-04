-- 1. Performance: ticketing_date 타입 변경 및 데이터 변환
-- 먼저 VARCHAR로 타입 변경 (기존 데이터는 'YYYY-MM-DD HH:MM:SS' 문자열이 됨)
ALTER TABLE `performances` MODIFY `ticketing_date` VARCHAR(30) NOT NULL COMMENT '티켓팅 일시 (ISO 8601 with KST offset)';

-- 기존 데이터 포맷 변환 (' ' -> 'T', 끝에 '+09:00' 추가)
-- 예: '2026-01-14 19:00:00' -> '2026-01-14T19:00:00+09:00'
UPDATE `performances`
SET `ticketing_date` = CONCAT(REPLACE(`ticketing_date`, ' ', 'T'), '+09:00')
WHERE `ticketing_date` LIKE '% %' AND `ticketing_date` NOT LIKE '%+09:00';


-- 2. Session: session_date 타입 변경 및 데이터 변환
ALTER TABLE `sessions` MODIFY `session_date` VARCHAR(30) NOT NULL COMMENT '공연 회차 일시 (ISO 8601 with KST offset)';

UPDATE `sessions`
SET `session_date` = CONCAT(REPLACE(`session_date`, ' ', 'T'), '+09:00')
WHERE `session_date` LIKE '% %' AND `session_date` NOT LIKE '%+09:00';
