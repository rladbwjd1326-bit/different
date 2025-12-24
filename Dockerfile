# 1. 가벼운 알파인 버전 노드 사용
FROM node:25-alpine

# 2. 컨테이너 내 작업 디렉토리 생성
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 모든 소스 코드 복사 (이때 .dockerignore가 있으면 좋습니다)
COPY . .

# 5. server.js가 사용하는 포트 번호 (docker-compose의 3000:3000과 맞추기 위해 3000으로 권장)
EXPOSE 3000

# 6. 서버 실행
CMD ["node", "server.js"]