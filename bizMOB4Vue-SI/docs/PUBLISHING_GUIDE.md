# bizMOB4Vue-SI 퍼블리싱 가이드

Vue 3 + Ionic 기반 하이브리드 모바일 애플리케이션의 마크업 및 퍼블리싱 표준 가이드입니다.

## 📋 목차

- [퍼블리싱 기본 원칙](#-퍼블리싱-기본-원칙)
- [HTML 마크업 가이드](#-html-마크업-가이드)
- [CSS/SCSS 작성 가이드](#-cssscss-작성-가이드)
- [Ionic 컴포넌트 활용](#-ionic-컴포넌트-활용)
- [반응형 레이아웃](#-반응형-레이아웃)
- [접근성 가이드라인](#-접근성-가이드라인)
- [성능 최적화](#-성능-최적화)
- [브라우저 호환성](#-브라우저-호환성)
- [퍼블리싱 체크리스트](#-퍼블리싱-체크리스트)

## 🎯 퍼블리싱 기본 원칙

### 핵심 원칙

1. **시맨틱 마크업**
   - 의미에 맞는 HTML 태그 사용
   - 논리적인 문서 구조 유지
   - 스크린 리더 친화적 구조

2. **모바일 우선 설계**
   - Mobile First 접근 방식
   - 터치 친화적 UI 구성
   - 최소 터치 영역 44px × 44px 준수

3. **성능 최적화**
   - 최소한의 DOM 구조
   - 효율적인 CSS 선택자 사용
   - 불필요한 리플로우 방지

4. **일관성 유지**
   - 통일된 클래스 명명 규칙
   - 컴포넌트 재사용성 극대화
   - 디자인 시스템 준수

## 📄 HTML 마크업 가이드

### Vue 템플릿 구조

```vue
<template>
  <!-- 페이지 루트 컨테이너 -->
  <ion-page>
    <!-- 헤더 영역 -->
    <ion-header>
      <AppHeader
        title="페이지 제목"
        :left-buttons="['back']"
        :right-buttons="['menu']"
      />
    </ion-header>

    <!-- 메인 콘텐츠 영역 -->
    <ion-content>
      <!-- 스크롤 가능한 콘텐츠 컨테이너 -->
      <div class="content">
        <!-- 섹션별 콘텐츠 -->
        <section class="section-intro">
          <h1 class="section-title">섹션 제목</h1>
          <p class="section-description">섹션 설명</p>
        </section>
        
        <!-- 폼 영역 -->
        <form class="form-container" @submit.prevent="handleSubmit">
          <fieldset class="form-fieldset">
            <legend class="sr-only">사용자 정보 입력</legend>
            
            <div class="form-field">
              <label for="username" class="form-label">사용자명</label>
              <div class="form-input">
                <AppInput
                  id="username"
                  type="text"
                  placeholder="사용자명을 입력하세요"
                  v-model="form.username"
                  :required="true"
                  aria-describedby="username-help"
                />
                <div id="username-help" class="form-help">
                  2자 이상 입력해주세요
                </div>
              </div>
            </div>
          </fieldset>
        </form>
        
        <!-- 리스트 영역 -->
        <section class="list-section">
          <h2 class="list-title">항목 목록</h2>
          <ul class="list-container">
            <li
              v-for="item in items"
              :key="item.id"
              class="list-item"
            >
              <article class="item-content">
                <header class="item-header">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <time class="item-date" :datetime="item.date">
                    {{ formatDate(item.date) }}
                  </time>
                </header>
                <p class="item-description">{{ item.description }}</p>
              </article>
            </li>
          </ul>
        </section>
      </div>
    </ion-content>

    <!-- 푸터 영역 -->
    <ion-footer>
      <div class="footer-content">
        <div class="button-group">
          <button type="button" class="button button-line">취소</button>
          <button type="submit" class="button button-blue">확인</button>
        </div>
      </div>
    </ion-footer>
  </ion-page>
</template>
```

### 시맨틱 태그 사용법

```html
<!-- 올바른 시맨틱 구조 -->
<main class="main-content">
  <header class="page-header">
    <h1>페이지 제목</h1>
    <nav class="breadcrumb">
      <ol>
        <li><a href="/">홈</a></li>
        <li><a href="/board">게시판</a></li>
        <li aria-current="page">공지사항</li>
      </ol>
    </nav>
  </header>
  
  <section class="content-section">
    <h2>섹션 제목</h2>
    <article class="article-content">
      <header class="article-header">
        <h3>글 제목</h3>
        <div class="article-meta">
          <address class="author">작성자: 홍길동</address>
          <time datetime="2024-03-15">2024년 3월 15일</time>
        </div>
      </header>
      <div class="article-body">
        <p>본문 내용...</p>
      </div>
      <footer class="article-footer">
        <button type="button">좋아요</button>
        <button type="button">공유</button>
      </footer>
    </article>
  </section>
  
  <aside class="sidebar">
    <section class="related-articles">
      <h2>관련 글</h2>
      <ul>
        <li><a href="/article/1">관련 글 1</a></li>
        <li><a href="/article/2">관련 글 2</a></li>
      </ul>
    </section>
  </aside>
</main>
```

### 폼 마크업 패턴

```html
<form class="form-container" novalidate>
  <!-- 필수 필드 그룹 -->
  <fieldset class="form-fieldset">
    <legend class="form-legend">필수 정보</legend>
    
    <!-- 텍스트 입력 -->
    <div class="form-field">
      <label for="email" class="form-label">
        이메일 <span class="required" aria-label="필수">*</span>
      </label>
      <div class="form-input">
        <input
          id="email"
          type="email"
          class="input-field"
          placeholder="example@email.com"
          required
          aria-describedby="email-error email-help"
        />
        <div id="email-help" class="form-help">
          정확한 이메일 주소를 입력해주세요
        </div>
        <div id="email-error" class="form-error" role="alert" aria-live="polite">
          <!-- 에러 메시지가 여기에 동적으로 표시됩니다 -->
        </div>
      </div>
    </div>
    
    <!-- 선택 입력 -->
    <div class="form-field">
      <label for="category" class="form-label">카테고리</label>
      <div class="form-input">
        <select id="category" class="select-field">
          <option value="">선택해주세요</option>
          <option value="notice">공지사항</option>
          <option value="faq">자주묻는질문</option>
          <option value="inquiry">문의사항</option>
        </select>
      </div>
    </div>
    
    <!-- 라디오 버튼 그룹 -->
    <div class="form-field">
      <fieldset class="radio-group">
        <legend class="radio-legend">알림 설정</legend>
        <div class="radio-options">
          <div class="radio-option">
            <input
              id="notify-yes"
              type="radio"
              name="notification"
              value="yes"
            />
            <label for="notify-yes" class="radio-label">
              <span class="radio-text">알림 받기</span>
            </label>
          </div>
          <div class="radio-option">
            <input
              id="notify-no"
              type="radio"
              name="notification"
              value="no"
            />
            <label for="notify-no" class="radio-label">
              <span class="radio-text">알림 받지 않기</span>
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  </fieldset>
  
  <!-- 제출 버튼 -->
  <div class="form-actions">
    <button type="reset" class="button button-line">초기화</button>
    <button type="submit" class="button button-blue">제출</button>
  </div>
</form>
```

## 🎨 CSS/SCSS 작성 가이드

### CSS 아키텍처 (ITCSS + BEM)

```scss
// 1. Settings - 전역 변수, 함수, 믹스인
:root {
  --color-primary: #2f4592;
  --spacing-base: 16px;
  --font-size-base: 14px;
}

// 2. Tools - 유틸리티 믹스인, 함수
@mixin media-md {
  @media (min-width: 768px) { @content; }
}

@function rem($px) {
  @return #{$px / 16}rem;
}

// 3. Generic - 리셋, normalize
* {
  box-sizing: border-box;
}

// 4. Elements - HTML 요소 기본 스타일
body {
  font-family: "Noto Sans", sans-serif;
  font-size: var(--font-size-base);
  line-height: 1.4;
  color: var(--color-text-primary);
}

// 5. Objects - 레이아웃 관련 클래스
.o-container {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 var(--spacing-base);
}

.o-grid {
  display: grid;
  gap: var(--spacing-base);
}

// 6. Components - UI 컴포넌트
.c-button {
  // Block
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  // Element
  &__icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  
  &__text {
    flex: 1;
  }
  
  // Modifier
  &--primary {
    background-color: var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
  
  &--outline {
    background-color: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    
    &:hover {
      background-color: var(--color-primary-light);
    }
  }
  
  &--large {
    padding: 16px 24px;
    font-size: 16px;
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

// 7. Utilities - 헬퍼 클래스
.u-text-center { text-align: center; }
.u-mb-16 { margin-bottom: 16px; }
.u-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### SCSS 믹스인 활용

```scss
// 반응형 타이포그래피 믹스인
@mixin fluid-typography($min-size, $max-size, $min-width: 320px, $max-width: 768px) {
  font-size: #{$min-size}px;
  
  @media (min-width: #{$min-width}px) {
    font-size: calc(#{$min-size}px + (#{$max-size} - #{$min-size}) * ((100vw - #{$min-width}px) / (#{$max-width} - #{$min-width})));
  }
  
  @media (min-width: #{$max-width}px) {
    font-size: #{$max-size}px;
  }
}

// 텍스트 오버플로우 믹스인
@mixin text-overflow($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 가상 요소 배경 이미지
@mixin pseudo-icon($url, $width: 24px, $height: 24px) {
  &::before {
    content: '';
    display: inline-block;
    width: $width;
    height: $height;
    background-image: url($url);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

// 사용 예시
.heading-responsive {
  @include fluid-typography(18, 24);
  @include text-overflow(2);
}

.icon-button {
  @include pseudo-icon('../images/ic_search.svg', 20px, 20px);
}
```

### CSS 커스텀 프로퍼티 활용

```scss
// 컴포넌트별 커스텀 프로퍼티
.c-card {
  // 기본값 설정
  --card-padding: 16px;
  --card-radius: 8px;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --card-bg: white;
  
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  background-color: var(--card-bg);
  
  // 변형 클래스에서 프로퍼티 오버라이드
  &--compact {
    --card-padding: 12px;
    --card-radius: 4px;
  }
  
  &--elevated {
    --card-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

// 테마별 프로퍼티 변경
[data-theme="dark"] {
  --card-bg: #2d2d2d;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

## 📱 Ionic 컴포넌트 활용

### 기본 레이아웃 구조

```vue
<template>
  <ion-page>
    <!-- 고정 헤더 -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        
        <ion-title>페이지 제목</ion-title>
        
        <ion-buttons slot="end">
          <ion-button @click="openMenu">
            <ion-icon :icon="menu"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- 스크롤 가능한 콘텐츠 -->
    <ion-content :fullscreen="true">
      <!-- 헤더 겹침 효과를 위한 헤더 -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">페이지 제목</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <!-- 새로고침 -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <!-- 메인 콘텐츠 -->
      <div class="content-container">
        <!-- 검색 바 -->
        <ion-searchbar
          placeholder="검색어를 입력하세요"
          debounce="300"
          @ionInput="handleSearch"
        ></ion-searchbar>
        
        <!-- 리스트 -->
        <ion-list>
          <ion-item
            v-for="item in filteredItems"
            :key="item.id"
            button
            @click="selectItem(item)"
          >
            <ion-avatar slot="start">
              <img :src="item.avatar" :alt="item.name" />
            </ion-avatar>
            
            <ion-label>
              <h2>{{ item.name }}</h2>
              <p>{{ item.description }}</p>
            </ion-label>
            
            <ion-note slot="end" color="medium">
              {{ formatDate(item.date) }}
            </ion-note>
            
            <ion-icon :icon="chevronForward" slot="end"></ion-icon>
          </ion-item>
        </ion-list>
        
        <!-- 무한 스크롤 -->
        <ion-infinite-scroll @ionInfinite="loadMore">
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="로딩 중..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    </ion-content>

    <!-- 플로팅 액션 버튼 -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="addItem">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!-- 고정 푸터 -->
    <ion-footer>
      <ion-toolbar>
        <ion-segment
          :value="selectedSegment"
          @ionChange="handleSegmentChange"
        >
          <ion-segment-button value="all">
            <ion-label>전체</ion-label>
          </ion-segment-button>
          <ion-segment-button value="favorites">
            <ion-label>즐겨찾기</ion-label>
          </ion-segment-button>
          <ion-segment-button value="recent">
            <ion-label>최근</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
```

### 폼 컴포넌트 활용

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- 입력 필드 그룹 -->
    <ion-item-group>
      <ion-item-divider>
        <ion-label>기본 정보</ion-label>
      </ion-item-divider>
      
      <!-- 텍스트 입력 -->
      <ion-item>
        <ion-label position="stacked">이름 *</ion-label>
        <ion-input
          type="text"
          placeholder="이름을 입력하세요"
          :value="form.name"
          @ion-input="form.name = $event.target.value"
          required
        ></ion-input>
      </ion-item>
      
      <!-- 이메일 입력 -->
      <ion-item>
        <ion-label position="stacked">이메일 *</ion-label>
        <ion-input
          type="email"
          placeholder="example@email.com"
          :value="form.email"
          @ion-input="form.email = $event.target.value"
          required
        ></ion-input>
      </ion-item>
      
      <!-- 선택 필드 -->
      <ion-item button @click="openCategorySelect">
        <ion-label position="stacked">카테고리</ion-label>
        <ion-label>{{ selectedCategory || '선택해주세요' }}</ion-label>
        <ion-icon :icon="chevronDown" slot="end"></ion-icon>
      </ion-item>
      
      <!-- 토글 스위치 -->
      <ion-item>
        <ion-label>알림 받기</ion-label>
        <ion-toggle
          :checked="form.notifications"
          @ion-change="form.notifications = $event.detail.checked"
          slot="end"
        ></ion-toggle>
      </ion-item>
      
      <!-- 날짜 선택 -->
      <ion-item button @click="openDatePicker">
        <ion-label position="stacked">생년월일</ion-label>
        <ion-label>{{ formattedDate || '날짜 선택' }}</ion-label>
        <ion-icon :icon="calendar" slot="end"></ion-icon>
      </ion-item>
    </ion-item-group>
    
    <!-- 텍스트 영역 -->
    <ion-item>
      <ion-label position="stacked">메모</ion-label>
      <ion-textarea
        placeholder="메모를 입력하세요"
        :value="form.memo"
        @ion-input="form.memo = $event.target.value"
        :rows="4"
      ></ion-textarea>
    </ion-item>
    
    <!-- 제출 버튼 -->
    <div class="form-actions">
      <ion-button
        expand="block"
        type="submit"
        :disabled="!isFormValid"
      >
        저장
      </ion-button>
    </div>
  </form>
  
  <!-- 액션 시트 (카테고리 선택) -->
  <ion-action-sheet
    :is-open="showCategorySelect"
    header="카테고리 선택"
    :buttons="categoryButtons"
    @didDismiss="showCategorySelect = false"
  >
  </ion-action-sheet>
  
  <!-- 날짜 선택 모달 -->
  <ion-modal :is-open="showDatePicker" @didDismiss="showDatePicker = false">
    <ion-datetime
      presentation="date"
      :value="form.birthDate"
      @ion-change="handleDateChange"
    >
    </ion-datetime>
  </ion-modal>
</template>
```

### 모달 및 팝오버 활용

```vue
<template>
  <!-- 모달 트리거 버튼 -->
  <ion-button @click="openModal">설정 열기</ion-button>
  
  <!-- 모달 컴포넌트 -->
  <ion-modal
    :is-open="isModalOpen"
    :can-dismiss="true"
    @didDismiss="closeModal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>설정</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>다크 모드</ion-label>
          <ion-toggle
            :checked="darkMode"
            @ion-change="toggleDarkMode"
            slot="end"
          ></ion-toggle>
        </ion-item>
        
        <ion-item>
          <ion-label>언어 설정</ion-label>
          <ion-select
            :value="selectedLanguage"
            @ion-change="changeLanguage"
            interface="popover"
          >
            <ion-select-option value="ko">한국어</ion-select-option>
            <ion-select-option value="en">English</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
  
  <!-- 팝오버 -->
  <ion-popover
    :is-open="isPopoverOpen"
    :event="popoverEvent"
    @didDismiss="closePopover"
  >
    <ion-content>
      <ion-list>
        <ion-item button @click="handleAction('edit')">
          <ion-icon :icon="create" slot="start"></ion-icon>
          <ion-label>수정</ion-label>
        </ion-item>
        <ion-item button @click="handleAction('delete')">
          <ion-icon :icon="trash" slot="start"></ion-icon>
          <ion-label>삭제</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>
```

## 📐 반응형 레이아웃

### 그리드 시스템 활용

```scss
// CSS Grid 기반 반응형 레이아웃
.responsive-grid {
  display: grid;
  gap: 16px;
  
  // 모바일 (1열)
  grid-template-columns: 1fr;
  
  // 태블릿 (2열)
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // 데스크탑 (3열)
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Flexbox 기반 카드 레이아웃
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  
  .card-item {
    // 모바일: 전체 너비
    flex: 1 1 100%;
    
    // 태블릿: 2열 (간격 고려)
    @media (min-width: 768px) {
      flex: 1 1 calc(50% - 8px);
    }
    
    // 데스크탑: 3열
    @media (min-width: 1024px) {
      flex: 1 1 calc(33.333% - 11px);
    }
  }
}
```

### 반응형 타이포그래피

```scss
// 반응형 폰트 크기
.responsive-heading {
  // 기본 크기 (모바일)
  font-size: 1.5rem;
  line-height: 1.2;
  
  // 태블릿
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  
  // 데스크탑
  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
}

// Clamp를 이용한 유동적 크기
.fluid-text {
  font-size: clamp(1rem, 4vw, 1.5rem);
}
```

### 컨테이너 쿼리 활용

```scss
// 컨테이너 쿼리 설정
.card-container {
  container-type: inline-size;
}

.card {
  padding: 16px;
  
  // 컨테이너 너비에 따른 스타일 변경
  @container (min-width: 300px) {
    padding: 24px;
    display: flex;
    align-items: center;
    
    .card-image {
      width: 100px;
      height: 100px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    
    .card-content {
      flex: 1;
    }
  }
}
```

## ♿ 접근성 가이드라인

### ARIA 활용

```vue
<template>
  <!-- 의미적 랜드마크 -->
  <main role="main" aria-labelledby="main-title">
    <h1 id="main-title">게시판</h1>
    
    <!-- 검색 영역 -->
    <section role="search" aria-labelledby="search-title">
      <h2 id="search-title" class="sr-only">게시글 검색</h2>
      <div class="search-container">
        <label for="search-input" class="sr-only">검색어 입력</label>
        <input
          id="search-input"
          type="search"
          placeholder="검색어를 입력하세요"
          aria-describedby="search-help"
          :aria-expanded="showSuggestions"
          :aria-owns="showSuggestions ? 'search-suggestions' : null"
          autocomplete="off"
        />
        <div id="search-help" class="sr-only">
          2자 이상 입력하시면 자동완성이 제공됩니다
        </div>
        
        <!-- 검색 제안 -->
        <ul
          v-if="showSuggestions"
          id="search-suggestions"
          role="listbox"
          aria-label="검색 제안"
        >
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            role="option"
            :aria-selected="selectedIndex === index"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion.text }}
          </li>
        </ul>
      </div>
    </section>
    
    <!-- 필터 영역 -->
    <section class="filter-section" aria-labelledby="filter-title">
      <h2 id="filter-title" class="sr-only">게시글 필터</h2>
      <div
        role="group"
        aria-labelledby="category-filter-title"
      >
        <h3 id="category-filter-title" class="filter-label">카테고리</h3>
        <div class="filter-options">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            :aria-pressed="selectedCategory === category.id"
            @click="selectCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- 게시글 목록 -->
    <section class="board-list" aria-labelledby="board-title">
      <h2 id="board-title" class="sr-only">게시글 목록</h2>
      <div
        class="list-status"
        aria-live="polite"
        aria-atomic="true"
      >
        총 {{ totalCount }}개의 게시글이 있습니다
      </div>
      
      <ul class="article-list" role="list">
        <li
          v-for="article in articles"
          :key="article.id"
          role="listitem"
        >
          <article class="article-item">
            <header class="article-header">
              <h3>
                <a
                  :href="`/board/${article.id}`"
                  :aria-describedby="`article-meta-${article.id}`"
                >
                  {{ article.title }}
                </a>
              </h3>
              <div
                :id="`article-meta-${article.id}`"
                class="article-meta"
              >
                <span class="author">{{ article.author }}</span>
                <time :datetime="article.createdAt">
                  {{ formatDate(article.createdAt) }}
                </time>
                <span class="view-count" aria-label="조회수">
                  {{ article.viewCount }}회
                </span>
              </div>
            </header>
            
            <div class="article-summary">
              {{ article.summary }}
            </div>
          </article>
        </li>
      </ul>
      
      <!-- 페이징 네비게이션 -->
      <nav class="pagination" aria-label="게시글 페이지 네비게이션">
        <button
          type="button"
          :disabled="currentPage === 1"
          :aria-label="`이전 페이지로 이동`"
          @click="goToPage(currentPage - 1)"
        >
          이전
        </button>
        
        <ol class="page-list">
          <li v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== currentPage"
              type="button"
              :aria-label="`${page}페이지로 이동`"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <span
              v-else
              :aria-current="page"
              :aria-label="`현재 페이지 ${page}`"
            >
              {{ page }}
            </span>
          </li>
        </ol>
        
        <button
          type="button"
          :disabled="currentPage === totalPages"
          :aria-label="`다음 페이지로 이동`"
          @click="goToPage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </section>
  </main>
</template>
```

### 키보드 네비게이션

```scss
// 포커스 스타일 통일
:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

// 스킵 링크
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--ion-color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}

// 키보드 네비게이션 가능한 요소
.keyboard-navigable {
  &:focus {
    background-color: var(--ion-color-primary-tint);
    outline: 2px solid var(--ion-color-primary);
  }
}
```

## ⚡ 성능 최적화

### CSS 최적화

```scss
// 효율적인 선택자 사용
// 좋은 예
.button { }
.button--primary { }
.nav-item { }

// 나쁜 예
div.container > ul li a { } // 너무 깊은 중첩
#header .nav .item a:hover { } // ID 선택자와 깊은 중첩

// GPU 가속 활용
.animated-element {
  transform: translateZ(0); // GPU 레이어 생성
  will-change: transform; // 애니메이션 최적화 힌트
}

// 리페인트/리플로우 최소화
.smooth-animation {
  // 레이아웃에 영향을 주지 않는 속성만 애니메이션
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  // 레이아웃 속성은 피하기
  // transition: width 0.3s ease; // 나쁜 예
}
```

### 이미지 최적화

```scss
// 반응형 이미지
.responsive-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

// 레이지 로딩 스타일
.lazy-image {
  background-color: var(--color-gray-100);
  
  &.loading {
    background-image: 
      linear-gradient(90deg, 
        var(--color-gray-100) 0%, 
        var(--color-gray-200) 50%, 
        var(--color-gray-100) 100%);
    background-size: 200px 100%;
    animation: loading-shimmer 1.5s infinite;
  }
}

@keyframes loading-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

### 폰트 로딩 최적화

```scss
// 폰트 로딩 최적화
@font-face {
  font-family: "Noto Sans";
  src: url("/fonts/NotoSans-Regular.woff2") format("woff2"),
       url("/fonts/NotoSans-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap; // FOUT 방식으로 빠른 텍스트 표시
}

// 시스템 폰트 폴백
body {
  font-family: "Noto Sans", 
               -apple-system,
               BlinkMacSystemFont,
               "Segoe UI",
               Roboto,
               "Helvetica Neue",
               Arial,
               sans-serif;
}
```

## 🌐 브라우저 호환성

### CSS 접두사 및 폴백

```scss
// Flexbox 호환성
.flex-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

// Grid 호환성
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  // IE 11 폴백
  @supports not (display: grid) {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
    
    > * {
      flex: 1 1 calc(33.333% - 16px);
      margin: 8px;
    }
  }
}

// CSS 커스텀 프로퍼티 폴백
.component {
  background-color: #2f4592; // 폴백 값
  background-color: var(--ion-color-primary, #2f4592);
}
```

### JavaScript 기능 감지

```typescript
// 터치 지원 감지
const hasTouch = 'ontouchstart' in window;

// CSS 기능 지원 감지
const supportsGrid = CSS.supports('display', 'grid');
const supportsCustomProperties = CSS.supports('color', 'var(--test)');

// IntersectionObserver 지원 감지
const hasIntersectionObserver = 'IntersectionObserver' in window;

// 조건부 클래스 적용
if (hasTouch) {
  document.body.classList.add('has-touch');
}

if (!supportsGrid) {
  document.body.classList.add('no-grid');
}
```

## ✅ 퍼블리싱 체크리스트

### HTML 검증
- [ ] **HTML5 DOCTYPE** 선언
- [ ] **lang 속성** 설정 (`<html lang="ko">`)
- [ ] **메타 태그** 설정 (charset, viewport, description)
- [ ] **시맨틱 태그** 적절한 사용
- [ ] **헤딩 태그** 논리적 순서 (h1 → h2 → h3)
- [ ] **alt 속성** 모든 이미지에 설정
- [ ] **label-input 연결** (for-id 또는 내포)

### CSS 검증
- [ ] **CSS 유효성** 검사 통과
- [ ] **브라우저 호환성** 확인 (autoprefixer 적용)
- [ ] **반응형** 모든 디바이스에서 테스트
- [ ] **성능 최적화** (중복 제거, 압축)
- [ ] **폰트 로딩** 최적화 (font-display: swap)

### 접근성 검증
- [ ] **색상 대비** 4.5:1 이상 (WCAG AA)
- [ ] **키보드 접근** 모든 인터랙션 요소
- [ ] **포커스 표시** 명확한 시각적 피드백
- [ ] **스크린 리더** 테스트 (VoiceOver, NVDA)
- [ ] **ARIA 속성** 적절한 사용

### 성능 검증
- [ ] **Lighthouse** 점수 90+ (Performance, Accessibility)
- [ ] **이미지 최적화** (WebP, lazy loading)
- [ ] **CSS 크기** 최적화 (50KB 이하 권장)
- [ ] **폰트 로딩** 시간 측정
- [ ] **렌더링 성능** 60fps 유지

### 모바일 검증
- [ ] **터치 영역** 44px × 44px 이상
- [ ] **스크롤 성능** 부드러운 스크롤링
- [ ] **가로/세로 모드** 모두 지원
- [ ] **Safe Area** 고려 (iPhone X+)
- [ ] **터치 제스처** 적절한 피드백

---

이 퍼블리싱 가이드를 통해 일관되고 품질 높은 마크업을 작성하여 사용자 경험과 개발 효율성을 모두 향상시킬 수 있습니다.