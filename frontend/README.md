## Docker를 이용한 배포

### 방법 1: Docker Compose 사용 (추천)

프론트엔드 디렉토리에서 다음 명령어를 실행합니다.

```bash
# 1. frontend 디렉토리로 이동
cd frontend

# 2. Docker Compose로 빌드 및 실행
docker compose up -d --build

# 3. 브라우저에서 확인
# http://localhost 접속

# 4. 로그 확인
docker compose logs -f

# 5. 중지 및 삭제
docker compose down
```

### 방법 2: Docker 직접 빌드 및 실행

프로젝트 루트에서 다음 명령어를 실행합니다.

```bash
# 1. Docker 이미지 빌드 (프로젝트 루트에서 실행)
docker build -f frontend/Dockerfile -t beastcamp-frontend .

# 2. 컨테이너 실행
docker run -d -p 80:3000 --name frontend beastcamp-frontend

# 3. 브라우저에서 확인
# http://localhost 접속
```

### Docker 관리 명령어

```bash
# 컨테이너 상태 확인
docker ps

# 컨테이너 로그 확인
docker logs frontend

# 컨테이너 중지
docker stop frontend

# 컨테이너 재시작
docker restart frontend

# 컨테이너 삭제
docker rm -f frontend

# 이미지 삭제
docker rmi beastcamp-frontend
```

### Docker Compose 관리 명령어

```bash
# 서비스 시작 (백그라운드)
docker compose up -d

# 서비스 중지
docker compose stop

# 서비스 재시작
docker compose restart

# 서비스 중지 및 컨테이너 삭제
docker compose down

# 이미지까지 삭제
docker compose down --rmi all

# 로그 실시간 확인
docker compose logs -f

# 특정 서비스만 재빌드
docker compose up -d --build frontend
```

### 프로덕션 배포 최적화

Dockerfile은 3단계 멀티 스테이지 빌드로 구성되어 있습니다:

1. **deps**: pnpm을 사용하여 필요한 의존성만 설치
2. **builder**: Next.js Standalone 모드로 프로덕션 빌드 수행
3. **production**: Node.js로 최적화된 서버 실행 (최종 이미지 크기 최소화)

### 캐시 없이 빌드 (문제 해결 시)

```bash
# Docker 캐시 클리어 후 빌드
docker build --no-cache -f frontend/Dockerfile -t beastcamp-frontend .

# 또는 Docker Compose 사용 시
docker compose build --no-cache
```
