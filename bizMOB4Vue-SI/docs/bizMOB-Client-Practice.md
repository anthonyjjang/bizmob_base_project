# bizMOB Client Practice Guide

Vue.js 3 + Ionic을 기반으로 한 하이브리드 앱에서 bizMOB Client를 활용하는 실무 가이드입니다.

## 📋 개요

이 가이드는 `src/views` 하위의 실제 Vue 컴포넌트들을 분석하여 bizMOB Client 라이브러리를 효과적으로 활용하는 방법을 제시합니다.

### 프로젝트 구조 분석
```
src/views/
├── LOGIN/           # 로그인 관련 화면
│   └── LOGIN0100.vue      # 로그인 페이지
├── MAIN/            # 메인 화면
│   ├── MAIN0100.vue       # 메인 대시보드
│   └── MAIN0200.vue       # 샌드박스 테스트 페이지
├── BOARD/           # 게시판 관련 화면
│   ├── BOARD0100.vue      # 게시판 목록
│   ├── BOARD0101.vue      # 게시판 필터
│   ├── BOARD0200.vue      # 게시판 작성
│   ├── BOARD0201.vue      # 게시판 상세
│   └── BOARD0300.vue      # 게시판 뷰어
├── MENU/            # 메뉴 관련 화면
│   └── MENU0100.vue       # 사이드 메뉴
└── README/          # 예제 및 가이드 화면
    ├── README01.vue       # bizMOB API 예제
    ├── README02.vue       # 페이지 라우팅 예제
    └── README03_modal.vue # 모달 예제
```

## 🔧 bizMOB Xross.js 통합

### Xross.js 라이브러리 구조
```html
<!-- public/index.html -->
<script src="<%= BASE_URL %>bizMOB/bizMOB-polyfill.js"></script>
<script src="<%= BASE_URL %>bizMOB/bizMOB-locale.js"></script>
<script src="<%= BASE_URL %>bizMOB/bizMOB-core.js"></script>
<script src="<%= BASE_URL %>bizMOB/bizMOB-core-web.js"></script>
<script src="<%= BASE_URL %>bizMOB/bizMOB-xross4.js"></script>
```

### bizMOB Gateway 함수
```javascript
// public/bizMOB/bizMOB-xross4.js
bizMOB.gateway = function(sClassName, sMethod, aRequired, oParam) {
    var $bizMOBCore = window.bizMOBCore.readystatus ? window.bizMOBCore : window.bizMOBWebCore;
    // Mock 데이터 호출 지원
    var isMock = param._bMock || false;
    var isRelease = $bizMOBCore.App.config._bRelease || false;
    
    // Mock 모드에서만 Mock 데이터 호출
    if (isMock && !isRelease) {
        window.bizMOBWebCore.Http.requestMock(sClassName, sMethod, param);
    } else {
        return $bizMOBCore[sClassName][sMethod](param);
    }
};
```

## 🚀 실전 예제 분석

### 1. 로그인 구현 (LOGIN0100.vue)

#### 기본 로그인 프로세스
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { StoreService, useNavigate, useMessage } from '@/shared';

const loginStore = new StoreService('login');
const userStore = new StoreService('user');
const { openPage } = useNavigate();
const { alert, confirm } = useMessage();

const id = ref<string>('tester1');
const pw = ref<string>('1111');

// 로그인 버튼 클릭
const onLogin = async (): Promise<boolean> => {
    const { header, body }: Json = await loginStore.dispatch('postLogin', {
        userId: id.value,
        password: pw.value,
    });

    if (!isLogin(header)) {
        return false;
    } else {
        // 사용자 정보 저장
        setUser(body);
        
        // 후처리 과정
        if (await checkUser(body)) {
            movePage(body);
            return true;
        } else {
            clearUser();
            return false;
        }
    }
};
</script>
```

#### Vuex Store 로그인 액션
```typescript
// src/store/modules/login.ts
export default {
    actions: {
        async postLogin({ commit }: any, payload: {
            userId: string,
            password: string,
        }) {
            const { requestLogin } = useNetwork();
            const { result, header, body }: Res = await requestLogin({
                isMock: true,           // Mock 데이터 사용
                trcode: 'DM0001',       // 트랜잭션 코드
                userId: payload.userId,
                password: payload.password,
                body: {
                    userId: payload.userId,
                    passwd: payload.password,
                }
            });

            return result ? { header, body } : null;
        },
    },
};
```

### 2. 네트워크 요청 처리 (useNetwork.ts)

#### useNetwork Composable 구현
```typescript
// src/shared/composables/useNetwork.ts
import { useMessage, StoreService } from '@/shared';
import Network from '@/bizMOB/Xross/Network';
import App from '@/bizMOB/Xross/App';

export function useNetwork() {
    // 에러 코드별 처리 로직
    function handleTrcodeChecker(tr: any) {
        if (typeof tr !== 'object' || tr === null || tr.header === undefined) {
            return {
                result: false,
                errorType: 'WAIT',
                errorMessage: '알 수 없는 오류입니다.'
            };
        }
        
        // 긴급업데이트 처리
        if (tr.header.content_update_flag && tr.header.emergency_flag) {
            return {
                result: false,
                errorType: 'RESTART',
                errorMessage: '컨텐츠가 새 버전으로 변경되었습니다.'
            };
        }
        
        // 에러 코드별 분기 처리
        switch (tr.header.error_code) {
            case 'ERR000': // 세션 만료
                return {
                    result: false,
                    errorType: 'RESTART',
                    errorMessage: '장기간 미사용으로 접속이 끊어졌습니다.'
                };
            case 'HE0404':
            case 'NE0001':
                return {
                    result: false,
                    errorType: 'WAIT',
                    errorMessage: '서버에 연결할 수 없습니다.'
                };
        }
    }

    return {
        requestTr: async({
            trcode,
            httpHeader = {},
            header = {},
            body = {},
            timeout = 60,
            isMock = false,
            isLoading = true,
            isErrorAlert = true
        }: ReqTr): Promise<Res> => {
            const appStore = new StoreService('app');
            const { alert } = useMessage();

            // 로딩 표시
            if (isLoading) {
                appStore.dispatch('showLoading');
            }

            // bizMOB Network 호출
            const res: any = await Network.requestTr({
                _sTrcode: trcode,
                _oHttpHeader: httpHeader,
                _oHeader: header,
                _oBody: body,
                _bMock: isMock,
                _nTimeout: timeout,
                _bProgressEnable: false, // Native 프로그레스 Off
            });

            if (isLoading) {
                appStore.dispatch('hideLoading');
            }

            // 에러 처리
            const state: any = handleTrcodeChecker(res);
            
            if (state.result) {
                return {
                    result: state.result,
                    trcode: trcode,
                    header: res.header,
                    body: res.body,
                };
            } else {
                // 재시작이 필요한 경우
                if (state.errorType === 'RESTART') {
                    return await alert(state.errorMessage, () => {
                        App.exit({ _sType: 'logout' });
                        return { result: false, trcode, header: res.header, body: res.body };
                    });
                }
                // 일반 에러 처리
                else if (isErrorAlert) {
                    return await alert(state.errorMessage, () => ({
                        result: false,
                        trcode,
                        header: res.header,
                        body: res.body,
                    }));
                }
            }
        }
    };
}
```

### 3. bizMOB API 활용 예제 (README01.vue)

#### 직접 bizMOB API 호출
```vue
<script setup lang="ts">
/** Locale Service */
import BzLocale from '@/bizMOB/BzClass/BzLocale';

const onLocale = async() => {
    BzLocale.initLocale();                    // 언어 초기화
    BzLocale.changeLocale('ko-KR');           // 언어 변경
    
    console.log(await BzLocale.getLocale());  // {result: true, locale: 'ko-KR'}
};

/** bizMOB Network 호출 */
import Network from '@/bizMOB/Xross/Network';

// 로그인 요청
const onBizMOBRequestLogin = async() => {
    const res: any = await Network.requestLogin({
        _bMock: false,              // Mock 데이터 사용 안함
        _sTrcode: 'DM0001',        // 트랜잭션 코드
        _sUserId: 'tester1',       // 사용자 ID
        _sPassword: '1111',        // 비밀번호
        _oBody: {
            userId: 'tester1',
            passwd: '1111',
        }
    });
    
    console.log(res);
};

// 일반 트랜잭션 요청
const onBizMOBRequestTr = async() => {
    const res: any = await Network.requestTr({
        _bMock: false,             // Mock 데이터 사용 안함
        _sTrcode: 'DM0002',       // 트랜잭션 코드
        _oBody: {
            startIndex: 0,
            endIndex: 9
        },
    });
    
    console.log(res);
};

// HTTP 요청
const onBizMOBRequestHttp = async() => {
    const res: any = await Network.requestHttp({
        _sUrl: 'https://jsonplaceholder.typicode.com/posts',
        _sMethod: 'GET',
    });
    
    console.log(res);
};
</script>
```

### 4. 게시판 구현 (BOARD0100.vue)

#### 페이징과 검색 기능
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNetwork, useDate, useModal } from '@/shared';

const { requestTr } = useNetwork();
const { toFormattedDate } = useDate();
const { openSheet, openPopup } = useModal();

// 상태 관리
const searchKeyword = ref<string>('');
const searchParams = ref<Json>({
    keyword: '',
    targetCode: '',
    categoryCode: '',
});
const pageIndex = ref<number>(1);
const totalCount = ref<number>(0);
const list = ref<Json[] | null>(null);

// 페이지 계산
const pageMaxIndex = computed(() => Math.ceil(totalCount.value / ROW_NUM));

onMounted(async () => {
    list.value = await handleList(pageIndex.value);
});

// 검색 기능
const onSearch = async () => {
    list.value = await handleList(1, {
        keyword: searchKeyword.value,
    });
};

// 목록 조회
const handleList = async(index: number, params?: Json) => {
    searchParams.value = { ...searchParams.value, ...params };
    
    if (index === 1) {
        list.value = null;  // 첫 페이지는 목록 초기화
    }

    const start = (index - 1) * ROW_NUM + 1;
    const end = index * ROW_NUM;
    
    const body = await getPosts({
        startIndex: start,
        endIndex: end,
        keyword: searchParams.value.keyword,
        targetCode: searchParams.value.targetCode,
        categoryCode: searchParams.value.categoryCode,
    });

    if (body) {
        pageIndex.value = index;
        totalCount.value = body.totalCnt;
        return body.list;
    }
    
    return [];
};

// 게시글 조회 API
const getPosts = async (payload: {
    startIndex: number,
    endIndex: number,
    keyword: string,
    targetCode: string,
    categoryCode: string,
}) => {
    const { result, body }: Res = await requestTr({
        isMock: true,                    // Mock 데이터 사용
        trcode: 'DM0002',               // 트랜잭션 코드
        body: payload,
        isLoading: payload.startIndex === 1,  // 첫 페이지만 로딩 표시
    });

    return result ? body : null;
};
</script>
```

### 5. Ionic 라이프사이클 활용 (MAIN0100.vue)

#### Ionic Vue 라이프사이클
```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from '@ionic/vue';
import { useNavigate } from '@/shared';

const { isBackNavigation } = useNavigate();

// Ionic 라이프사이클 - 진입 전 (재진입시에도 호출됨)
onIonViewWillEnter(() => {
    console.log('ionViewWillEnter');
    console.log('>> 화면 Back 진입 여부', isBackNavigation());
});

// Vue 라이프사이클 - 마운트 (최초 생성시만 호출)
onMounted(() => {
    console.log('mounted');
});

// Ionic 라이프사이클 - 진입 완료 (재진입시에도 호출됨)
onIonViewDidEnter(() => {
    console.log('ionViewDidEnter');
});

// Ionic 라이프사이클 - 떠나기 전
onIonViewWillLeave(() => {
    console.log('ionViewWillLeave');
});

// Ionic 라이프사이클 - 떠나기 완료
onIonViewDidLeave(() => {
    console.log('ionViewDidLeave');
});
</script>
```

## 🧪 Mock 데이터 활용 및 테스트

### 1. Mock 데이터 시스템 구조

#### Mock 데이터 디렉터리 구조
```
public/mock/
├── DM0001.json              # 로그인 Mock 데이터
├── DM0002.json              # 게시판 목록 Mock 데이터  
├── DM0003.json              # 사용자 정보 Mock 데이터
├── DM0004.json              # 파일 업로드 Mock 데이터
├── DM9999.json              # 공통 에러 Mock 데이터
└── bizMOB/                  # Native API Mock 데이터
    ├── App/
    │   ├── callPlugIn/
    │   │   ├── APP_UPDATE_CHECK.json
    │   │   └── LOGIN_APPLE.json
    │   ├── exit.json
    │   ├── getTimeout.json
    │   └── setTimeout.json
    ├── Contacts/
    │   └── get.json
    ├── Database/
    │   ├── executeSelect.json
    │   ├── executeSql.json
    │   └── openDatabase.json
    ├── File/
    │   ├── copy.json
    │   ├── download.json
    │   ├── upload.json
    │   └── resizeImage.json
    ├── Push/
    │   ├── getMessageList.json
    │   ├── getPushKey.json
    │   └── registerToServer.json
    └── System/
        ├── callCamera.json
        ├── callGallery.json
        ├── getGPS.json
        └── callTEL.json
```

### 2. Mock 데이터 구조 분석

#### 로그인 Mock 데이터 (DM0001.json)
```json
{
    "header": {
        "result": true,
        "error_code": "",
        "error_text": "",
        "trcode": "mock-LOGIN",
        "content_update_flag": false,
        "emergency_flag": false
    },
    "body": {
        "userSeq": "MU0000000129",
        "userId": "mcnc",
        "userName": "테스터",
        "stopYn": "Y",
        "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
        "accessTokenExpTime": "2099-12-31 23:59:59",
        "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
        "refreshTokenExpTime": "2099-12-31 23:59:59"
    }
}
```

#### 게시판 목록 Mock 데이터 (DM0002.json)
```json
{
    "header": {
        "result": true,
        "error_code": "",
        "error_text": "",
        "trcode": "mock-DM0002"
    },
    "body": {
        "totalCnt": 30,
        "list": [
            {
                "regDate": "20200318 171000",
                "regName": "mobile",
                "targetCode": "NT01",
                "targetName": "System",
                "categoryCode": "NC01",
                "categoryName": "시스템",
                "title": "서비스 점검 안내 1",
                "boardSeq": "BS0000000001"
            }
        ]
    }
}
```

### 3. Mock 데이터 활용 전략

#### 환경별 Mock 설정
```typescript
// config/mock.ts
export const mockConfig = {
    development: {
        enabled: true,
        delay: 1000,        // 실제 API 응답 시뮬레이션을 위한 지연시간
        errorRate: 0.1      // 10% 확률로 에러 응답 시뮬레이션
    },
    staging: {
        enabled: false,
        delay: 0,
        errorRate: 0
    },
    production: {
        enabled: false,
        delay: 0,
        errorRate: 0
    }
};

// Mock 설정 유틸리티
export const getMockConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return mockConfig[env] || mockConfig.development;
};
```

#### 동적 Mock 데이터 생성
```typescript
// utils/mockGenerator.ts
export class MockDataGenerator {
    // 사용자 데이터 생성
    static generateUser(count: number = 1) {
        return Array.from({ length: count }, (_, index) => ({
            userSeq: `MU${String(index + 1).padStart(10, '0')}`,
            userId: `user${index + 1}`,
            userName: `테스트유저${index + 1}`,
            email: `user${index + 1}@example.com`,
            regDate: this.getRandomDate()
        }));
    }
    
    // 게시글 데이터 생성
    static generatePosts(count: number = 10) {
        const categories = ['시스템', '프로모션', '이벤트', '공지사항'];
        const targets = ['System', 'Admin', 'User'];
        
        return Array.from({ length: count }, (_, index) => ({
            boardSeq: `BS${String(index + 1).padStart(10, '0')}`,
            title: `테스트 게시글 ${index + 1}`,
            categoryName: categories[Math.floor(Math.random() * categories.length)],
            targetName: targets[Math.floor(Math.random() * targets.length)],
            regDate: this.getRandomDate(),
            regName: 'tester'
        }));
    }
    
    private static getRandomDate(): string {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().replace(/[-:.]/g, '').slice(0, 14);
    }
}
```

#### Mock 응답 시뮬레이션
```typescript
// composables/useMockTest.ts
export function useMockTest() {
    const mockConfig = getMockConfig();
    
    const simulateNetworkDelay = (delay?: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, delay || mockConfig.delay);
        });
    };
    
    const simulateError = (errorRate?: number): boolean => {
        return Math.random() < (errorRate || mockConfig.errorRate);
    };
    
    const createMockResponse = (data: any, options?: {
        shouldError?: boolean;
        errorCode?: string;
        errorMessage?: string;
    }) => {
        if (options?.shouldError || simulateError()) {
            return {
                header: {
                    result: false,
                    error_code: options?.errorCode || 'ERR999',
                    error_text: options?.errorMessage || 'Mock Error Simulation'
                },
                body: null
            };
        }
        
        return {
            header: {
                result: true,
                error_code: '',
                error_text: ''
            },
            body: data
        };
    };
    
    return {
        simulateNetworkDelay,
        simulateError,
        createMockResponse
    };
}
```

### 4. Mock 기반 테스트 시나리오

#### 다양한 에러 상황 테스트
```typescript
// tests/mockScenarios.ts
export const mockScenarios = {
    // 로그인 테스트 시나리오
    login: {
        success: () => ({
            isMock: true,
            mockData: {
                header: { result: true, error_code: '' },
                body: { 
                    userId: 'test_user',
                    accessToken: 'mock_token_123',
                    accessTokenExpTime: '2099-12-31 23:59:59'
                }
            }
        }),
        
        invalidCredentials: () => ({
            isMock: true,
            mockData: {
                header: { 
                    result: false, 
                    error_code: 'DM000100501',
                    error_text: '아이디 또는 비밀번호가 올바르지 않습니다.'
                },
                body: null
            }
        }),
        
        accountLocked: () => ({
            isMock: true,
            mockData: {
                header: { 
                    result: false, 
                    error_code: 'DM000100502',
                    error_text: '계정이 잠겨있습니다. 관리자에게 문의하세요.'
                },
                body: null
            }
        }),
        
        sessionExpired: () => ({
            isMock: true,
            mockData: {
                header: { 
                    result: false, 
                    error_code: 'ERR000',
                    error_text: '세션이 만료되었습니다.'
                },
                body: null
            }
        })
    },
    
    // 네트워크 에러 테스트 시나리오
    network: {
        timeout: () => ({
            isMock: true,
            mockData: {
                header: { 
                    result: false, 
                    error_code: 'NE0002',
                    error_text: '네트워크 연결 시간이 초과되었습니다.'
                },
                body: null
            }
        }),
        
        serverError: () => ({
            isMock: true,
            mockData: {
                header: { 
                    result: false, 
                    error_code: 'HE0503',
                    error_text: '서버 내부 오류가 발생했습니다.'
                },
                body: null
            }
        })
    }
};

// 테스트 실행 유틸리티
export const runMockTest = async (scenario: Function, apiCall: Function) => {
    const mockData = scenario();
    const result = await apiCall(mockData);
    return result;
};
```

## 🔐 토큰 관리 및 인증 시스템

### 1. JWT 토큰 통합 관리

#### 토큰 관리 서비스
```typescript
// services/AuthTokenService.ts
import BzToken from '@/bizMOB/BzClass/BzToken';
import { StoreService } from '@/shared';

export class AuthTokenService {
    private static instance: AuthTokenService;
    private authStore: StoreService;
    private refreshPromise: Promise<any> | null = null;
    
    constructor() {
        this.authStore = new StoreService('auth');
    }
    
    static getInstance(): AuthTokenService {
        if (!AuthTokenService.instance) {
            AuthTokenService.instance = new AuthTokenService();
        }
        return AuthTokenService.instance;
    }
    
    // 토큰 초기화
    async initializeTokens(tokenData: {
        accessToken: string;
        accessTokenExpTime: string;
        refreshToken: string;
        refreshTokenExpTime: string;
    }) {
        try {
            // bizMOB 토큰 초기화
            BzToken.init(tokenData);
            
            // 스토어에 저장
            await this.authStore.dispatch('setTokenInfo', tokenData);
            
            // 자동 갱신 스케줄링
            this.scheduleTokenRefresh(tokenData.accessTokenExpTime);
            
            return true;
        } catch (error) {
            console.error('토큰 초기화 실패:', error);
            return false;
        }
    }
    
    // 토큰 갱신
    async refreshToken(): Promise<boolean> {
        // 이미 갱신 중인 경우 해당 Promise 반환 (중복 요청 방지)
        if (this.refreshPromise) {
            return await this.refreshPromise;
        }
        
        this.refreshPromise = this.performTokenRefresh();
        const result = await this.refreshPromise;
        this.refreshPromise = null;
        
        return result;
    }
    
    private async performTokenRefresh(): Promise<boolean> {
        try {
            if (!BzToken.isInit()) {
                throw new Error('토큰이 초기화되지 않았습니다.');
            }
            
            if (BzToken.isTokenExpired()) {
                const newTokens = await BzToken.renewToken({
                    _bProgressEnable: false
                });
                
                // 새로운 토큰으로 업데이트
                await this.authStore.dispatch('setTokenInfo', newTokens);
                
                // 다음 갱신 스케줄링
                this.scheduleTokenRefresh(newTokens.accessTokenExpTime);
                
                console.log('토큰 갱신 완료');
                return true;
            }
            
            return true;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            
            // 갱신 실패시 로그아웃 처리
            await this.clearTokens();
            await this.redirectToLogin();
            
            return false;
        }
    }
    
    // 토큰 만료 시간 기반 자동 갱신 스케줄링
    private scheduleTokenRefresh(expTime: string) {
        const expireTime = new Date(expTime + 'Z').getTime();
        const currentTime = new Date().getTime();
        const refreshTime = expireTime - currentTime - (5 * 60 * 1000); // 만료 5분 전 갱신
        
        if (refreshTime > 0) {
            setTimeout(() => {
                this.refreshToken();
            }, refreshTime);
        }
    }
    
    // 토큰 정리
    async clearTokens() {
        await this.authStore.dispatch('clearTokenInfo');
        // bizMOB 토큰도 초기화 (필요에 따라 구현)
    }
    
    // 로그인 페이지로 리다이렉트
    private async redirectToLogin() {
        const router = useRouter();
        await router.push({ name: 'LOGIN0100' });
    }
    
    // 토큰 유효성 검사
    isTokenValid(): boolean {
        return BzToken.isInit() && !BzToken.isTokenExpired();
    }
}
```

#### 토큰 인터셉터
```typescript
// interceptors/tokenInterceptor.ts
import { AuthTokenService } from '@/services/AuthTokenService';

export const tokenInterceptor = {
    // 요청 전 토큰 검사 및 갱신
    async beforeRequest(): Promise<boolean> {
        const authService = AuthTokenService.getInstance();
        
        if (!authService.isTokenValid()) {
            const refreshed = await authService.refreshToken();
            
            if (!refreshed) {
                // 토큰 갱신 실패시 로그인 필요
                throw new Error('TOKEN_REFRESH_FAILED');
            }
        }
        
        return true;
    },
    
    // 응답 후 토큰 관련 에러 처리
    async afterResponse(response: any): Promise<any> {
        if (response.header?.error_code === 'ERR000') {
            const authService = AuthTokenService.getInstance();
            
            // 토큰 갱신 시도
            const refreshed = await authService.refreshToken();
            
            if (refreshed) {
                // 갱신 성공시 원래 요청 재시도 플래그
                response.shouldRetry = true;
            } else {
                // 갱신 실패시 로그아웃 처리
                await authService.clearTokens();
                throw new Error('SESSION_EXPIRED');
            }
        }
        
        return response;
    }
};
```

### 2. 세션 관리 시스템

#### 세션 상태 관리
```typescript
// services/SessionService.ts
import { StoreService } from '@/shared';
import App from '@/bizMOB/Xross/App';

export class SessionService {
    private static instance: SessionService;
    private sessionStore: StoreService;
    private sessionTimer: number | null = null;
    private warningTimer: number | null = null;
    
    constructor() {
        this.sessionStore = new StoreService('session');
    }
    
    static getInstance(): SessionService {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }
    
    // 세션 시작
    async startSession(sessionData: {
        sessionId: string;
        userId: string;
        timeout: number; // 세션 타임아웃 (분)
    }) {
        await this.sessionStore.dispatch('setSessionInfo', {
            ...sessionData,
            startTime: new Date().getTime(),
            lastActivity: new Date().getTime()
        });
        
        // 세션 타이머 시작
        this.startSessionTimer(sessionData.timeout);
        
        // 활동 모니터링 시작
        this.startActivityMonitoring();
    }
    
    // 세션 연장
    async extendSession() {
        const sessionInfo = await this.sessionStore.getters('sessionInfo');
        
        if (sessionInfo) {
            await this.sessionStore.dispatch('updateLastActivity', new Date().getTime());
            
            // 타이머 재시작
            this.startSessionTimer(sessionInfo.timeout);
        }
    }
    
    // 세션 종료
    async endSession() {
        // 타이머 정리
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
        
        // 세션 정보 정리
        await this.sessionStore.dispatch('clearSession');
        
        // 앱 종료
        App.exit({ _sType: 'logout' });
    }
    
    // 세션 타임아웃 타이머 시작
    private startSessionTimer(timeoutMinutes: number) {
        // 기존 타이머 정리
        if (this.sessionTimer) clearTimeout(this.sessionTimer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
        
        const timeoutMs = timeoutMinutes * 60 * 1000;
        const warningMs = timeoutMs - (5 * 60 * 1000); // 5분 전 경고
        
        // 경고 타이머
        this.warningTimer = setTimeout(() => {
            this.showSessionWarning();
        }, warningMs);
        
        // 세션 종료 타이머
        this.sessionTimer = setTimeout(() => {
            this.endSession();
        }, timeoutMs);
    }
    
    // 세션 만료 경고
    private async showSessionWarning() {
        const { confirm } = useMessage();
        
        const result = await confirm({
            title: '세션 만료 알림',
            text: '세션이 5분 후 만료됩니다. 연장하시겠습니까?',
            buttons: [
                { text: '로그아웃', handler: () => false },
                { text: '연장', handler: () => true }
            ]
        });
        
        if (result) {
            await this.extendSession();
        } else {
            await this.endSession();
        }
    }
    
    // 사용자 활동 모니터링
    private startActivityMonitoring() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        const activityHandler = () => {
            this.extendSession();
        };
        
        events.forEach(event => {
            document.addEventListener(event, activityHandler, true);
        });
        
        // 컴포넌트 언마운트시 정리 필요
        onUnmounted(() => {
            events.forEach(event => {
                document.removeEventListener(event, activityHandler, true);
            });
        });
    }
}
```

## 🔒 암호화 통신 시스템

### 1. 암호화 관리 서비스

#### 통합 암호화 서비스
```typescript
// services/CryptoService.ts
import BzCrypto from '@/bizMOB/BzClass/BzCrypto';
import { StoreService } from '@/shared';

export class CryptoService {
    private static instance: CryptoService;
    private cryptoStore: StoreService;
    private isInitializing: boolean = false;
    
    constructor() {
        this.cryptoStore = new StoreService('crypto');
    }
    
    static getInstance(): CryptoService {
        if (!CryptoService.instance) {
            CryptoService.instance = new CryptoService();
        }
        return CryptoService.instance;
    }
    
    // 암호화 시스템 초기화
    async initializeCrypto(): Promise<boolean> {
        try {
            // 이미 초기화 중인 경우 대기
            if (this.isInitializing) {
                await this.waitForInitialization();
                return BzCrypto.isInit();
            }
            
            this.isInitializing = true;
            
            // 환경 변수 확인
            const encryptionEnabled = process.env.VUE_APP_ENCRYPTION_USE === 'true';
            
            if (!encryptionEnabled) {
                console.log('암호화 통신이 비활성화되어 있습니다.');
                return true;
            }
            
            // 저장된 암호화 정보 로드
            const savedCryptoInfo = await this.cryptoStore.getters('cryptoInfo');
            
            if (savedCryptoInfo && this.isValidCryptoInfo(savedCryptoInfo)) {
                // 기존 암호화 정보로 초기화
                BzCrypto.init(savedCryptoInfo);
                
                if (!BzCrypto.isTokenExpired()) {
                    return true;
                }
            }
            
            // 새로운 암호화 키 발급
            return await this.setupNewCrypto();
            
        } catch (error) {
            console.error('암호화 초기화 실패:', error);
            return false;
        } finally {
            this.isInitializing = false;
        }
    }
    
    // 새로운 암호화 키 설정
    private async setupNewCrypto(): Promise<boolean> {
        try {
            // BzCrypto 초기 설정
            BzCrypto.init({
                crySymKey: null,
                cryAuthToken: null,
                cryAuthTokenExpTime: null,
                cryRefreshToken: null,
                cryRefreshTokenExpTime: null
            });
            
            // 암호화 키 공유
            const cryptoInfo = await BzCrypto.shareAuthKey({
                _bProgressEnable: false
            });
            
            // 암호화 정보 저장
            await this.cryptoStore.dispatch('setCryptoInfo', cryptoInfo);
            
            console.log('새로운 암호화 키 설정 완료');
            return true;
            
        } catch (error) {
            console.error('암호화 키 설정 실패:', error);
            throw error;
        }
    }
    
    // 암호화 토큰 갱신
    async refreshCryptoToken(): Promise<boolean> {
        try {
            if (!BzCrypto.isInit()) {
                return await this.initializeCrypto();
            }
            
            if (BzCrypto.isTokenRequired()) {
                return await this.setupNewCrypto();
            }
            
            if (BzCrypto.isTokenExpired()) {
                try {
                    const cryptoInfo = await BzCrypto.renewAuthToken({
                        _bProgressEnable: false
                    });
                    
                    await this.cryptoStore.dispatch('setCryptoInfo', cryptoInfo);
                    console.log('암호화 토큰 갱신 완료');
                    return true;
                    
                } catch (error) {
                    console.warn('암호화 토큰 갱신 실패, 새 키 발급:', error);
                    return await this.setupNewCrypto();
                }
            }
            
            return true;
            
        } catch (error) {
            console.error('암호화 토큰 갱신 실패:', error);
            return false;
        }
    }
    
    // 암호화 정보 유효성 검사
    private isValidCryptoInfo(cryptoInfo: any): boolean {
        return cryptoInfo &&
               cryptoInfo.crySymKey &&
               cryptoInfo.cryAuthToken &&
               cryptoInfo.cryAuthTokenExpTime;
    }
    
    // 초기화 완료 대기
    private async waitForInitialization(maxWait: number = 10000): Promise<void> {
        const startTime = Date.now();
        
        while (this.isInitializing && (Date.now() - startTime < maxWait)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // 암호화 정보 정리
    async clearCrypto() {
        await this.cryptoStore.dispatch('clearCryptoInfo');
        // BzCrypto 정리는 필요에 따라 구현
    }
}
```

### 2. 암호화 통신 인터셉터

#### 자동 암호화 처리
```typescript
// interceptors/cryptoInterceptor.ts
import { CryptoService } from '@/services/CryptoService';

export const cryptoInterceptor = {
    // 요청 전 암호화 준비
    async beforeRequest(): Promise<boolean> {
        const encryptionEnabled = process.env.VUE_APP_ENCRYPTION_USE === 'true';
        
        if (!encryptionEnabled) {
            return true;
        }
        
        const cryptoService = CryptoService.getInstance();
        return await cryptoService.initializeCrypto();
    },
    
    // 응답 후 암호화 에러 처리
    async afterResponse(response: any): Promise<any> {
        const errorCode = response.header?.error_code;
        
        if (errorCode === 'EAH000' || errorCode === 'EAH001') {
            const cryptoService = CryptoService.getInstance();
            
            try {
                const refreshed = await cryptoService.refreshCryptoToken();
                
                if (refreshed) {
                    response.shouldRetry = true;
                } else {
                    throw new Error('CRYPTO_REFRESH_FAILED');
                }
            } catch (error) {
                console.error('암호화 토큰 처리 실패:', error);
                throw error;
            }
        }
        
        return response;
    }
};
```

## 🛡️ 고급 에러 핸들링

### 1. 통합 에러 관리 시스템

#### 에러 분류 및 처리 전략
```typescript
// services/ErrorHandlingService.ts
export enum ErrorCategory {
    NETWORK = 'NETWORK',
    AUTHENTICATION = 'AUTHENTICATION', 
    AUTHORIZATION = 'AUTHORIZATION',
    BUSINESS = 'BUSINESS',
    SYSTEM = 'SYSTEM',
    CRYPTO = 'CRYPTO',
    UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM', 
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface ErrorInfo {
    code: string;
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    retryable: boolean;
    userAction: 'NONE' | 'RETRY' | 'LOGIN' | 'CONTACT_SUPPORT' | 'RESTART';
}

export class ErrorHandlingService {
    private static instance: ErrorHandlingService;
    private errorMap: Map<string, ErrorInfo> = new Map();
    
    constructor() {
        this.initializeErrorMap();
    }
    
    static getInstance(): ErrorHandlingService {
        if (!ErrorHandlingService.instance) {
            ErrorHandlingService.instance = new ErrorHandlingService();
        }
        return ErrorHandlingService.instance;
    }
    
    // 에러 코드 맵 초기화
    private initializeErrorMap() {
        // 네트워크 에러
        this.errorMap.set('NE0001', {
            code: 'NE0001',
            message: '서버에 연결할 수 없습니다.',
            category: ErrorCategory.NETWORK,
            severity: ErrorSeverity.HIGH,
            retryable: true,
            userAction: 'RETRY'
        });
        
        this.errorMap.set('NE0002', {
            code: 'NE0002',
            message: '네트워크 연결 시간이 초과되었습니다.',
            category: ErrorCategory.NETWORK,
            severity: ErrorSeverity.MEDIUM,
            retryable: true,
            userAction: 'RETRY'
        });
        
        // 인증 에러
        this.errorMap.set('ERR000', {
            code: 'ERR000',
            message: '세션이 만료되었습니다. 다시 로그인해주세요.',
            category: ErrorCategory.AUTHENTICATION,
            severity: ErrorSeverity.HIGH,
            retryable: false,
            userAction: 'LOGIN'
        });
        
        this.errorMap.set('DM000100501', {
            code: 'DM000100501',
            message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            category: ErrorCategory.AUTHENTICATION,
            severity: ErrorSeverity.MEDIUM,
            retryable: true,
            userAction: 'NONE'
        });
        
        // 암호화 에러
        this.errorMap.set('EAH000', {
            code: 'EAH000',
            message: '암호화 키가 만료되었습니다.',
            category: ErrorCategory.CRYPTO,
            severity: ErrorSeverity.HIGH,
            retryable: true,
            userAction: 'RETRY'
        });
        
        this.errorMap.set('EAH001', {
            code: 'EAH001',
            message: '암호화 인증 토큰이 만료되었습니다.',
            category: ErrorCategory.CRYPTO,
            severity: ErrorSeverity.HIGH,
            retryable: true,
            userAction: 'RETRY'
        });
        
        // 서버 에러
        this.errorMap.set('HE0503', {
            code: 'HE0503',
            message: '서버 내부 오류가 발생했습니다.',
            category: ErrorCategory.SYSTEM,
            severity: ErrorSeverity.HIGH,
            retryable: true,
            userAction: 'CONTACT_SUPPORT'
        });
        
        // 업데이트 관련
        this.errorMap.set('CONTENT_UPDATE', {
            code: 'CONTENT_UPDATE',
            message: '앱 업데이트가 필요합니다.',
            category: ErrorCategory.SYSTEM,
            severity: ErrorSeverity.CRITICAL,
            retryable: false,
            userAction: 'RESTART'
        });
    }
    
    // 에러 분석 및 처리 방법 결정
    analyzeError(errorCode: string, context?: any): ErrorInfo {
        const errorInfo = this.errorMap.get(errorCode);
        
        if (errorInfo) {
            // 에러 로깅
            this.logError(errorInfo, context);
            return errorInfo;
        }
        
        // 알려지지 않은 에러
        const unknownError: ErrorInfo = {
            code: errorCode || 'UNKNOWN',
            message: '알 수 없는 오류가 발생했습니다.',
            category: ErrorCategory.UNKNOWN,
            severity: ErrorSeverity.MEDIUM,
            retryable: true,
            userAction: 'RETRY'
        };
        
        this.logError(unknownError, context);
        return unknownError;
    }
    
    // 에러 처리 실행
    async handleError(errorInfo: ErrorInfo, context?: any): Promise<boolean> {
        switch (errorInfo.userAction) {
            case 'RETRY':
                return await this.handleRetryAction(errorInfo, context);
                
            case 'LOGIN':
                return await this.handleLoginAction(errorInfo);
                
            case 'RESTART':
                return await this.handleRestartAction(errorInfo);
                
            case 'CONTACT_SUPPORT':
                return await this.handleSupportAction(errorInfo);
                
            case 'NONE':
            default:
                return await this.handleDefaultAction(errorInfo);
        }
    }
    
    // 재시도 처리
    private async handleRetryAction(errorInfo: ErrorInfo, context?: any): Promise<boolean> {
        const { confirm } = useMessage();
        
        if (errorInfo.severity === ErrorSeverity.CRITICAL) {
            // 자동 재시도
            return true;
        }
        
        return await confirm({
            title: '오류 발생',
            text: `${errorInfo.message}\n다시 시도하시겠습니까?`,
            buttons: [
                { text: '취소', handler: () => false },
                { text: '재시도', handler: () => true }
            ]
        });
    }
    
    // 로그인 처리
    private async handleLoginAction(errorInfo: ErrorInfo): Promise<boolean> {
        const { alert } = useMessage();
        const router = useRouter();
        
        await alert(errorInfo.message, async () => {
            // 세션 정리
            const authService = AuthTokenService.getInstance();
            await authService.clearTokens();
            
            // 로그인 페이지로 이동
            await router.push({ name: 'LOGIN0100' });
        });
        
        return false;
    }
    
    // 앱 재시작 처리
    private async handleRestartAction(errorInfo: ErrorInfo): Promise<boolean> {
        const { alert } = useMessage();
        
        await alert(errorInfo.message, () => {
            App.exit({ _sType: 'restart' });
        });
        
        return false;
    }
    
    // 지원팀 연락 처리
    private async handleSupportAction(errorInfo: ErrorInfo): Promise<boolean> {
        const { confirm } = useMessage();
        
        const contactSupport = await confirm({
            title: '시스템 오류',
            text: `${errorInfo.message}\n고객지원팀에 연락하시겠습니까?`,
            buttons: [
                { text: '나중에', handler: () => false },
                { text: '연락하기', handler: () => true }
            ]
        });
        
        if (contactSupport) {
            // 지원팀 연락 기능 (전화, 이메일 등)
            System.callTEL({ _sPhoneNumber: '1588-0000' });
        }
        
        return false;
    }
    
    // 기본 처리
    private async handleDefaultAction(errorInfo: ErrorInfo): Promise<boolean> {
        const { alert } = useMessage();
        
        await alert(errorInfo.message);
        return false;
    }
    
    // 에러 로깅
    private logError(errorInfo: ErrorInfo, context?: any) {
        const logLevel = this.getLogLevel(errorInfo.severity);
        const logData = {
            code: errorInfo.code,
            message: errorInfo.message,
            category: errorInfo.category,
            severity: errorInfo.severity,
            timestamp: new Date().toISOString(),
            context: context
        };
        
        switch (logLevel) {
            case 'error':
                Logger.error(`[${errorInfo.category}] ${errorInfo.message}`, logData);
                break;
            case 'warn':
                Logger.warn(`[${errorInfo.category}] ${errorInfo.message}`, logData);
                break;
            default:
                Logger.info(`[${errorInfo.category}] ${errorInfo.message}`, logData);
        }
        
        // 중요한 에러는 서버로 전송
        if (errorInfo.severity === ErrorSeverity.CRITICAL || errorInfo.severity === ErrorSeverity.HIGH) {
            this.reportErrorToServer(logData);
        }
    }
    
    private getLogLevel(severity: ErrorSeverity): string {
        switch (severity) {
            case ErrorSeverity.CRITICAL:
            case ErrorSeverity.HIGH:
                return 'error';
            case ErrorSeverity.MEDIUM:
                return 'warn';
            default:
                return 'info';
        }
    }
    
    // 서버로 에러 보고
    private async reportErrorToServer(errorData: any) {
        try {
            // 에러 보고 API 호출 (별도 구현 필요)
            // await Network.requestTr({
            //     _sTrcode: 'ERROR_REPORT',
            //     _oBody: errorData,
            //     _bMock: false
            // });
        } catch (error) {
            console.error('에러 보고 실패:', error);
        }
    }
}
```

### 2. 통합 에러 처리 Composable

#### useErrorHandler Composable
```typescript
// composables/useErrorHandler.ts
import { ErrorHandlingService } from '@/services/ErrorHandlingService';

export function useErrorHandler() {
    const errorService = ErrorHandlingService.getInstance();
    
    // 에러 처리 메인 함수
    const handleError = async (
        error: any, 
        context?: any,
        options?: {
            showAlert?: boolean;
            retryCallback?: Function;
            maxRetries?: number;
        }
    ): Promise<boolean> => {
        const errorCode = extractErrorCode(error);
        const errorInfo = errorService.analyzeError(errorCode, context);
        
        // 자동 재시도 로직
        if (errorInfo.retryable && options?.retryCallback && options?.maxRetries) {
            return await handleWithRetry(errorInfo, options.retryCallback, options.maxRetries);
        }
        
        // 일반 에러 처리
        if (options?.showAlert !== false) {
            return await errorService.handleError(errorInfo, context);
        }
        
        return false;
    };
    
    // 에러 코드 추출
    const extractErrorCode = (error: any): string => {
        if (typeof error === 'string') {
            return error;
        }
        
        if (error?.header?.error_code) {
            return error.header.error_code;
        }
        
        if (error?.response?.status) {
            return `HTTP_${error.response.status}`;
        }
        
        if (error?.code) {
            return error.code;
        }
        
        return 'UNKNOWN_ERROR';
    };
    
    // 재시도 로직
    const handleWithRetry = async (
        errorInfo: any,
        retryCallback: Function,
        maxRetries: number
    ): Promise<boolean> => {
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                const shouldRetry = await errorService.handleError(errorInfo);
                
                if (shouldRetry) {
                    const result = await retryCallback();
                    
                    if (result) {
                        return true; // 성공
                    }
                }
                
                retryCount++;
                
                if (retryCount < maxRetries) {
                    // 재시도 간격 (지수 백오프)
                    await new Promise(resolve => 
                        setTimeout(resolve, Math.pow(2, retryCount) * 1000)
                    );
                }
            } catch (retryError) {
                retryCount++;
                
                if (retryCount >= maxRetries) {
                    // 최대 재시도 횟수 초과
                    await handleError(retryError, { originalError: errorInfo });
                    return false;
                }
            }
        }
        
        return false;
    };
    
    // 특정 에러 타입별 처리
    const handleNetworkError = async (error: any, retryCallback?: Function) => {
        return await handleError(error, { type: 'network' }, {
            retryCallback,
            maxRetries: 3
        });
    };
    
    const handleAuthError = async (error: any) => {
        return await handleError(error, { type: 'authentication' }, {
            showAlert: true
        });
    };
    
    const handleCryptoError = async (error: any, retryCallback?: Function) => {
        return await handleError(error, { type: 'crypto' }, {
            retryCallback,
            maxRetries: 2
        });
    };
    
    return {
        handleError,
        handleNetworkError,
        handleAuthError,
        handleCryptoError
    };
}
```

### 3. 인터셉터 통합 활용

#### 통합 네트워크 인터셉터
```typescript
// interceptors/networkInterceptor.ts
import { tokenInterceptor } from './tokenInterceptor';
import { cryptoInterceptor } from './cryptoInterceptor';
import { useErrorHandler } from '@/composables/useErrorHandler';

export class NetworkInterceptor {
    private static instance: NetworkInterceptor;
    private maxRetries: number = 3;
    
    static getInstance(): NetworkInterceptor {
        if (!NetworkInterceptor.instance) {
            NetworkInterceptor.instance = new NetworkInterceptor();
        }
        return NetworkInterceptor.instance;
    }
    
    // 요청 전 처리
    async beforeRequest(requestOptions: any): Promise<any> {
        try {
            // 1. 토큰 검사 및 갱신
            await tokenInterceptor.beforeRequest();
            
            // 2. 암호화 준비
            await cryptoInterceptor.beforeRequest();
            
            // 3. 요청 로깅
            this.logRequest(requestOptions);
            
            return requestOptions;
            
        } catch (error) {
            console.error('요청 전 처리 실패:', error);
            throw error;
        }
    }
    
    // 응답 후 처리
    async afterResponse(response: any, originalRequest: any): Promise<any> {
        try {
            // 1. 응답 로깅
            this.logResponse(response);
            
            // 2. 토큰 관련 에러 처리
            response = await tokenInterceptor.afterResponse(response);
            
            // 3. 암호화 관련 에러 처리
            response = await cryptoInterceptor.afterResponse(response);
            
            // 4. 재시도가 필요한 경우
            if (response.shouldRetry && originalRequest.retryCount < this.maxRetries) {
                originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
                
                // 재시도 지연
                await this.delay(Math.pow(2, originalRequest.retryCount) * 1000);
                
                // 재요청 실행
                return await this.retryRequest(originalRequest);
            }
            
            return response;
            
        } catch (error) {
            const { handleError } = useErrorHandler();
            await handleError(error, { originalRequest });
            throw error;
        }
    }
    
    // 재시도 요청
    private async retryRequest(originalRequest: any): Promise<any> {
        // 원래 요청 재실행 (실제 구현에서는 Network.requestTr 등 호출)
        console.log('재시도 요청 실행:', originalRequest);
        
        // 여기서 실제 API 재호출 로직 구현
        return await this.executeRequest(originalRequest);
    }
    
    // 실제 요청 실행 (추상화)
    private async executeRequest(request: any): Promise<any> {
        // 실제 bizMOB Network 호출 로직
        // 이 부분은 useNetwork composable과 연동하여 구현
        throw new Error('executeRequest 구현 필요');
    }
    
    // 지연 함수
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 요청 로깅
    private logRequest(request: any) {
        if (process.env.NODE_ENV === 'development') {
            console.group('📤 API Request');
            console.log('Trcode:', request.trcode);
            console.log('Body:', request.body);
            console.log('Options:', request);
            console.groupEnd();
        }
    }
    
    // 응답 로깅
    private logResponse(response: any) {
        if (process.env.NODE_ENV === 'development') {
            const isSuccess = response.header?.result;
            const logMethod = isSuccess ? 'log' : 'error';
            
            console.group(`📥 API Response ${isSuccess ? '✅' : '❌'}`);
            console[logMethod]('Header:', response.header);
            console[logMethod]('Body:', response.body);
            console.groupEnd();
        }
    }
}
```

### 4. 통합 테스트 환경 구축

#### 테스트용 환경 설정
```typescript
// config/testEnvironment.ts
export class TestEnvironment {
    private static instance: TestEnvironment;
    private mockEnabled: boolean = false;
    private scenarios: Map<string, any> = new Map();
    
    static getInstance(): TestEnvironment {
        if (!TestEnvironment.instance) {
            TestEnvironment.instance = new TestEnvironment();
        }
        return TestEnvironment.instance;
    }
    
    // 테스트 환경 초기화
    initialize(config: {
        mockEnabled: boolean;
        defaultScenarios?: string[];
        errorSimulation?: {
            enabled: boolean;
            rate: number;
        };
    }) {
        this.mockEnabled = config.mockEnabled;
        
        if (config.defaultScenarios) {
            this.loadScenarios(config.defaultScenarios);
        }
        
        if (config.errorSimulation?.enabled) {
            this.setupErrorSimulation(config.errorSimulation.rate);
        }
    }
    
    // Mock 시나리오 로드
    private loadScenarios(scenarioNames: string[]) {
        scenarioNames.forEach(name => {
            try {
                const scenario = require(`@/tests/scenarios/${name}.json`);
                this.scenarios.set(name, scenario);
            } catch (error) {
                console.warn(`시나리오 로드 실패: ${name}`, error);
            }
        });
    }
    
    // 에러 시뮬레이션 설정
    private setupErrorSimulation(errorRate: number) {
        const originalRequestTr = Network.requestTr;
        
        Network.requestTr = async (params: any) => {
            // 확률적 에러 발생
            if (Math.random() < errorRate) {
                return {
                    header: {
                        result: false,
                        error_code: 'SIM_ERROR',
                        error_text: '시뮬레이션 에러입니다.'
                    },
                    body: null
                };
            }
            
            return await originalRequestTr.call(Network, params);
        };
    }
    
    // 특정 API에 대한 Mock 응답 설정
    setMockResponse(trcode: string, mockData: any) {
        if (this.mockEnabled) {
            this.scenarios.set(trcode, mockData);
        }
    }
    
    // Mock 응답 조회
    getMockResponse(trcode: string): any {
        return this.scenarios.get(trcode);
    }
    
    // 테스트 시나리오 실행
    async runTestScenario(scenarioName: string, testCallback: Function): Promise<any> {
        const scenario = this.scenarios.get(scenarioName);
        
        if (!scenario) {
            throw new Error(`시나리오를 찾을 수 없습니다: ${scenarioName}`);
        }
        
        try {
            // 시나리오 설정 적용
            Object.keys(scenario.mocks).forEach(trcode => {
                this.setMockResponse(trcode, scenario.mocks[trcode]);
            });
            
            // 테스트 실행
            const result = await testCallback();
            
            return {
                scenario: scenarioName,
                success: true,
                result: result
            };
            
        } catch (error) {
            return {
                scenario: scenarioName,
                success: false,
                error: error.message
            };
        }
    }
}
```

#### Mock 데이터 동적 생성기
```typescript
// utils/dynamicMockGenerator.ts
export class DynamicMockGenerator {
    // 페이징 데이터 생성
    static generatePaginatedData<T>(
        generator: () => T,
        totalCount: number,
        pageSize: number,
        currentPage: number
    ) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalCount);
        const list: T[] = [];
        
        for (let i = startIndex; i < endIndex; i++) {
            list.push(generator());
        }
        
        return {
            header: {
                result: true,
                error_code: '',
                error_text: ''
            },
            body: {
                totalCount: totalCount,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
                list: list
            }
        };
    }
    
    // 에러 응답 생성
    static generateErrorResponse(errorCode: string, errorMessage: string) {
        return {
            header: {
                result: false,
                error_code: errorCode,
                error_text: errorMessage
            },
            body: null
        };
    }
    
    // 지연된 응답 생성
    static async generateDelayedResponse(data: any, delay: number = 1000) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return data;
    }
    
    // 조건부 에러 응답
    static generateConditionalError(
        data: any,
        errorProbability: number = 0.1,
        errorCode: string = 'RANDOM_ERROR',
        errorMessage: string = '랜덤 에러 발생'
    ) {
        if (Math.random() < errorProbability) {
            return this.generateErrorResponse(errorCode, errorMessage);
        }
        
        return data;
    }
    
    // 실제적인 사용자 데이터 생성
    static generateRealisticUser() {
        const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
        const lastNames = ['민수', '지영', '현우', '수정', '영호', '미영', '준호', '은지', '태훈', '소영'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const userName = firstName + lastName;
        
        return {
            userSeq: `MU${String(Math.floor(Math.random() * 1000000)).padStart(10, '0')}`,
            userId: userName.toLowerCase(),
            userName: userName,
            email: `${userName.toLowerCase()}@example.com`,
            phone: `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            department: ['개발팀', '기획팀', '디자인팀', '마케팅팀'][Math.floor(Math.random() * 4)],
            position: ['사원', '대리', '과장', '차장', '부장'][Math.floor(Math.random() * 5)],
            regDate: this.getRandomDate(),
            lastLoginDate: this.getRecentDate()
        };
    }
    
    private static getRandomDate(): string {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toISOString().slice(0, 10).replace(/-/g, '') + ' ' +
               randomDate.toTimeString().slice(0, 8).replace(/:/g, '');
    }
    
    private static getRecentDate(): string {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().slice(0, 10).replace(/-/g, '') + ' ' +
               date.toTimeString().slice(0, 8).replace(/:/g, '');
    }
}
```

## 🔧 통합 활용 예제

### 1. 완전한 로그인 프로세스 구현

#### 통합 로그인 서비스
```typescript
// services/LoginService.ts
import { AuthTokenService } from './AuthTokenService';
import { CryptoService } from './CryptoService';
import { SessionService } from './SessionService';
import { useErrorHandler } from '@/composables/useErrorHandler';
import { useNetwork } from '@/shared';

export class LoginService {
    private static instance: LoginService;
    
    static getInstance(): LoginService {
        if (!LoginService.instance) {
            LoginService.instance = new LoginService();
        }
        return LoginService.instance;
    }
    
    // 완전한 로그인 프로세스
    async performLogin(credentials: {
        userId: string;
        password: string;
        rememberMe?: boolean;
    }): Promise<{
        success: boolean;
        userData?: any;
        error?: string;
    }> {
        const { handleAuthError } = useErrorHandler();
        const { requestLogin } = useNetwork();
        
        try {
            // 1. 암호화 시스템 초기화
            const cryptoService = CryptoService.getInstance();
            await cryptoService.initializeCrypto();
            
            // 2. 로그인 API 호출
            const response = await requestLogin({
                isMock: process.env.NODE_ENV === 'development',
                trcode: 'DM0001',
                userId: credentials.userId,
                password: credentials.password,
                body: {
                    userId: credentials.userId,
                    passwd: credentials.password,
                    deviceInfo: await this.getDeviceInfo()
                },
                isErrorAlert: false // 커스텀 에러 처리
            });
            
            if (!response.result) {
                await handleAuthError(response);
                return {
                    success: false,
                    error: response.header.error_text
                };
            }
            
            const userData = response.body;
            
            // 3. JWT 토큰 설정
            const authService = AuthTokenService.getInstance();
            await authService.initializeTokens({
                accessToken: userData.accessToken,
                accessTokenExpTime: userData.accessTokenExpTime,
                refreshToken: userData.refreshToken,
                refreshTokenExpTime: userData.refreshTokenExpTime
            });
            
            // 4. 세션 시작
            const sessionService = SessionService.getInstance();
            await sessionService.startSession({
                sessionId: userData.sessionId || 'session_' + Date.now(),
                userId: credentials.userId,
                timeout: 30 // 30분 세션 타임아웃
            });
            
            // 5. 사용자 정보 저장
            await this.saveUserData(userData, credentials.rememberMe);
            
            // 6. 로그인 후 처리
            await this.postLoginProcess(userData);
            
            return {
                success: true,
                userData: userData
            };
            
        } catch (error) {
            await handleAuthError(error);
            return {
                success: false,
                error: error.message || '로그인 중 오류가 발생했습니다.'
            };
        }
    }
    
    // 로그아웃 프로세스
    async performLogout(): Promise<void> {
        try {
            // 1. 로그아웃 API 호출 (필요한 경우)
            // await requestTr({ trcode: 'LOGOUT' });
            
            // 2. 세션 종료
            const sessionService = SessionService.getInstance();
            await sessionService.endSession();
            
            // 3. 토큰 정리
            const authService = AuthTokenService.getInstance();
            await authService.clearTokens();
            
            // 4. 암호화 정보 정리
            const cryptoService = CryptoService.getInstance();
            await cryptoService.clearCrypto();
            
            // 5. 사용자 데이터 정리
            await this.clearUserData();
            
        } catch (error) {
            console.error('로그아웃 처리 중 오류:', error);
        }
    }
    
    // 디바이스 정보 수집
    private async getDeviceInfo(): Promise<any> {
        return {
            platform: Device.isApp() ? 'app' : 'web',
            os: Device.isAndroid() ? 'android' : Device.isIOS() ? 'ios' : 'web',
            deviceType: Device.isTablet() ? 'tablet' : Device.isMobile() ? 'mobile' : 'desktop',
            appVersion: '1.0.0',
            timestamp: new Date().toISOString()
        };
    }
    
    // 사용자 데이터 저장
    private async saveUserData(userData: any, rememberMe: boolean = false): Promise<void> {
        const userStore = new StoreService('user');
        
        await userStore.dispatch('setUser', userData);
        
        if (rememberMe) {
            // 자동 로그인 정보 저장
            await Properties.set({
                _sKey: 'remembered_user',
                _sValue: JSON.stringify({
                    userId: userData.userId,
                    timestamp: Date.now()
                })
            });
        }
    }
    
    // 로그인 후 처리
    private async postLoginProcess(userData: any): Promise<void> {
        // 1. 사용자 권한 확인
        await this.checkUserPermissions(userData);
        
        // 2. 앱 설정 동기화
        await this.syncAppSettings(userData);
        
        // 3. 푸시 알림 등록
        await this.registerPushNotification(userData);
        
        // 4. 백그라운드 데이터 동기화
        this.startBackgroundSync();
    }
    
    // 사용자 권한 확인
    private async checkUserPermissions(userData: any): Promise<void> {
        // 권한 확인 로직 구현
        console.log('사용자 권한 확인:', userData.permissions);
    }
    
    // 앱 설정 동기화
    private async syncAppSettings(userData: any): Promise<void> {
        // 서버에서 사용자별 설정 가져오기
        console.log('앱 설정 동기화:', userData.settings);
    }
    
    // 푸시 알림 등록
    private async registerPushNotification(userData: any): Promise<void> {
        try {
            const pushKey = await Push.getPushKey();
            
            if (pushKey.result) {
                // 서버에 푸시 키 등록
                await requestTr({
                    trcode: 'PUSH_REGISTER',
                    body: {
                        userId: userData.userId,
                        pushKey: pushKey.key,
                        deviceInfo: await this.getDeviceInfo()
                    }
                });
            }
        } catch (error) {
            console.warn('푸시 알림 등록 실패:', error);
        }
    }
    
    // 백그라운드 데이터 동기화 시작
    private startBackgroundSync(): void {
        // 주기적 데이터 동기화 로직
        setInterval(async () => {
            try {
                await this.syncBackgroundData();
            } catch (error) {
                console.warn('백그라운드 동기화 실패:', error);
            }
        }, 5 * 60 * 1000); // 5분마다 동기화
    }
    
    // 백그라운드 데이터 동기화
    private async syncBackgroundData(): Promise<void> {
        // 필요한 데이터 동기화 로직 구현
    }
    
    // 사용자 데이터 정리
    private async clearUserData(): Promise<void> {
        const userStore = new StoreService('user');
        await userStore.dispatch('clearUser');
        
        // 기타 관련 데이터 정리
        await Properties.remove({ _sKey: 'remembered_user' });
        await Storage.remove({ _sKey: 'user_preferences' });
    }
}
```

### 2. 완전한 API 호출 래퍼

#### 통합 API 클라이언트
```typescript
// services/ApiClient.ts
import { NetworkInterceptor } from '@/interceptors/networkInterceptor';
import { useErrorHandler } from '@/composables/useErrorHandler';
import { TestEnvironment } from '@/config/testEnvironment';

export class ApiClient {
    private static instance: ApiClient;
    private interceptor: NetworkInterceptor;
    private testEnv: TestEnvironment;
    
    constructor() {
        this.interceptor = NetworkInterceptor.getInstance();
        this.testEnv = TestEnvironment.getInstance();
    }
    
    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }
    
    // 통합 API 호출 메서드
    async callApi<T = any>(options: {
        trcode: string;
        body?: any;
        header?: any;
        httpHeader?: any;
        timeout?: number;
        isMock?: boolean;
        isLoading?: boolean;
        isErrorAlert?: boolean;
        retryOptions?: {
            maxRetries: number;
            retryDelay?: number;
        };
    }): Promise<{
        success: boolean;
        data?: T;
        error?: any;
        response?: any;
    }> {
        const { handleError } = useErrorHandler();
        
        try {
            // 1. 요청 전 처리 (인터셉터)
            const processedOptions = await this.interceptor.beforeRequest({
                ...options,
                retryCount: 0
            });
            
            // 2. Mock 환경 확인
            if (options.isMock && this.testEnv.getMockResponse(options.trcode)) {
                const mockResponse = this.testEnv.getMockResponse(options.trcode);
                return {
                    success: mockResponse.header.result,
                    data: mockResponse.body,
                    response: mockResponse
                };
            }
            
            // 3. 실제 API 호출
            const response = await this.executeNetworkCall(processedOptions);
            
            // 4. 응답 후 처리 (인터셉터)
            const processedResponse = await this.interceptor.afterResponse(
                response, 
                processedOptions
            );
            
            // 5. 응답 검증 및 반환
            if (processedResponse.header?.result) {
                return {
                    success: true,
                    data: processedResponse.body,
                    response: processedResponse
                };
            } else {
                // 비즈니스 에러 처리
                const shouldRetry = await handleError(processedResponse);
                
                if (shouldRetry && options.retryOptions && processedOptions.retryCount < options.retryOptions.maxRetries) {
                    // 재시도
                    await this.delay(options.retryOptions.retryDelay || 1000);
                    
                    return await this.callApi({
                        ...options,
                        retryOptions: {
                            ...options.retryOptions,
                            maxRetries: options.retryOptions.maxRetries - 1
                        }
                    });
                }
                
                return {
                    success: false,
                    error: processedResponse.header?.error_text || '알 수 없는 오류',
                    response: processedResponse
                };
            }
            
        } catch (error) {
            await handleError(error, { trcode: options.trcode });
            return {
                success: false,
                error: error.message || '네트워크 오류가 발생했습니다.'
            };
        }
    }
    
    // 실제 네트워크 호출
    private async executeNetworkCall(options: any): Promise<any> {
        const { useNetwork } = await import('@/shared');
        const { requestTr } = useNetwork();
        
        return await requestTr({
            trcode: options.trcode,
            body: options.body,
            header: options.header,
            httpHeader: options.httpHeader,
            timeout: options.timeout,
            isMock: options.isMock,
            isLoading: options.isLoading,
            isErrorAlert: options.isErrorAlert
        });
    }
    
    // 지연 함수
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 편의 메서드들
    async get<T = any>(trcode: string, params?: any, options?: any): Promise<T> {
        const result = await this.callApi<T>({
            trcode,
            body: params,
            ...options
        });
        
        if (result.success) {
            return result.data!;
        }
        
        throw new Error(result.error);
    }
    
    async post<T = any>(trcode: string, data?: any, options?: any): Promise<T> {
        const result = await this.callApi<T>({
            trcode,
            body: data,
            ...options
        });
        
        if (result.success) {
            return result.data!;
        }
        
        throw new Error(result.error);
    }
    
    // 일괄 API 호출
    async batchCall(requests: Array<{
        trcode: string;
        body?: any;
        [key: string]: any;
    }>): Promise<any[]> {
        const promises = requests.map(request => this.callApi(request));
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return {
                    success: false,
                    error: result.reason,
                    trcode: requests[index].trcode
                };
            }
        });
    }
}
```

## 🛠️ 고급 활용 패턴

### 2. 에러 처리 패턴

#### 통합 에러 처리
```typescript
// useNetwork.ts에서 중앙 집중식 에러 처리
const handleError = (errorCode: string) => {
    switch (errorCode) {
        case 'ERR000':
            // 세션 만료 - 로그인 화면으로 이동
            App.exit({ _sType: 'logout' });
            break;
        case 'NE0001':
        case 'HE0404':
            // 네트워크 오류 - 재시도 안내
            alert('서버에 연결할 수 없습니다.');
            break;
        case 'DM000100501':
            // 로그인 실패
            alert('아이디 또는 비밀번호를 확인해주세요.');
            break;
    }
};
```

#### 컴포넌트별 에러 처리
```vue
<script setup lang="ts">
// 로그인 페이지에서 특정 에러 처리
const isLogin = (header: Json): boolean => {
    if (header.error_code === 'DM000100501') {
        alert(header.error_text);
        return false;
    }
    return true;
};
</script>
```

### 3. 상태 관리 패턴

#### StoreService 활용
```typescript
// 스토어 서비스 래퍼 활용
const loginStore = new StoreService('login');
const userStore = new StoreService('user');

// 로그인 정보 저장
const setUser = (body: Json): void => {
    loginStore.dispatch('setLoginToken', 'TEST_TOKEN_01');
    userStore.dispatch('setUser', body);
};

// 로그인 정보 초기화
const clearUser = (): void => {
    loginStore.dispatch('setLoginToken', '');
    userStore.dispatch('setUser', null);
};
```

### 4. 컴포넌트 재사용 패턴

#### Composable 함수 활용
```typescript
// useBoard.ts - 게시판 공통 로직
export function useBoard() {
    const searchKeyword = ref<string>('');
    const list = ref<Json[]>([]);
    const pageIndex = ref<number>(1);
    
    const search = async (keyword: string) => {
        searchKeyword.value = keyword;
        list.value = await fetchPosts(1, { keyword });
    };
    
    const loadMore = async () => {
        const nextPage = pageIndex.value + 1;
        const newPosts = await fetchPosts(nextPage);
        list.value.push(...newPosts);
        pageIndex.value = nextPage;
    };
    
    return {
        searchKeyword,
        list,
        search,
        loadMore
    };
}
```

## 📱 네이티브 기능 활용 예제

### 1. 파일 처리
```typescript
import File from '@/bizMOB/Xross/File';
import System from '@/bizMOB/Xross/System';

// 이미지 선택 후 업로드
const uploadImage = async () => {
    try {
        // 갤러리에서 이미지 선택
        const galleryResult = await System.callGallery({
            _nMaxCount: 1,
            _sDirectory: '/temp/'
        });
        
        if (galleryResult.result) {
            const selectedFile = galleryResult.body[0];
            
            // 이미지 리사이즈
            await File.resizeImage({
                _aFileList: [{ _sSourcePath: selectedFile.filePath }],
                _bIsCopy: true,
                _sTargetDirectory: '/temp/resized/',
                _nCompressRate: 80,
                _nWidth: 800,
                _nHeight: 600
            });
            
            // 파일 업로드
            const uploadResult = await File.upload({
                _aFileList: [{
                    _sSourcePath: '/temp/resized/' + selectedFile.fileName,
                    _sFileName: `upload_${Date.now()}.jpg`
                }]
            });
            
            return uploadResult;
        }
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
    }
};
```

### 2. 푸시 알림 처리
```typescript
import Push from '@/bizMOB/Xross/Push';

// 푸시 알림 설정
const setupPush = async () => {
    try {
        // 서버 등록
        await Push.registerToServer({
            _sServerUrl: process.env.VUE_APP_PUSH_SERVER,
            _sAppId: process.env.VUE_APP_ID
        });
        
        // 푸시 키 조회
        const pushKey = await Push.getPushKey();
        console.log('Push Key:', pushKey);
        
        // 알람 설정
        await Push.setAlarm({
            _sAlarmId: 'daily_reminder',
            _sTitle: '일일 리마인더',
            _sMessage: '오늘의 할일을 확인하세요.',
            _dAlarmTime: new Date().getTime() + 86400000 // 24시간 후
        });
        
    } catch (error) {
        console.error('푸시 설정 실패:', error);
    }
};
```

### 3. 디바이스 정보 활용
```typescript
import Device from '@/bizMOB/Xross/Device';

// 플랫폼별 분기 처리
const handlePlatformSpecific = () => {
    if (Device.isApp()) {
        // 네이티브 앱 환경
        if (Device.isAndroid()) {
            console.log('Android 앱에서 실행 중');
        } else if (Device.isIOS()) {
            console.log('iOS 앱에서 실행 중');
        }
    } else if (Device.isWeb()) {
        // 웹 브라우저 환경
        console.log('웹 브라우저에서 실행 중');
    }
    
    // 디바이스 타입 확인
    if (Device.isMobile()) {
        if (Device.isTablet()) {
            console.log('태블릿 디바이스');
        } else {
            console.log('모바일 폰');
        }
    }
};
```

## 🎯 Best Practices

### 1. 코드 구조화
```typescript
// 컴포넌트 내 구조화 예시
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue';
import { useNetwork, useMessage, useNavigate } from '@/shared';

// 2. Composables
const { requestTr } = useNetwork();
const { alert } = useMessage();
const { openPage } = useNavigate();

// 3. Reactive State
const isLoading = ref<boolean>(false);
const data = ref<Json[]>([]);

// 4. Computed Properties
const filteredData = computed(() => {
    return data.value.filter(item => item.active);
});

// 5. Methods
const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await requestTr({
            trcode: 'DM0001',
            body: {}
        });
        data.value = response.body;
    } finally {
        isLoading.value = false;
    }
};

// 6. Lifecycle
onMounted(() => {
    fetchData();
});
</script>
```

### 2. 타입 안정성
```typescript
// 타입 정의
interface LoginPayload {
    userId: string;
    password: string;
}

interface ApiResponse<T = any> {
    result: boolean;
    header: {
        error_code?: string;
        error_text?: string;
    };
    body: T;
}

// 타입 안전한 API 호출
const login = async (payload: LoginPayload): Promise<ApiResponse> => {
    return await requestTr({
        trcode: 'DM0001',
        body: payload
    });
};
```

### 3. 에러 핸들링
```typescript
// try-catch를 활용한 에러 처리
const safeApiCall = async () => {
    try {
        const response = await requestTr({
            trcode: 'DM0001',
            isErrorAlert: false  // 자동 에러 알림 비활성화
        });
        
        if (!response.result) {
            // 커스텀 에러 처리
            handleCustomError(response.header.error_code);
            return;
        }
        
        // 성공 처리
        processSuccess(response.body);
        
    } catch (error) {
        console.error('API 호출 실패:', error);
        alert('일시적인 오류가 발생했습니다.');
    }
};
```

### 4. 메모리 관리
```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

// 타이머나 구독 정리
const timer = ref<number | null>(null);

onMounted(() => {
    timer.value = setInterval(() => {
        // 주기적 작업
    }, 5000);
});

onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value);
    }
});
</script>
```

## 🔍 디버깅 및 로깅

### 1. bizMOB 로거 활용
```typescript
import Logger from '@/bizMOB/Xross/Logger';

// 로그 레벨별 사용
Logger.info('애플리케이션 시작');
Logger.debug('디버그 정보:', { userId: 'test' });
Logger.warn('경고 메시지');
Logger.error('에러 발생:', error);
```

### 2. 개발 환경별 로깅
```typescript
// 환경별 로깅 설정
const isDev = process.env.NODE_ENV === 'development';

const log = (message: string, data?: any) => {
    if (isDev) {
        console.log(`[${new Date().toISOString()}] ${message}`, data);
        Logger.debug(message, data);
    }
};
```

## 📦 배포 및 빌드 고려사항

### 1. Mock 데이터 처리
```typescript
// 빌드 환경에서 Mock 비활성화
const useMock = process.env.NODE_ENV === 'development' && 
                process.env.VUE_APP_MOCK === 'true';

const response = await requestTr({
    trcode: 'DM0001',
    isMock: useMock,  // 운영 환경에서는 자동으로 false
    body: payload
});
```

### 2. 환경별 설정
```typescript
// 환경별 API 서버 설정
const API_CONFIG = {
    development: {
        baseUrl: 'https://dev-api.example.com',
        timeout: 30000,
        useMock: true
    },
    production: {
        baseUrl: 'https://api.example.com',
        timeout: 10000,
        useMock: false
    }
};
```

이 가이드는 실제 프로덕션 환경에서 bizMOB Client를 효과적으로 활용하기 위한 실무 중심의 패턴과 예제를 제공합니다. 각 예제는 실제 `src/views` 하위의 코드를 기반으로 하여 즉시 적용 가능한 실용적인 내용으로 구성되어 있습니다.