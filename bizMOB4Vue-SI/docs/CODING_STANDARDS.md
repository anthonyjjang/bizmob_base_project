# bizMOB4Vue-SI Coding Standards

Vue 3 + Ionic + TypeScript 기반 하이브리드 모바일 애플리케이션의 코딩 표준 및 컨벤션입니다.

## 📋 목차

- [파일 및 폴더 명명 규칙](#-파일-및-폴더-명명-규칙)
- [TypeScript 스타일 가이드](#-typescript-스타일-가이드)
- [Vue.js 컴포넌트 가이드](#-vuejs-컴포넌트-가이드)
- [SCSS/CSS 스타일 가이드](#-scsscss-스타일-가이드)
- [bizMOB 클라이언트 코딩 패턴](#-bizmob-클라이언트-코딩-패턴)
- [상태 관리 (Vuex) 가이드](#-상태-관리-vuex-가이드)
- [에러 처리 및 로깅](#-에러-처리-및-로깅)
- [성능 최적화 가이드](#-성능-최적화-가이드)
- [테스트 및 Mock 데이터](#-테스트-및-mock-데이터)

## 📁 파일 및 폴더 명명 규칙

### 폴더 구조 규칙

```
src/
├── components/           # PascalCase
│   ├── AppHeader.vue    # 컴포넌트: PascalCase
│   └── elements/        # 서브 폴더: camelCase
├── views/               # 페이지별 UPPER_CASE
│   ├── LOGIN/          # 메뉴 그룹: UPPER_CASE
│   │   └── LOGIN0100.vue # 화면 코드: UPPER_CASE + 숫자
│   └── BOARD/
│       ├── BOARD0100.vue
│       └── BOARD0200.vue
├── bizMOB/             # 플랫폼별 PascalCase
│   ├── BzClass/        # 클래스 그룹: PascalCase
│   └── Xross/          # API 그룹: PascalCase
└── shared/             # 공통 모듈: camelCase
    ├── composables/    # Vue 3 Composables
    └── services/       # 비즈니스 서비스
```

### 파일 명명 규칙

| 파일 유형 | 규칙 | 예시 |
|----------|------|------|
| Vue 컴포넌트 | PascalCase | `AppHeader.vue`, `AppLoading.vue` |
| 페이지 컴포넌트 | UPPER_CASE + 숫자 | `LOGIN0100.vue`, `BOARD0200.vue` |
| TypeScript 파일 | PascalCase (클래스) / camelCase (함수) | `BzToken.ts`, `useNetwork.ts` |
| 서비스 파일 | PascalCase + Service | `StoreService.ts`, `NetworkService.ts` |
| Composable 파일 | use + PascalCase | `useMessage.ts`, `useNavigate.ts` |
| 상수 파일 | camelCase | `constants.ts`, `validators.ts` |

## 🔧 TypeScript 스타일 가이드

### 기본 설정

```typescript
// tsconfig.json 기반 설정
{
  "compilerOptions": {
    "target": "ES5",
    "strict": true,
    "noImplicitAny": false,  // bizMOB 호환성을 위해 허용
    "skipLibCheck": true
  }
}
```

### 코드 스타일 (ESLint 규칙)

```typescript
// 들여쓰기: 4칸 (Space)
const example = {
    property: 'value',
    nested: {
        key: 'value'
    }
};

// 따옴표: Single Quote
const message = 'Hello World';

// 세미콜론: 필수
const result = calculateValue();

// 변수 선언: const/let 사용, var 허용 (레거시 코드 호환)
const immutableValue = 'constant';
let mutableValue = 'variable';
```

### 타입 정의 패턴

```typescript
// 인터페이스 정의 (권장)
interface UserInfo {
    userId: string;
    userName: string;
    userSeq?: string; // Optional 필드
}

// 제네릭 타입 활용
interface ApiResponse<T> {
    result: boolean;
    data: T;
    errorCode?: string;
}

// 함수 시그니처
const fetchUser = async (userId: string): Promise<UserInfo> => {
    // 구현
};

// bizMOB 호환성을 위한 any 타입 허용
const bizMOB: any = window.bizMOB;
```

### 클래스 정의 패턴

```typescript
export default class BzToken {
    // Static 속성
    private static isInitialized = false;
    private static accessToken: string | null = null;

    // Getter
    public static getAccessToken(): string | null {
        return this.accessToken;
    }

    // 메소드
    public static init(arg: {
        accessToken: string;
        accessTokenExpTime: string;
    }): void {
        this.isInitialized = true;
        this.accessToken = arg.accessToken;
    }

    // Promise 반환 메소드
    public static renewToken(arg?: {
        _bProgressEnable?: boolean;
    }): Promise<Record<string, any>> {
        return new Promise((resolve, reject) => {
            // 구현
        });
    }
}
```

## 🎨 Vue.js 컴포넌트 가이드

### 컴포넌트 구조 (Composition API)

```vue
<template>
    <ion-page>
        <ion-header>
            <AppHeader
                title="페이지 제목"
                :left-buttons="['back']"
                :right-buttons="['menu']"
            />
        </ion-header>

        <ion-content>
            <div class="content">
                <!-- 콘텐츠 -->
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { StoreService, useNavigate } from '@/shared';

// 1. Props 정의
const props = defineProps({
    title: { type: String, default: '' },
    data: { type: Array as PropType<UserInfo[]>, default: () => [] }
});

// 2. Reactive 데이터
const loading = ref<boolean>(false);
const userList = ref<UserInfo[]>([]);

// 3. Computed
const filteredUsers = computed(() => {
    return userList.value.filter(user => user.active);
});

// 4. Composable 사용
const { openPage } = useNavigate();
const userStore = new StoreService('user');

// 5. 메소드
const loadUsers = async (): Promise<void> => {
    loading.value = true;
    try {
        const response = await userStore.dispatch('getUsers');
        userList.value = response.data;
    } catch (error) {
        console.error('사용자 로드 실패:', error);
    } finally {
        loading.value = false;
    }
};

// 6. 라이프사이클
onMounted(() => {
    loadUsers();
});
</script>

<style scoped lang="scss">
.content {
    margin: 0 16px;
    padding-bottom: 30px;
}
</style>
```

### 컴포넌트 Props 패턴

```typescript
// Props 타입 정의
interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    size?: 'small' | 'regular' | 'large';
    variant?: 'default' | 'blue' | 'line' | 'white';
    disabled?: boolean;
}

// Props 선언 (권장)
const props = defineProps({
    type: { type: String as PropType<ButtonProps['type']>, default: 'button' },
    size: { type: String as PropType<ButtonProps['size']>, default: 'regular' },
    variant: { type: String as PropType<ButtonProps['variant']>, default: 'default' },
    disabled: { type: Boolean, default: false }
});
```

### 이벤트 처리 패턴

```vue
<template>
    <button @click="handleClick" @keyup.enter="handleEnter">
        클릭
    </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    click: [event: MouseEvent];
    submit: [data: FormData];
}>();

const handleClick = (event: MouseEvent): void => {
    emit('click', event);
};

const handleEnter = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
        handleClick(event as any);
    }
};
</script>
```

## 🎨 SCSS/CSS 스타일 가이드

### 스타일 구조

```scss
// 1. 변수 정의 (CSS Custom Properties 사용)
:root {
    --ion-color-primary: #2f4592;
    --ion-text-color: #202020;
    --ion-background-color: #fff;
}

// 2. 컴포넌트 스타일
.login-form {
    padding-bottom: 30px;

    // 중첩 선택자 (최대 3단계까지)
    .form-submit {
        margin-top: 65px;
        
        .button {
            width: 100%;
            
            &.button-blue {
                background-color: var(--ion-color-primary);
            }
        }
    }
}

// 3. 상태 클래스
.is-loading {
    opacity: 0.7;
    pointer-events: none;
}

.is-active {
    color: var(--ion-color-primary);
}
```

### BEM 방법론 적용

```scss
// Block__Element--Modifier 패턴
.board-list {                    // Block
    margin: 0 -16px;
    
    &__item {                   // Element
        position: relative;
        padding: 16px;
        
        &--active {             // Modifier
            background-color: #f0f0f0;
        }
        
        &--disabled {
            opacity: 0.5;
        }
    }
    
    &__header {
        display: flex;
        align-items: center;
    }
    
    &__content {
        margin-top: 9px;
        font-size: 16px;
        
        &::after {
            content: '';
            position: absolute;
            // ... arrow icon
        }
    }
}
```

### 반응형 및 사이즈 기준

```scss
// 기본 사이즈 단위
.component {
    // 고정 사이즈: px 사용
    border: 1px solid #dfdfdf;
    border-radius: 5px;
    
    // 상대 사이즈: rem/em 사용
    font-size: 1rem;        // 16px
    padding: 0.75rem;       // 12px
    margin: 1.25rem 0;      // 20px 0
    
    // 퍼센트: 반응형 레이아웃
    width: 100%;
    max-width: 400px;
}

// Ionic 브레이크포인트
@media (min-width: 768px) {
    .mobile-only {
        display: none;
    }
}
```

## 🚀 bizMOB 클라이언트 코딩 패턴

### API 호출 패턴

```typescript
// 1. Xross API 래퍼 클래스
export default class Network {
    static requestTr(arg: {
        _sTrcode: string;
        _oHeader?: Record<string, any>;
        _oBody?: Record<string, any>;
        _bMock?: boolean;
    }): Promise<Record<string, any>> {
        return new Promise(resolve => {
            bizMOB.Network.requestTr({
                ...arg,
                _fCallback: (res: any) => resolve(res)
            });
        });
    }
}

// 2. Composable에서 활용
export function useNetwork() {
    const generateHttpHeader = (): Record<string, any> => ({
        'Content-Type': 'application/json'
    });

    const requestTr = async (params: {
        trcode: string;
        body?: Record<string, any>;
        isMock?: boolean;
        isLoading?: boolean;
    }): Promise<ApiResponse> => {
        const { trcode, body = {}, isMock = false, isLoading = true } = params;
        
        if (isLoading) {
            appStore.dispatch('showLoading');
        }

        try {
            const response = await Network.requestTr({
                _sTrcode: trcode,
                _oHttpHeader: generateHttpHeader(),
                _oBody: body,
                _bMock: isMock
            });

            return {
                result: response.header.result,
                data: response.body,
                errorCode: response.header.error_code
            };
        } finally {
            if (isLoading) {
                appStore.dispatch('hideLoading');
            }
        }
    };

    return { requestTr };
}
```

### 토큰 및 암호화 패턴

```typescript
// BzToken 클래스 사용 패턴
export class AuthService {
    static async login(userId: string, password: string): Promise<boolean> {
        try {
            const response = await Network.requestLogin({
                _sTrcode: 'DM0001',
                _sUserId: userId,
                _sPassword: password
            });

            if (response.header.result) {
                // JWT 토큰 초기화
                BzToken.init({
                    accessToken: response.body.accessToken,
                    accessTokenExpTime: response.body.accessTokenExpTime,
                    refreshToken: response.body.refreshToken,
                    refreshTokenExpTime: response.body.refreshTokenExpTime
                });

                return true;
            }
            
            return false;
        } catch (error) {
            console.error('로그인 실패:', error);
            return false;
        }
    }

    static async refreshToken(): Promise<boolean> {
        try {
            await BzToken.renewToken({ _bProgressEnable: false });
            return true;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            return false;
        }
    }
}
```

### Native API 활용 패턴

```typescript
// Device 정보 조회
import Device from '@/bizMOB/Xross/Device';

export const useDevice = () => {
    const getDeviceInfo = async (): Promise<DeviceInfo> => {
        const info = await Device.getInfo();
        
        return {
            platform: info.platform,
            version: info.version,
            model: info.model,
            uuid: info.uuid
        };
    };

    return { getDeviceInfo };
};

// File 처리
import File from '@/bizMOB/Xross/File';

export const useFile = () => {
    const selectImage = async (): Promise<string[]> => {
        return await File.selectPhoto({
            _nMaxCount: 5,
            _bMultiple: true,
            _sSourceType: 'PHOTO_LIBRARY'
        });
    };

    return { selectImage };
};
```

## 🗃️ 상태 관리 (Vuex) 가이드

### 모듈 구조 패턴

```typescript
// store/modules/user.ts
export default {
    namespaced: true,
    
    state: {
        userInfo: null as UserInfo | null,
        isLoggedIn: false,
        preferences: {}
    },
    
    getters: {
        userInfo: (state: any): UserInfo | null => state.userInfo,
        isLoggedIn: (state: any): boolean => state.isLoggedIn,
        displayName: (state: any): string => {
            return state.userInfo?.userName || '사용자';
        }
    },
    
    mutations: {
        setState(state: any, { key, value }: { key: string; value: any }) {
            state[key] = value;
        },
        
        setUserInfo(state: any, userInfo: UserInfo) {
            state.userInfo = userInfo;
            state.isLoggedIn = !!userInfo;
        }
    },
    
    actions: {
        async login({ commit }: any, credentials: LoginCredentials) {
            const { requestLogin } = useNetwork();
            
            const response = await requestLogin({
                trcode: 'DM0001',
                userId: credentials.userId,
                password: credentials.password,
                isMock: true
            });
            
            if (response.result) {
                commit('setUserInfo', response.body);
                return response.body;
            }
            
            return null;
        },
        
        logout({ commit }: any) {
            commit('setUserInfo', null);
            commit('setState', { key: 'preferences', value: {} });
        }
    }
};
```

### StoreService 활용 패턴

```typescript
// shared/services/StoreService.ts 사용법
export const useUser = () => {
    const userStore = new StoreService('user');
    
    const login = async (credentials: LoginCredentials) => {
        return await userStore.dispatch('login', credentials);
    };
    
    const getUserInfo = () => {
        return userStore.getters('userInfo');
    };
    
    const logout = () => {
        userStore.dispatch('logout');
    };
    
    return { login, getUserInfo, logout };
};
```

## ⚠️ 에러 처리 및 로깅

### 에러 처리 패턴

```typescript
// 통합 에러 처리
export function useNetwork() {
    const handleTrcodeChecker = (tr: any): ErrorResult => {
        // 데이터 구조 검증
        if (typeof tr !== 'object' || !tr?.header) {
            return {
                result: false,
                errorType: 'WAIT',
                errorCode: 'INVALID_RESPONSE',
                errorMessage: '알 수 없는 오류입니다.\n잠시후 다시 시도해 주세요.'
            };
        }

        // 비즈니스 로직 에러
        if (tr.header.result === false) {
            switch (tr.header.error_code) {
                case 'ERR000': // 토큰 만료
                    return {
                        result: false,
                        errorType: 'RESTART',
                        errorCode: tr.header.error_code,
                        errorMessage: '세션이 만료되었습니다.\n다시 로그인하세요.'
                    };

                case 'NE0001':
                case 'NE0002': // 네트워크 에러
                    return {
                        result: false,
                        errorType: 'WAIT',
                        errorCode: tr.header.error_code,
                        errorMessage: '네트워크 연결을 확인해주세요.'
                    };

                default:
                    return {
                        result: false,
                        errorType: 'WAIT',
                        errorCode: tr.header.error_code,
                        errorMessage: tr.header.error_text || '서버 오류가 발생했습니다.'
                    };
            }
        }

        return { result: true };
    };
}
```

### 로깅 패턴

```typescript
// Logger 활용
import Logger from '@/bizMOB/Xross/Logger';

export const useLogger = () => {
    const logInfo = (message: string, data?: any): void => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[INFO] ${message}`, data);
        }
        
        Logger.writeLog({
            _sLevel: 'INFO',
            _sMessage: message,
            _oData: data
        });
    };

    const logError = (message: string, error?: Error): void => {
        console.error(`[ERROR] ${message}`, error);
        
        Logger.writeLog({
            _sLevel: 'ERROR',
            _sMessage: message,
            _oData: {
                error: error?.message,
                stack: error?.stack
            }
        });
    };

    return { logInfo, logError };
};
```

## ⚡ 성능 최적화 가이드

### 컴포넌트 최적화

```vue
<template>
    <!-- v-show vs v-if 적절한 사용 -->
    <div v-show="isVisible">자주 토글되는 요소</div>
    <div v-if="shouldRender">조건적 렌더링</div>
    
    <!-- 리스트 최적화 -->
    <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="list-item"
    >
        {{ item.title }}
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Computed로 계산된 값 캐싱
const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return items.value.slice(start, end);
});

// 대량 데이터 처리 시 가상 스크롤링 활용
const pageSize = ref(20);
const currentPage = ref(1);
</script>
```

### 네트워크 최적화

```typescript
// 요청 캐싱
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export const useCachedRequest = () => {
    const cachedRequest = async (key: string, requestFn: () => Promise<any>) => {
        const cached = cache.get(key);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < CACHE_DURATION) {
            return cached.data;
        }
        
        const data = await requestFn();
        cache.set(key, { data, timestamp: now });
        
        return data;
    };
    
    return { cachedRequest };
};

// 디바운싱을 통한 검색 최적화
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (keyword: string) => {
    if (keyword.length < 2) return;
    
    const results = await searchAPI(keyword);
    searchResults.value = results;
}, 300);
```

## 🧪 테스트 및 Mock 데이터

### Mock 데이터 패턴

```json
// public/mock/DM0001.json
{
    "header": {
        "result": true,
        "error_code": "",
        "error_text": "",
        "trcode": "mock-DM0001"
    },
    "body": {
        "userSeq": "MU0000000129",
        "userId": "testuser",
        "userName": "테스트사용자",
        "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
        "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
    }
}
```

### Mock 활용 패턴

```typescript
// 환경별 Mock 설정
const useMock = process.env.NODE_ENV === 'development';

const { requestTr } = useNetwork();

const fetchBoardList = async (params: BoardSearchParams) => {
    return await requestTr({
        trcode: 'DM0002',
        body: params,
        isMock: useMock, // 개발 환경에서만 Mock 사용
        isLoading: true
    });
};

// Mock 데이터 생성 헬퍼
export const mockDataGenerator = {
    generateBoardList(count: number = 10): BoardItem[] {
        return Array.from({ length: count }, (_, index) => ({
            boardSeq: `BS000000000${index + 1}`,
            title: `게시글 제목 ${index + 1}`,
            regDate: '20240315 140000',
            regName: 'testuser',
            categoryName: '공지사항'
        }));
    },
    
    generateUser(overrides: Partial<UserInfo> = {}): UserInfo {
        return {
            userSeq: 'MU0000000001',
            userId: 'testuser',
            userName: '테스트사용자',
            ...overrides
        };
    }
};
```

## 📏 코드 품질 관리

### ESLint 설정 준수

```javascript
// .eslintrc.js 주요 규칙
module.exports = {
    rules: {
        // 세미콜론 필수
        'semi': ['error', 'always'],
        
        // Single Quote 사용
        'quotes': ['error', 'single'],
        
        // 4칸 들여쓰기
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        
        // TypeScript any 허용 (bizMOB 호환성)
        '@typescript-eslint/no-explicit-any': 'off',
        
        // 사용하지 않는 변수 경고 비활성화 (개발 중)
        '@typescript-eslint/no-unused-vars': 'off',
        
        // Vue 컴포넌트 이름 규칙 비활성화
        'vue/multi-word-component-names': 0
    }
};
```

### 주석 및 문서화

```typescript
/**
 * @title 사용자 인증 서비스
 * @description JWT 토큰 기반 인증 및 세션 관리
 */
export class AuthService {
    /**
     * 사용자 로그인
     * @param credentials 로그인 정보
     * @returns Promise<UserInfo | null> 로그인 성공 시 사용자 정보, 실패 시 null
     */
    static async login(credentials: LoginCredentials): Promise<UserInfo | null> {
        // 구현 내용
    }

    /**
     * JWT 토큰 갱신
     * @param options 갱신 옵션
     * @throws {TokenExpiredError} 리프레시 토큰 만료 시
     */
    static async refreshToken(options?: RefreshOptions): Promise<void> {
        // 구현 내용
    }
}

// 복잡한 비즈니스 로직에 대한 주석
const handleTrcodeChecker = (tr: any): ErrorResult => {
    // 1. 응답 데이터 구조 유효성 검사
    if (typeof tr !== 'object' || !tr?.header) {
        return createErrorResult('INVALID_RESPONSE');
    }

    // 2. 긴급 업데이트 플래그 확인
    if (tr.header.content_update_flag && tr.header.emergency_flag) {
        return createErrorResult('FORCE_UPDATE');
    }

    // 3. 비즈니스 로직 에러 코드 분류
    if (!tr.header.result) {
        return handleBusinessError(tr.header.error_code);
    }

    return { result: true };
};
```

---

이 코딩 표준은 bizMOB4Vue-SI 프로젝트의 일관성과 유지보수성을 높이기 위한 가이드라인입니다. 새로운 개발자의 온보딩과 코드 리뷰 시 기준으로 활용하시기 바랍니다.