# bizMOB4Vue-SI 라이브 코딩 태스크 샘플

라이브 코딩 세션이나 개발자 온보딩을 위한 단계별 실습 태스크 모음입니다.

## 📋 목차

- [초급 태스크 (1-2시간)](#-초급-태스크-1-2시간)
- [중급 태스크 (2-4시간)](#-중급-태스크-2-4시간)  
- [고급 태스크 (4-8시간)](#-고급-태스크-4-8시간)
- [팀 프로젝트 태스크 (1-2일)](#-팀-프로젝트-태스크-1-2일)
- [평가 기준](#-평가-기준)
- [보너스 챌린지](#-보너스-챌린지)

## 🌱 초급 태스크 (1-2시간)

### Task 1: 간단한 정보 표시 페이지 만들기

#### 목표
사용자 프로필 정보를 표시하는 간단한 페이지를 구현합니다.

#### 요구사항
1. **새 페이지 생성**: `PROFILE/PROFILE0100.vue`
2. **라우팅 설정**: `/profile` 경로 연결
3. **사용자 정보 표시**:
   - 프로필 이미지 (기본 아바타 사용)
   - 이름, 이메일, 전화번호
   - 가입일
4. **스타일링**: 깔끔한 카드 형태로 정보 표시

#### 시작 코드

```vue
<template>
  <ion-page>
    <ion-header>
      <AppHeader title="프로필" :left-buttons="['back']" />
    </ion-header>

    <ion-content>
      <div class="content">
        <!-- TODO: 사용자 프로필 정보 구현 -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// TODO: 필요한 import와 데이터 정의
</script>

<style scoped lang="scss">
// TODO: 스타일링 구현
</style>
```

#### 예상 결과

```vue
<template>
  <ion-page>
    <ion-header>
      <AppHeader title="프로필" :left-buttons="['back']" />
    </ion-header>

    <ion-content>
      <div class="content">
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="userInfo.avatar || '/images/default-avatar.png'" :alt="userInfo.name" />
          </div>
          
          <div class="profile-info">
            <h2 class="profile-name">{{ userInfo.name }}</h2>
            <div class="profile-details">
              <div class="detail-item">
                <ion-icon :icon="mail" class="detail-icon"></ion-icon>
                <span>{{ userInfo.email }}</span>
              </div>
              <div class="detail-item">
                <ion-icon :icon="call" class="detail-icon"></ion-icon>
                <span>{{ userInfo.phone }}</span>
              </div>
              <div class="detail-item">
                <ion-icon :icon="calendar" class="detail-icon"></ion-icon>
                <span>가입일: {{ formatDate(userInfo.joinDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mail, call, calendar } from 'ionicons/icons';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  avatar?: string;
}

const userInfo = ref<UserInfo>({
  name: '홍길동',
  email: 'hong@example.com',
  phone: '010-1234-5678',
  joinDate: '2024-01-15'
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};
</script>

<style scoped lang="scss">
.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .profile-avatar {
    margin-bottom: 16px;
    
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .profile-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--color-gray-900);
  }
  
  .profile-details {
    text-align: left;
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      .detail-icon {
        width: 20px;
        margin-right: 12px;
        color: var(--ion-color-primary);
      }
      
      span {
        font-size: 14px;
        color: var(--color-gray-800);
      }
    }
  }
}
</style>
```

### Task 2: 간단한 폼 유효성 검사

#### 목표
사용자 입력을 검증하는 폼 컴포넌트를 구현합니다.

#### 요구사항
1. **입력 필드**: 이름, 이메일, 비밀번호, 비밀번호 확인
2. **유효성 검사**:
   - 이름: 2자 이상
   - 이메일: 유효한 이메일 형식
   - 비밀번호: 8자 이상, 영문/숫자 포함
   - 비밀번호 확인: 비밀번호와 일치
3. **실시간 검증**: 입력 중 즉시 에러 표시
4. **제출 버튼**: 모든 검증 통과시에만 활성화

#### 시작 코드

```vue
<template>
  <ion-page>
    <ion-header>
      <AppHeader title="회원가입" :left-buttons="['back']" />
    </ion-header>

    <ion-content>
      <div class="content">
        <form @submit.prevent="handleSubmit">
          <!-- TODO: 폼 필드와 유효성 검사 구현 -->
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// TODO: 폼 상태와 유효성 검사 로직 구현
</script>
```

### Task 3: 동적 리스트와 검색 기능

#### 목표
검색 가능한 동적 리스트 컴포넌트를 구현합니다.

#### 요구사항
1. **Mock 데이터**: 연락처 목록 (이름, 전화번호, 이메일)
2. **검색 기능**: 이름 또는 전화번호로 필터링
3. **실시간 검색**: 입력 시 즉시 필터링
4. **빈 상태**: 검색 결과가 없을 때 안내 메시지
5. **리스트 아이템**: 클릭 시 상세 페이지로 이동

## 🔥 중급 태스크 (2-4시간)

### Task 4: 커스텀 컴포넌트 개발

#### 목표
재사용 가능한 데이터 테이블 컴포넌트를 개발합니다.

#### 요구사항
1. **Props 인터페이스**: 컬럼 정의, 데이터, 정렬 옵션
2. **기능**:
   - 정렬 (오름차순/내림차순)
   - 페이징 (페이지당 항목 수 설정 가능)
   - 로딩 상태 표시
   - 빈 데이터 상태 처리
3. **TypeScript**: 제네릭을 활용한 타입 안전성
4. **스타일링**: 반응형 테이블 레이아웃

#### 컴포넌트 인터페이스

```typescript
interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: T) => string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
}
```

#### 시작 코드

```vue
<!-- src/components/DataTable.vue -->
<template>
  <div class="data-table">
    <!-- TODO: 테이블 구현 -->
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// TODO: 제네릭 타입과 Props 정의
// TODO: 정렬, 페이징 로직 구현
</script>
```

### Task 5: API 통합과 상태 관리

#### 목표
실제 API 연동과 Vuex를 활용한 상태 관리를 구현합니다.

#### 요구사항
1. **API 서비스**: RESTful API 호출 (Mock 서버 사용)
2. **Vuex 모듈**: 게시글 관리 (목록, 상세, 생성, 수정, 삭제)
3. **에러 처리**: 네트워크 에러, 서버 에러 처리
4. **로딩 상태**: API 호출 중 로딩 표시
5. **캐싱**: 중복 요청 방지

#### API 명세

```typescript
// GET /api/posts - 게시글 목록
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

// POST /api/posts - 게시글 생성
interface CreatePostRequest {
  title: string;
  content: string;
}

// PUT /api/posts/:id - 게시글 수정
interface UpdatePostRequest {
  title?: string;
  content?: string;
}
```

#### Vuex 모듈 구조

```typescript
// src/store/modules/posts.ts
export default {
  namespaced: true,
  
  state: {
    posts: [] as Post[],
    currentPost: null as Post | null,
    loading: false,
    error: null as string | null
  },
  
  getters: {
    // TODO: 게터 구현
  },
  
  mutations: {
    // TODO: 뮤테이션 구현
  },
  
  actions: {
    // TODO: 액션 구현 (API 호출)
  }
};
```

### Task 6: 무한 스크롤과 Pull-to-Refresh

#### 목표
무한 스크롤과 새로고침 기능이 있는 피드를 구현합니다.

#### 요구사항
1. **무한 스크롤**: 스크롤 끝에 도달하면 다음 페이지 로드
2. **Pull-to-Refresh**: 위로 당겨서 새로고침
3. **성능 최적화**: 가상 스크롤링 또는 항목 재사용
4. **로딩 상태**: 각 상황별 적절한 로딩 인디케이터
5. **에러 처리**: 네트워크 실패 시 재시도 버튼

## 🚀 고급 태스크 (4-8시간)

### Task 7: 복합 대시보드 구현

#### 목표
실시간 데이터를 표시하는 대시보드를 구현합니다.

#### 요구사항
1. **차트 컴포넌트**: Chart.js 또는 D3.js 활용
2. **실시간 업데이트**: WebSocket 또는 Server-Sent Events
3. **필터링**: 날짜 범위, 카테고리별 필터
4. **반응형 그리드**: 화면 크기에 따른 레이아웃 조정
5. **데이터 내보내기**: CSV, Excel 형태로 데이터 내보내기

#### 컴포넌트 구조

```
DashboardPage/
├── DashboardHeader.vue      # 제목, 필터, 새로고침 버튼
├── MetricsGrid.vue          # KPI 메트릭 카드들
├── ChartContainer.vue       # 차트 래퍼 컴포넌트
│   ├── LineChart.vue        # 시계열 차트
│   ├── BarChart.vue         # 막대 차트
│   └── PieChart.vue         # 원형 차트
├── DataTable.vue            # 상세 데이터 테이블
└── ExportModal.vue          # 내보내기 모달
```

### Task 8: 고급 폼 빌더

#### 목표
동적으로 폼을 생성하고 검증하는 폼 빌더를 구현합니다.

#### 요구사항
1. **동적 폼 생성**: JSON 스키마를 기반으로 폼 생성
2. **다양한 입력 타입**: 텍스트, 숫자, 날짜, 선택, 파일 등
3. **조건부 필드**: 특정 조건에 따라 필드 표시/숨김
4. **커스텀 검증**: 복잡한 비즈니스 룰 검증
5. **폼 상태 관리**: 저장, 불러오기, 초기화

#### 폼 스키마 예시

```typescript
interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
  validation?: ValidationRule[];
}

interface FormField {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[]; // select 타입일 때
  validation?: FieldValidation;
  conditional?: ConditionalRule;
}

interface ConditionalRule {
  dependsOn: string; // 다른 필드 ID
  condition: 'equals' | 'not_equals' | 'contains';
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable';
}
```

### Task 9: 파일 업로드와 미디어 관리

#### 목표
파일 업로드, 이미지 편집, 미디어 갤러리 기능을 구현합니다.

#### 요구사항
1. **다중 파일 업로드**: 드래그앤드롭, 진행률 표시
2. **이미지 편집**: 크롭, 회전, 필터 적용
3. **미디어 갤러리**: 그리드/리스트 뷰, 정렬, 검색
4. **미리보기**: 이미지, PDF, 비디오 미리보기
5. **저장소 통합**: 로컬 저장소 또는 클라우드 저장소

## 👥 팀 프로젝트 태스크 (1-2일)

### Project 1: 소셜 미디어 피드

#### 목표
Instagram 스타일의 소셜 미디어 피드 앱을 구현합니다.

#### 팀 구성 (3-4명)
- **Frontend Lead**: 전체 아키텍처, 컴포넌트 설계
- **UI/UX Developer**: 스타일링, 애니메이션, 반응형
- **API Developer**: 서비스 레이어, 상태 관리
- **QA/Test**: 테스트 작성, 버그 수정

#### 주요 기능
1. **피드**: 무한 스크롤, 좋아요, 댓글
2. **포스트 작성**: 이미지 업로드, 해시태그
3. **프로필**: 사용자 프로필, 팔로우/언팔로우
4. **검색**: 해시태그, 사용자 검색
5. **실시간**: 새 포스트 알림

#### 기술 스택
- Vue 3 + Composition API
- Vuex 4 + Persist
- Socket.io (실시간 기능)
- Express.js (Mock API 서버)

### Project 2: 프로젝트 관리 도구

#### 목표
Trello 스타일의 칸반 보드 프로젝트 관리 도구를 구현합니다.

#### 주요 기능
1. **칸반 보드**: 드래그앤드롭으로 카드 이동
2. **카드 관리**: 할 일, 담당자, 마감일, 첨부파일
3. **팀 협업**: 멤버 초대, 권한 관리
4. **알림**: 할 일 마감일, 멘션 알림
5. **리포팅**: 진행률, 성과 차트

## 📊 평가 기준

### 코드 품질 (30점)
- [ ] **TypeScript 활용**: 적절한 타입 정의와 활용
- [ ] **컴포넌트 설계**: 재사용성과 관심사 분리
- [ ] **코딩 컨벤션**: ESLint 규칙 준수
- [ ] **주석과 문서**: 복잡한 로직에 대한 설명

### 기능 구현 (25점)  
- [ ] **요구사항 충족**: 명시된 기능 모두 구현
- [ ] **에러 처리**: 적절한 예외 상황 처리
- [ ] **사용자 경험**: 직관적이고 부드러운 UX
- [ ] **성능**: 불필요한 리렌더링 방지, 최적화

### UI/UX 디자인 (20점)
- [ ] **시각적 일관성**: 디자인 시스템 준수
- [ ] **반응형**: 다양한 화면 크기 대응
- [ ] **접근성**: 키보드 네비게이션, 스크린 리더 지원
- [ ] **애니메이션**: 적절한 피드백과 트랜지션

### 아키텍처 (15점)
- [ ] **상태 관리**: Vuex 적절한 활용
- [ ] **API 설계**: 서비스 레이어 분리
- [ ] **라우팅**: 적절한 네비게이션 구조
- [ ] **재사용성**: 공통 컴포넌트와 유틸리티

### 창의성 (10점)
- [ ] **혁신적 아이디어**: 독창적인 기능이나 접근법
- [ ] **추가 기능**: 요구사항 이상의 기능 구현
- [ ] **문제 해결**: 복잡한 문제에 대한 창의적 해결
- [ ] **사용자 중심**: 사용자 편의를 위한 세심한 배려

## 🎁 보너스 챌린지

### Challenge 1: 성능 최적화 마스터

#### 목표
앱의 성능을 극한으로 최적화하기

#### 요구사항
- Lighthouse 점수 95+ 달성
- 첫 페이지 로딩 시간 2초 이내
- 메모리 사용량 최소화
- 번들 사이즈 최적화

#### 기법
- 코드 스플리팅
- 트리 셰이킹  
- 이미지 최적화
- 서비스 워커 활용

### Challenge 2: 접근성 챔피언

#### 목표  
완벽한 웹 접근성 구현

#### 요구사항
- WCAG 2.1 AA 준수
- 스크린 리더 완벽 지원
- 키보드만으로 모든 기능 사용 가능
- 색상 대비율 4.5:1 이상

### Challenge 3: 국제화 전문가

#### 목표
다국어 지원 앱 구현

#### 요구사항
- 5개 언어 이상 지원
- RTL (Right-to-Left) 언어 지원
- 날짜/숫자 현지화
- 동적 언어 전환

### Challenge 4: PWA 마스터

#### 목표
완전한 PWA 앱 구현

#### 요구사항
- 서비스 워커 구현
- 오프라인 모드 지원
- 푸시 알림
- 홈 화면에 추가
- 백그라운드 동기화

---

## 💡 실습 가이드

### 시작하기 전에
1. **환경 설정** 확인 - Node.js, npm, Vue CLI
2. **베이스 프로젝트** 클론 및 의존성 설치
3. **개발 서버** 실행 (`npm run serve-sit`)
4. **브랜치 생성** - 각 태스크별로 새 브랜치

### 실습 중 
1. **커밋 자주하기** - 기능 단위로 의미있는 커밋
2. **코드 리뷰** - 동료와 상호 리뷰
3. **테스트 작성** - 주요 기능에 대한 단위 테스트
4. **문서 업데이트** - README나 주석 업데이트

### 완료 후
1. **데모 준비** - 구현한 기능 시연
2. **코드 정리** - 불필요한 코드 제거, 리팩토링
3. **PR 생성** - 상세한 설명과 스크린샷 포함
4. **회고** - 학습한 점, 개선할 점 정리

이 태스크들을 통해 bizMOB4Vue-SI 플랫폼의 핵심 기능들을 실습하고, 실무에서 활용할 수 있는 실전 경험을 쌓을 수 있습니다.