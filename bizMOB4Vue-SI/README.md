# bizMOB4Vue-SI Base Project

Vue.js 3와 Ionic를 기반으로 한 모바일 하이브리드 애플리케이션 베이스 프로젝트입니다. bizMOB 플랫폼을 위한 TypeScript 기반의 엔터프라이즈급 앱 개발을 지원합니다.

## 📋 프로젝트 개요

- **프레임워크**: Vue 3 (Composition API) + Ionic Vue
- **언어**: TypeScript
- **상태 관리**: Vuex 4
- **라우팅**: Vue Router 4
- **국제화**: Vue i18n
- **빌드 도구**: Vue CLI 5
- **스타일링**: SCSS + Ionic CSS Components
- **대상 환경**: 모바일 하이브리드 앱 (iOS/Android) 및 웹

## 🚀 주요 기능

- **bizMOB 플랫폼 통합**: 네이티브 기능 접근을 위한 TypeScript Wrapper
- **다중 환경 지원**: 개발(SIT), 품질(UAT), 운영(PROD) 환경별 설정
- **JWT 토큰 기반 인증**: 자동 토큰 재발행 및 보안 통신
- **암호화 통신**: 서버와의 안전한 데이터 통신
- **다국어 지원**: i18n을 통한 국제화
- **Mock 데이터**: 개발 단계에서 API 없이 개발 가능
- **Proxy 서버**: 개발 시 CORS 문제 해결

## 🛠️ 기술 스택

### Core
- Vue.js 3.5.13
- TypeScript 5.4.5
- Ionic Vue 8.5.6

### 상태 관리 & 라우팅
- Vuex 4.1.0 (상태 관리)
- Vue Router 4.5.1 (라우팅)
- vuex-persistedstate 4.1.0 (상태 영속화)

### 유틸리티 라이브러리
- crypto-js 4.2.0 (암호화)
- moment 2.30.1 (날짜 처리)
- dompurify 3.1.5 (XSS 보안)
- url-safe-base64 1.3.0 (Base64 인코딩)

## 📁 프로젝트 구조

```
bizMOB4Vue-SI/
├── public/                     # 정적 파일
│   ├── bizMOB/                # bizMOB 플랫폼 라이브러리
│   ├── extlib/                # 외부 라이브러리
│   ├── mock/                  # Mock 데이터
│   └── fonts/                 # 폰트 파일
├── src/
│   ├── components/            # 재사용 가능한 컴포넌트
│   ├── views/                 # 페이지 컴포넌트
│   ├── router/                # 라우터 설정
│   ├── store/                 # Vuex 스토어
│   ├── bizMOB/               # bizMOB TypeScript Wrapper
│   │   ├── Xross/            # bizMOB API 클래스
│   │   └── BzClass/          # 유틸리티 클래스
│   ├── shared/               # 공통 유틸리티
│   ├── locales/              # 다국어 파일
│   └── assets/               # 정적 리소스
└── dist/                     # 빌드 결과물
```

## ⚙️ 환경 설정

### NODE_ENV (실행 환경)

- **development**: `develop 환경`이며 디버깅과 로깅을 활성화한 develop 환경 (개발 서버와는 연관 없음)
- **production**: `release 환경`으로 최적화와 보안을 강화한 운영 환경 (운영 서버와는 연관 없음)

### 기본 환경 변수

- **.env**: 모든 서버 환경에서 공통적으로 선언될 환경 변수
- **.env.sit**: `개발 서버` 환경 변수
- **.env.uat**: `품질 서버` 환경 변수
- **.env.prod**: `운영 서버` 환경 변수

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

> **참고**: deploy 명령어는 NODE_ENV가 production으로 설정되어 소스 수정 시 반영이 오래 걸립니다.

#### Development 모드 (빠른 개발)
```bash
# 개발 서버 (SIT)
npm run serve-sit

# 품질 서버 (UAT)  
npm run serve-uat

# 운영 서버 (PROD)
npm run serve-prod
```

#### Production 모드 (배포 테스트)
```bash
# 개발 서버 release 모드
npm run serve-sit:deploy

# 품질 서버 release 모드
npm run serve-uat:deploy

# 운영 서버 release 모드
npm run serve-prod:deploy
```

### 빌드

#### 메이저 빌드 (전체 리소스 포함)
```bash
# 개발 환경 빌드
npm run build-sit:major

# 품질 환경 빌드  
npm run build-uat:major

# 운영 환경 빌드
npm run build-prod:major
```

#### 마이너 빌드 (폰트 제외)
```bash
# 개발 환경 마이너 빌드
npm run build-sit:minor

# 품질 환경 마이너 빌드
npm run build-uat:minor

# 운영 환경 마이너 빌드
npm run build-prod:minor
```

### 명령어 참조표

| 명령어 | 환경파일 | NODE_ENV | 프록시 | 설명 |
|--------|----------|----------|---------|------|
| `serve-sit` | .env.sit | development | ON | 개발서버 개발모드 |
| `serve-sit:deploy` | .env.sit | production | ON | 개발서버 배포모드 |
| `serve-uat` | .env.uat | development | ON | 품질서버 개발모드 |
| `serve-uat:deploy` | .env.uat | production | ON | 품질서버 배포모드 |
| `serve-prod` | .env.prod | development | ON | 운영서버 개발모드 |
| `serve-prod:deploy` | .env.prod | production | ON | 운영서버 배포모드 |
| `build-*:major` | .env.* | production | - | 메이저 빌드 (전체) |
| `build-*:minor` | .env.* | production | - | 마이너 빌드 (폰트 제외) |

## ⚠️ 개발 시 주의사항

### 브라우저 호환성
- **모바일 ES5 지원**: iOS 13 미만 기기에서 ES5 호환성 확인 필요
- ES6 전용 라이브러리 사용 시 폴리필 또는 대체 패키지 검토

### SEO 고려사항
- B2C 웹 개발 시 검색 엔진 최적화 고려
- 메타 태그, 구조화된 데이터 적용

### 보안
- 암호화 키, API 키 등 민감정보는 환경변수로 관리
- XSS 방지를 위해 DOMPurify 사용

## 🔧 bizMOB TypeScript API

JavaScript로 구현된 bizMOB 서비스를 TypeScript에서 사용할 수 있도록 하는 Wrapper 클래스입니다.

```ts
import File from '@/bizMOB/Xross/File';

const onBizMOB = async() => {
    const res: any = await File.copy({
        _sSourcePath: '{external}/document/temp.png', // 복사할 파일의 경로
        _sTargetPath: '{external}/app/temp.png', // 복사될 경로
        _bMock: false, // Mock 데이터 사용 여부
    });

    console.log(res);
};
```

### 🧪 Mock 데이터 사용

개발 단계에서 실제 서버 없이 개발할 수 있도록 Mock 데이터를 제공합니다.

```ts
import Network from '@/bizMOB/Xross/Network';

const fetchData = async() => {
    const res: any = await Network.requestTr({
        _bMock: true, // Mock 데이터 사용
        _sTrcode: 'DM0002',
        _oBody: {
            startIndex: 0,
            endIndex: 9
        },
    });
    console.log(res);
};
```

**Mock 데이터 위치**
- **Network API**: `public/mock/[Trcode].json`
- **Native API**: `public/mock/bizMOB/**/*.json`

### 🔐 JWT 토큰 인증

서버와의 안전한 인증을 위해 JWT 토큰 방식을 지원합니다.

#### 주요 특징
- **자동 토큰 재발행**: 토큰 만료 시 자동으로 갱신
- **동시 요청 처리**: 여러 API 동시 호출 시 토큰 재발행 중복 방지
- **에러 코드**: `ERR000` - Access Token 검증 실패

#### ⚠️ 동시 통신 주의사항
토큰 만료 상태에서 여러 API를 동시 호출하는 경우:
- 토큰 재발행이 중복 실행될 수 있음
- 프로젝트 요구사항에 맞게 재발행 로직 구현 필요

```ts
// JWT Token 초기화
import Network from '@/bizMOB/Xross/Network';
import BzToken from '@/bizMOB/BzClass/BzToken';

const sample = async () => {
    // 로그인 로직
    const res: any = await Network.requestLogin({
        _bMock: false,
        _sTrcode: 'DM0001',
        _sUserId: 'tester1',
        _sPassword : '1111',
        _oBody: {
            userId: 'tester1',
            passwd: '1111',
        }
    });

    if (res.result) {
        // 사용자 정보 저장
        userStore.dispatch('setUser', res.body);

        // 프로젝트 내에 JWT Token 정보 저장
        authStore.dispatch('setTokenInfo', {
            accessToken: res.accessToken, // 로그인 인증 Token
            accessTokenExpTime: res.accessTokenExpTime, // 로그인 인증 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
            refreshToken: res.refreshToken, // 로그인 갱신 Token
            refreshTokenExpTime: res.refreshTokenExpTime, // 로그인 갱신 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
        });

        // bizMOB 설정
        BzToken.init({
            accessToken: res.accessToken, // 로그인 인증 Token
            accessTokenExpTime: res.accessTokenExpTime, // 로그인 인증 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
            refreshToken: res.refreshToken, // 로그인 갱신 Token
            refreshTokenExpTime: res.refreshTokenExpTime, // 로그인 갱신 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
        });
    }
};
```

```ts
// JWT Token 재발행
import BzToken from '@/bizMOB/BzClass/BzToken';

const sample = async () => {
    if (BzToken.isTokenExpired()) {
        const res: any = await BzToken.renewToken();

        // 프로젝트 내에 JWT Token 정보 저장
        authStore.dispatch('setTokenInfo', {
            accessToken: res.accessToken, // 로그인 인증 Token
            accessTokenExpTime: res.accessTokenExpTime, // 로그인 인증 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
            refreshToken: res.refreshToken, // 로그인 갱신 Token
            refreshTokenExpTime: res.refreshTokenExpTime, // 로그인 갱신 Token 만료 시간 (yyyy-MM-dd HH:mm:ss)
        });
    }
};
```

```ts
// 저장된 값 조회 함수
import BzToken from '@/bizMOB/BzClass/BzToken';

const sample = () => {
    console.log(BzToken.getAccessToken()); // 인증 토큰 조회
    console.log(BzToken.getAccessTokenExpTime()); // 인증 토큰 만료 시간 조회 (yyyy-MM-dd HH:mm:ss)
    console.log(BzToken.getRefreshToken()); // 갱신 토큰 조회
    console.log(BzToken.getRefreshTokenExpTime()); // 갱신 토큰 만료 시간 조회 (yyyy-MM-dd HH:mm:ss)
};
```

### 🔒 암호화 통신

서버와의 Body 데이터 암호화를 지원합니다.

#### 암호화 활성화 방법

**App 환경**
```
public/bizMOB/app.config
ENCRYPTION_USE = true
```

**Web 환경**  
```
.env.{환경}
VUE_APP_ENCRYPTION_USE = 'true'
```

#### 에러 코드
- **EAH000**: 암호키 세션 만료 → `shareAuthKey` 호출 필요
- **EAH001**: 암호화 인증 토큰 만료 → `renewAuthToken` 호출 필요

#### ⚠️ 동시 통신 주의사항
JWT 토큰과 동일하게 동시 요청 시 토큰 재발행 중복 실행 가능

```ts
// 키 초기화
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';

const sample = async () => {
    // Store 등을 통해서 관리되고 있는 암호화 관련 정보
    const cryptoInfo = authStore.getter('cryptoInfo');

    // 암호화 통신 변수 초기화
    if (!BzCrypto.isInit()) {
        /**
         * 초기 값 설정
         * 초기 값은 프로젝트 내의 로직으로 저장 관리 필요.
         * Store 등을 통해서 관리하는 경우 초기에 null이 아닌 Store의 값을 설정.
         */
        BzCrypto.init({
            crySymKey: cryptoInfo.crySymKey,
            cryAuthToken: cryptoInfo.cryAuthToken,
            cryAuthTokenExpTime: cryptoInfo.cryAuthTokenExpTime,
            cryRefreshToken: cryptoInfo.cryRefreshToken,
            cryRefreshTokenExpTime: cryptoInfo.cryRefreshTokenExpTime,
        })
    }
};
```

```ts
// 신규 키 & 인증 토큰 발급
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';

const sample = async () => {
    // 토큰 발급 여부 확인
    if (BzCrypto.isTokenRequired()) {
        try {
            /**
             * shareAuthKey 호출시 내부 변수 값 설정까지 같이 진행
             */
            const crypto = await BzCrypto.shareAuthKey();

            /**
             * 암호화 정보를 관리하는 Store 등에 저장
             */
            authStore.dispatch('setCryptoInfo', {
                crySymKey: crypto.crySymKey,
                cryAuthToken: crypto.cryAuthToken,
                cryAuthTokenExpTime: crypto.cryAuthTokenExpTime,
                cryRefreshToken: crypto.cryRefreshToken,
                cryRefreshTokenExpTime: crypto.cryRefreshTokenExpTime,
            });
        } catch (error) {
            /**
             * Project 환경에 맞춰서 Error Message 처리
             *
             * 키 공유 전문(BM4001)
             *     BM4001IMPL0001
             *         서버에서 암호화 키 생성 과정에서 오류 발생(요청 cryPbKey 값이 잘못 되었거나, 서버 오류)
             *         서버 로그 확인 필요
             */
        }
    }

    console.log(BzCrypto.getCryAuthToken()) // 인증 토큰
};
```

```ts
// 인증 토큰 재발행
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';

const sample = async () => {
    // 토큰 만료 여부 확인
    if (BzCrypto.isTokenExpired()) {
        try {
            /**
             * BzCrypto 내에 저장되어 있는 변수 값을 기준으로 재발행 요청
             */
            const crypto = await BzCrypto.renewAuthToken();

            /**
             * 암호화 정보를 관리하는 Store 등에 저장
             */
            authStore.dispatch('setCryptoInfo', {
                crySymKey: crypto.crySymKey,
                cryAuthToken: crypto.cryAuthToken,
                cryAuthTokenExpTime: crypto.cryAuthTokenExpTime,
                cryRefreshToken: crypto.cryRefreshToken,
                cryRefreshTokenExpTime: crypto.cryRefreshTokenExpTime,
            });
        } catch (error) {
            /**
             * Project 환경에 맞춰서 Error Message 처리
             *
             * 토큰 갱신 전문(BM4002)
             *     BM4002TKER1001
             *         유효하지 않은 토큰 (bizMOB Server에서 생성된 토큰이 아닐 경우, 일반적인 상황에서는 발생 안됨)
             *     BM4002TKER1002
             *         Refresh token 이 만료 되었을 경우 발생
             *         키공유전문(BM4001) 다시 호출하여 신규 암호화키, 토큰 발행
             */
        }
    }

    console.log(BzCrypto.getCryAuthToken()) // 인증 토큰
};
```

```ts
// 저장된 값 조회 함수
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';

const sample = () => {
    console.log(BzCrypto.getSymKey()); // 암호화 키 조회
    console.log(BzCrypto.getCryAuthToken()); // 인증 토큰 조회
    console.log(BzCrypto.getCryAuthTokenExpTime()); // 인증 토큰 만료 시간 조회 (yyyy-MM-dd HH:mm:ss)
    console.log(BzCrypto.getCryRefreshToken()); // 갱신 토큰 조회
    console.log(BzCrypto.getCryRefreshTokenExpTime()); // 갱신 토큰 만료 시간 조회 (yyyy-MM-dd HH:mm:ss)
};
```

```ts
// 전체 과정 Sample
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';

const processSample = async () => {
    // Store 등을 통해서 관리되고 있는 암호화 관련 정보
    const cryptoInfo = authStore.getter('cryptoInfo');

    // 암호화 통신 변수 초기화
    if (!BzCrypto.isInit()) {
        BzCrypto.init({
            crySymKey: cryptoInfo.crySymKey,
            cryAuthToken: cryptoInfo.cryAuthToken,
            cryAuthTokenExpTime: cryptoInfo.cryAuthTokenExpTime,
            cryRefreshToken: cryptoInfo.cryRefreshToken,
            cryRefreshTokenExpTime: cryptoInfo.cryRefreshTokenExpTime,
        })
    }

    // 토큰 발급 여부 확인
    if (BzCrypto.isTokenRequired()) {
        try {
            // 암호화 키 & 인증 토큰 신규발행
            const crypto = await BzCrypto.shareAuthKey();

            // 암호화 정보 저장
            authStore.dispatch('setCryptoInfo', {
                crySymKey: crypto.crySymKey,
                cryAuthToken: crypto.cryAuthToken,
                cryAuthTokenExpTime: crypto.cryAuthTokenExpTime,
                cryRefreshToken: crypto.cryRefreshToken,
                cryRefreshTokenExpTime: crypto.cryRefreshTokenExpTime,
            });
        } catch (error) {
            // Project 환경에 맞춰서 Error Message 처리
        }
    }
    // 토큰 만료 여부 확인
    else if (BzCrypto.isTokenExpired()) {
        try {
            // 인증 토큰 재발행
            const crypto = await BzCrypto.renewAuthToken();

            // 암호화 정보 저장
            authStore.dispatch('setCryptoInfo', {
                crySymKey: crypto.crySymKey,
                cryAuthToken: crypto.cryAuthToken,
                cryAuthTokenExpTime: crypto.cryAuthTokenExpTime,
                cryRefreshToken: crypto.cryRefreshToken,
                cryRefreshTokenExpTime: crypto.cryRefreshTokenExpTime,
            });
        } catch (error) {
            // Project 환경에 맞춰서 Error Message 처리
        }
    }
};
```

### 🌐 다국어 (i18n) 설정

bizMOB의 `BzLocale` 클래스를 통해 네이티브 앱의 다국어를 제어할 수 있습니다.

```ts
// App.vue
import { onMounted } from 'vue';
import BzLocale from '@/bizMOB/BzClass/BzLocale';
import Event from '@/bizMOB/Xross/Event';

onMounted(async () => {
    Event.setEvent('ready', init);
});

// App, Web initialization code here
const init = () => {
    BzLocale.initLocale(); // 언어 초기화
};
```

#### 언어 변경

```ts
import BzLocale from '@/bizMOB/BzClass/BzLocale';

const changeLanguage = async() => {
    // 언어 코드 프리셋: public/bizMOB/bizMOB-locale.js
    await BzLocale.changeLocale('ko-KR'); // 또는 'ko'
    
    const result = await BzLocale.getLocale();
    console.log(result); // {result: true, locale: 'ko-KR'}
};
```

## 📚 bizMOB API 레퍼런스

### 🔧 App (애플리케이션 제어)
```ts
import App from '@/bizMOB/Xross/App';
```
- `callPlugIn()` - 플러그인 호출
- `exit()` - 앱 종료
- `getTimeout()` / `setTimeout()` - 타임아웃 관리
- `hideSplash()` - 스플래시 화면 숨기기

### 🌐 Network (네트워크 통신)
```ts
import Network from '@/bizMOB/Xross/Network';
```
- `requestLogin()` - 로그인 요청
- `requestTr()` - 트랜잭션 요청
- `requestHttp()` - HTTP 요청
- `requestApi()` - API 요청

### 💾 Database (데이터베이스)
```ts
import Database from '@/bizMOB/Xross/Database';
```
- `openDatabase()` / `closeDatabase()` - DB 연결 관리
- `executeSql()` / `executeSelect()` - SQL 실행
- `beginTransaction()` / `commitTransaction()` / `rollbackTransaction()` - 트랜잭션 관리

### 📁 File (파일 관리)
```ts
import File from '@/bizMOB/Xross/File';
```
- `copy()` / `move()` / `remove()` - 파일 조작
- `download()` / `upload()` - 파일 전송
- `zip()` / `unzip()` - 압축 관리
- `resizeImage()` / `rotateImage()` - 이미지 처리

### 📱 System (시스템 기능)
```ts
import System from '@/bizMOB/Xross/System';
```
- `callCamera()` / `callGallery()` - 카메라/갤러리
- `callTEL()` / `callSMS()` - 전화/SMS
- `callBrowser()` / `callMap()` - 브라우저/지도
- `getGPS()` - GPS 위치

### 🔔 Push (푸시 알림)
```ts
import Push from '@/bizMOB/Xross/Push';
```
- `registerToServer()` - 서버 등록
- `sendMessage()` / `getMessageList()` - 메시지 관리
- `setAlarm()` / `getAlarm()` - 알람 설정

### 📲 Device (디바이스 정보)
```ts
import Device from '@/bizMOB/Xross/Device';
```
- `getInfo()` - 디바이스 정보
- `isApp()` / `isWeb()` - 플랫폼 판별
- `isAndroid()` / `isIOS()` - OS 판별
- `isMobile()` / `isPC()` - 디바이스 타입

### 💾 Storage & Properties (저장소)
```ts
import Storage from '@/bizMOB/Xross/Storage';
import Properties from '@/bizMOB/Xross/Properties';
```
- `get()` / `set()` / `remove()` - 데이터 관리
- `setList()` - 배열 데이터 저장

### 🪟 Window (UI 컴포넌트)
```ts
import Window from '@/bizMOB/Xross/Window';
```
- `openSignPad()` - 서명패드
- `openCodeReader()` - QR/바코드 리더
- `openFileExplorer()` - 파일 탐색기
- `openImageViewer()` - 이미지 뷰어

## 🤝 기여하기

1. 프로젝트 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/새기능`)
3. 변경사항 커밋 (`git commit -am '새 기능 추가'`)
4. 브랜치에 Push (`git push origin feature/새기능`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 [라이선스명]에 따라 라이선스가 부여됩니다.

## 📞 지원

- **문서**: [내부 문서 링크]
- **이슈 리포팅**: [이슈 트래커 링크]
- **개발팀 연락처**: [연락처 정보]
