# bizMOB4Vue-SI 초기 세팅 가이드

신규 프로젝트 생성 시 bizMOB4Vue-SI 베이스 프로젝트를 활용한 초기 환경 설정 가이드입니다.

## 📋 목차

- [개발 환경 요구사항](#-개발-환경-요구사항)
- [프로젝트 초기화](#-프로젝트-초기화)
- [의존성 설치 및 설정](#-의존성-설치-및-설정)
- [환경 변수 설정](#-환경-변수-설정)
- [bizMOB 플랫폼 설정](#-bizmob-플랫폼-설정)
- [개발 도구 설정](#-개발-도구-설정)
- [빌드 및 배포 설정](#-빌드-및-배포-설정)
- [프로젝트 구조 커스터마이징](#-프로젝트-구조-커스터마이징)

## 💻 개발 환경 요구사항

### 필수 소프트웨어

| 소프트웨어 | 버전 | 설명 |
|-----------|------|------|
| **Node.js** | 18.x 이상 | JavaScript 런타임 |
| **npm** | 8.x 이상 | 패키지 매니저 |
| **Vue CLI** | 5.0.8 | Vue.js 프로젝트 관리 도구 |
| **TypeScript** | 5.4.5 | 타입 안전성 |
| **Git** | 2.x 이상 | 소스 코드 관리 |

### 선택적 도구

| 도구 | 용도 | 추천 버전 |
|------|------|----------|
| **VS Code** | 통합 개발 환경 | Latest |
| **Chrome DevTools** | 디버깅 | Latest |
| **Postman** | API 테스트 | Latest |
| **Android Studio** | Android 빌드 | 2023.x |
| **Xcode** | iOS 빌드 | 15.x |

## 🚀 프로젝트 초기화

### 1. 베이스 프로젝트 복사

```bash
# 베이스 프로젝트 클론
git clone <bizMOB4Vue-SI-repository> new-project-name
cd new-project-name

# Git 히스토리 초기화
rm -rf .git
git init
git add .
git commit -m "Initial commit from bizMOB4Vue-SI base"
```

### 2. 프로젝트 정보 수정

```bash
# package.json 수정
{
  "name": "new-project-name",
  "version": "1.0.0",
  "description": "신규 프로젝트 설명",
  "author": "개발팀",
  "private": true
}
```

### 3. 프로젝트 구조 확인

```
new-project-name/
├── public/                    # 정적 리소스
│   ├── bizMOB/               # bizMOB 플랫폼 라이브러리
│   ├── extlib/               # 외부 라이브러리
│   ├── mock/                 # Mock 데이터
│   └── index.html            # 메인 HTML
├── src/                      # 소스 코드
│   ├── components/           # 재사용 컴포넌트
│   ├── views/                # 페이지 컴포넌트
│   ├── router/               # 라우팅 설정
│   ├── store/                # 상태 관리
│   ├── bizMOB/               # bizMOB 클라이언트
│   ├── shared/               # 공통 모듈
│   ├── assets/               # 정적 에셋
│   └── locales/              # 다국어 파일
├── .env*                     # 환경 변수
├── vue.config.js             # Vue CLI 설정
├── tsconfig.json             # TypeScript 설정
└── package.json              # 프로젝트 설정
```

## 📦 의존성 설치 및 설정

### 1. 패키지 설치

```bash
# 의존성 설치
npm install

# 글로벌 도구 설치 (필요시)
npm install -g @vue/cli@5.0.8
npm install -g typescript
```

### 2. 주요 의존성 확인

```json
{
  "dependencies": {
    "vue": "^3.5.13",
    "@ionic/vue": "^8.5.6",
    "@ionic/vue-router": "^8.5.6",
    "vue-router": "^4.5.1",
    "vuex": "^4.1.0",
    "vuex-persistedstate": "^4.1.0",
    "vue-i18n": "^9.13.1",
    "typescript": "~5.4.5",
    "crypto-js": "^4.2.0",
    "moment": "^2.30.1",
    "dompurify": "^3.1.5"
  },
  "devDependencies": {
    "@vue/cli-service": "^5.0.8",
    "@typescript-eslint/eslint-plugin": "^7.7.1",
    "@typescript-eslint/parser": "^7.7.1",
    "eslint": "^8.57.0",
    "eslint-plugin-vue": "^9.25.0",
    "sass": "^1.77.2",
    "sass-loader": "^16.0.2"
  }
}
```

### 3. package.json 스크립트 설정

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "serve-sit": "cross-env NODE_ENV=development vue-cli-service serve --mode sit",
    "serve-uat": "cross-env NODE_ENV=development vue-cli-service serve --mode uat",
    "serve-uat:deploy": "cross-env NODE_ENV=production vue-cli-service serve --mode uat",
    "build": "vue-cli-service build",
    "build-sit": "cross-env NODE_ENV=production vue-cli-service build --mode sit",
    "build-uat": "cross-env NODE_ENV=production vue-cli-service build --mode uat", 
    "build-prod": "cross-env NODE_ENV=production vue-cli-service build --mode production",
    "build-prod:major": "cross-env NODE_ENV=production vue-cli-service build --mode production --dest dist/production/contents",
    "lint": "vue-cli-service lint",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

## ⚙️ 환경 변수 설정

### 1. 환경별 설정 파일 생성

```bash
# 개발 환경 (SIT)
# .env.sit
NODE_ENV=development
VUE_APP_ENV=sit
VUE_APP_API_BASE_URL=https://sit-api.company.com
VUE_APP_MOCK_ENABLED=true
VUE_APP_LOG_LEVEL=debug

# 스테이징 환경 (UAT)  
# .env.uat
NODE_ENV=production
VUE_APP_ENV=uat
VUE_APP_API_BASE_URL=https://uat-api.company.com
VUE_APP_MOCK_ENABLED=false
VUE_APP_LOG_LEVEL=info

# 운영 환경 (PROD)
# .env.production
NODE_ENV=production
VUE_APP_ENV=production
VUE_APP_API_BASE_URL=https://api.company.com
VUE_APP_MOCK_ENABLED=false
VUE_APP_LOG_LEVEL=error
```

### 2. Vue Config 설정

```javascript
// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 환경별 빌드 설정
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  
  // 개발 서버 설정
  devServer: {
    port: 8080,
    host: 'localhost',
    https: false,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  
  // 빌드 최적화
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 5,
            chunks: 'initial'
          }
        }
      }
    }
  },
  
  // CSS 전처리기 설정
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  }
});
```

## 🔧 bizMOB 플랫폼 설정

### 1. bizMOB 라이브러리 설정

```javascript
// public/bizMOB/app.config
{
  "app": {
    "id": "com.company.newproject",
    "name": "신규 프로젝트",
    "version": "1.0.0",
    "build": "1"
  },
  "server": {
    "protocol": "https",
    "host": "api.company.com",
    "port": 443,
    "context": "/api"
  },
  "security": {
    "enableSSL": true,
    "certificatePinning": false,
    "tokenRefreshInterval": 1800000
  }
}
```

### 2. 네이티브 API 초기화

```typescript
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { store } from './store';
import { IonicVue } from '@ionic/vue';

// bizMOB 플랫폼 초기화
declare global {
  interface Window {
    bizMOB: any;
  }
}

const app = createApp(App)
  .use(IonicVue, {
    rippleEffect: false,
    mode: 'md' // Material Design 모드 강제
  })
  .use(router)
  .use(store);

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
  // 인증 체크 로직
  const isAuthenticated = store.getters['login/loginToken'];
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

router.isReady().then(() => {
  app.mount('#app');
});
```

### 3. Mock 데이터 설정

```json
// public/mock/CONFIG.json
{
  "enabled": true,
  "baseDelay": 1000,
  "randomDelay": 500,
  "errorRate": 0.1,
  "transactions": {
    "DM0001": {
      "file": "DM0001.json",
      "delay": 1500,
      "description": "사용자 로그인"
    },
    "DM0002": {
      "file": "DM0002.json", 
      "delay": 800,
      "description": "게시판 목록 조회"
    }
  }
}
```

## 🛠️ 개발 도구 설정

### 1. VS Code 확장 프로그램

```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",                    // Vue 3 지원
    "Vue.vscode-typescript-vue-plugin",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",       // 코드 포맷팅
    "dbaeumer.vscode-eslint",       // ESLint
    "bradlc.vscode-tailwindcss",    // CSS IntelliSense
    "ms-vscode.vscode-json",        // JSON 지원
    "ionicframework.ionic"          // Ionic 지원
  ]
}
```

### 2. VS Code 워크스페이스 설정

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.vue": "vue"
  },
  "emmet.includeLanguages": {
    "vue-html": "html",
    "vue": "html"
  },
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false
}
```

### 3. TypeScript 설정 최적화

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "downlevelIteration": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": [
      "webpack-env",
      "node"
    ],
    "lib": [
      "ES5",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts", 
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## 🏗️ 빌드 및 배포 설정

### 1. 빌드 프로파일 설정

```bash
# 개발 환경 빌드
npm run build-sit

# 스테이징 환경 빌드  
npm run build-uat

# 운영 환경 빌드
npm run build-prod

# 운영 환경 빌드 (폰트 포함)
npm run build-prod:major
```

### 2. 배포 구조

```
dist/
├── sit/                      # 개발 환경
│   ├── contents/
│   │   ├── css/
│   │   ├── js/
│   │   └── img/
│   └── index.html
├── uat/                      # 스테이징 환경
└── production/               # 운영 환경
    ├── contents/
    │   ├── css/
    │   ├── js/
    │   ├── fonts/           # major 빌드에만 포함
    │   └── img/
    └── index.html
```

### 3. CI/CD 설정 예시

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run type checking
      run: npm run typecheck
      
    - name: Build for production
      run: npm run build-prod:major
      
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: |
        # 스테이징 서버 배포 로직
        
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        # 운영 서버 배포 로직
```

## 🎨 프로젝트 구조 커스터마이징

### 1. 새로운 페이지 추가

```bash
# 새로운 메뉴 그룹 생성
mkdir src/views/MYPAGE
touch src/views/MYPAGE/MYPAGE0100.vue

# 라우트 파일 생성
touch src/router/routes/mypage.ts
```

```typescript
// src/router/routes/mypage.ts
export default [
  {
    path: '/mypage',
    name: 'MYPAGE0100',
    component: () => import('@/views/MYPAGE/MYPAGE0100.vue'),
    meta: {
      title: '마이페이지',
      requiresAuth: true
    }
  }
];
```

### 2. 새로운 스토어 모듈 추가

```typescript
// src/store/modules/mypage.ts
export default {
  namespaced: true,
  
  state: {
    userProfile: null,
    preferences: {}
  },
  
  getters: {
    userProfile: (state: any) => state.userProfile,
    preferences: (state: any) => state.preferences
  },
  
  mutations: {
    setState(state: any, { key, value }: any) {
      state[key] = value;
    }
  },
  
  actions: {
    async fetchUserProfile({ commit }: any) {
      // API 호출 로직
    }
  }
};
```

### 3. 커스텀 컴포넌트 생성

```vue
<!-- src/components/MyCustomComponent.vue -->
<template>
  <div class="my-custom-component">
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  variant?: 'default' | 'primary';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});
</script>

<style scoped lang="scss">
.my-custom-component {
  padding: 16px;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  
  &.variant-primary {
    background-color: var(--ion-color-primary);
    color: white;
  }
}
</style>
```

## 🔍 초기 설정 체크리스트

- [ ] **Node.js 및 npm 버전** 확인
- [ ] **프로젝트 정보** 수정 (package.json)
- [ ] **의존성 설치** 완료
- [ ] **환경 변수** 설정 (.env 파일들)
- [ ] **bizMOB 설정** 완료 (app.config)
- [ ] **Mock 데이터** 확인 및 수정
- [ ] **개발 서버** 실행 확인 (`npm run serve-sit`)
- [ ] **빌드 테스트** 통과 (`npm run build-sit`)
- [ ] **ESLint 검사** 통과 (`npm run lint`)
- [ ] **TypeScript 검사** 통과 (`npm run typecheck`)
- [ ] **Git 저장소** 초기화 완료
- [ ] **VS Code 확장** 설치 완료
- [ ] **개발팀 온보딩** 문서 공유

## 🚨 트러블슈팅

### 자주 발생하는 문제들

| 문제 | 원인 | 해결 방법 |
|------|------|----------|
| 빌드 실패 | Node.js 버전 불일치 | nvm으로 18.x 버전 설치 |
| ESLint 에러 | 코드 스타일 불일치 | `npm run lint -- --fix` 실행 |
| TypeScript 에러 | 타입 정의 누락 | `@types` 패키지 설치 |
| 라우팅 오류 | 경로 설정 오류 | router/index.ts 확인 |
| Mock 데이터 안됨 | 환경 설정 오류 | VUE_APP_MOCK_ENABLED 확인 |

---

이 가이드를 통해 bizMOB4Vue-SI 베이스 프로젝트를 활용한 신규 프로젝트를 성공적으로 시작할 수 있습니다. 추가 질문이나 지원이 필요한 경우 개발팀에 문의하시기 바랍니다.