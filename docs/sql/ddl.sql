-- 테이블 생성.
-- 공연장.
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '공연장 이름',
  `block_map_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SVG 이미지 경로',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 구역.
CREATE TABLE `blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_id` int NOT NULL,
  `block_data_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SVG 파일 내 data-block-name 속성과 매칭',
  `row_size` int NOT NULL COMMENT '구역의 가로 좌석 수',
  `col_size` int NOT NULL COMMENT '구역의 세로 좌석 수',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9fa6464fbf3c7a9f8927211c93` (`venue_id`,`block_data_name`),
  CONSTRAINT `FK_2b3233e10f7cd74c77c30abb500` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 공연.
CREATE TABLE `performances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `performance_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '공연 이름',
  `ticketing_date` datetime NOT NULL COMMENT '티켓팅 일시 (ISO 8601)',
  `platform` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'interpark' COMMENT '티켓팅 플랫폼 (interpark, yes24, melon-ticket)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 회차.
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `performance_id` int NOT NULL,
  `venue_id` int NOT NULL,
  `session_date` datetime NOT NULL COMMENT '공연 회차 일시 (ISO 8601)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1d342594a3d7cd184b695be2e3` (`performance_id`,`session_date`),
  KEY `FK_bf806ef2587fabca8992892eb5c` (`venue_id`),
  CONSTRAINT `FK_1a9fbe9bdb4a094c4633386f06f` FOREIGN KEY (`performance_id`) REFERENCES `performances` (`id`),
  CONSTRAINT `FK_bf806ef2587fabca8992892eb5c` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 등급.
CREATE TABLE `grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a0b9efcad876cc17b8f377530ef` (`session_id`),
  CONSTRAINT `FK_a0b9efcad876cc17b8f377530ef` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 구역-등급.
CREATE TABLE `block_grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `block_id` int NOT NULL,
  `grade_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7717cbc242ba61f32865aab145` (`session_id`,`block_id`),
  KEY `FK_5442125060d48d80cd958bb4856` (`block_id`),
  KEY `FK_c174aad2adc32666f3a1ee6bdb4` (`grade_id`),
  CONSTRAINT `FK_5442125060d48d80cd958bb4856` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`),
  CONSTRAINT `FK_9e0dafbd83d88b07f2741408005` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`),
  CONSTRAINT `FK_c174aad2adc32666f3a1ee6bdb4` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;