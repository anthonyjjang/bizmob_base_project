# bizMOB4Vue-SI 디자인 시스템 가이드

Vue 3 + Ionic 기반 하이브리드 모바일 애플리케이션의 디자인 시스템 및 UI 스타일 가이드입니다.

## 📋 목차

- [디자인 원칙](#-디자인-원칙)
- [컬러 시스템](#-컬러-시스템)
- [타이포그래피](#-타이포그래피)
- [그리드 시스템](#-그리드-시스템)
- [컴포넌트 라이브러리](#-컴포넌트-라이브러리)
- [아이콘 시스템](#-아이콘-시스템)
- [애니메이션 및 트랜지션](#-애니메이션-및-트랜지션)
- [반응형 디자인](#-반응형-디자인)
- [테마 커스터마이징](#-테마-커스터마이징)

## 🎨 디자인 원칙

### 핵심 원칙

1. **모바일 우선 (Mobile First)**
   - 터치 인터랙션 최적화
   - 한 손 조작 가능한 UI 구성
   - 최소 터치 영역 44px × 44px

2. **일관성 (Consistency)**
   - 통일된 시각적 언어
   - 예측 가능한 사용자 경험
   - 플랫폼별 네이티브 가이드라인 준수

3. **접근성 (Accessibility)**
   - WCAG 2.1 AA 준수
   - 충분한 색상 대비율
   - 스크린 리더 지원

4. **성능 최적화**
   - 가벼운 에셋 사용
   - 효율적인 애니메이션
   - 빠른 로딩 시간

### 브랜드 아이덴티티

- **브랜드 컬러**: bizMOB Blue (#2f4592)
- **톤앤매너**: 전문적이고 신뢰감 있는 비즈니스 툴
- **키워드**: Professional, Reliable, Efficient, Modern

## 🎨 컬러 시스템

### Primary Colors

```scss
:root {
  // Primary Brand Colors
  --ion-color-primary: #2f4592;        // bizMOB Blue
  --ion-color-primary-rgb: 47,69,146;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255,255,255;
  --ion-color-primary-shade: #293e81;
  --ion-color-primary-tint: #44599d;
  
  // Secondary Colors
  --ion-color-secondary: #3478f5;      // Action Blue
  --ion-color-success: #2dd55b;        // Success Green
  --ion-color-warning: #ffce00;        // Warning Yellow
  --ion-color-danger: #eb4e40;         // Error Red
}
```

### Neutral Colors

```scss
:root {
  // Neutral Grays
  --color-gray-900: #202020;           // Main Text
  --color-gray-800: #4d4d4d;           // Secondary Text
  --color-gray-600: #888888;           // Placeholder Text
  --color-gray-400: #a7a7a7;           // Disabled Text
  --color-gray-300: #dfdfdf;           // Border
  --color-gray-100: #f8f9fc;           // Background
  --color-gray-50: #ffffff;            // Surface
}
```

### Semantic Colors

| 색상 | Hex | 사용처 | 설명 |
|------|-----|--------|------|
| **Primary** | #2f4592 | 주요 액션, 브랜딩 | 로그인 버튼, 헤더 타이틀 |
| **Secondary** | #3478f5 | 보조 액션, 링크 | 플로팅 버튼, 알림 배지 |
| **Success** | #2dd55b | 성공 상태 | 완료 메시지, 확인 아이콘 |
| **Warning** | #ffce00 | 주의 상태 | 경고 메시지, 주의 아이콘 |
| **Danger** | #eb4e40 | 오류 상태 | 에러 메시지, 삭제 버튼 |

### Color Usage Examples

```scss
// 텍스트 색상 클래스
.text-primary { color: var(--ion-color-primary); }
.text-secondary { color: var(--color-gray-800); }
.text-muted { color: var(--color-gray-600); }
.text-disabled { color: var(--color-gray-400); }

// 배경 색상 클래스
.bg-primary { background-color: var(--ion-color-primary); }
.bg-surface { background-color: var(--color-gray-50); }
.bg-light { background-color: var(--color-gray-100); }
```

## ✏️ 타이포그래피

### 폰트 패밀리

```scss
:root {
  --ion-font-family: "Noto Sans", -apple-system, BlinkMacSystemFont, 
                     "Segoe UI", Roboto, sans-serif;
}

@font-face {
  font-family: "Noto Sans";
  font-weight: 300;  // Light
  src: url("/fonts/NotoSans-Light.ttf") format("truetype");
}

@font-face {
  font-family: "Noto Sans";
  font-weight: 400;  // Regular
  src: url("/fonts/NotoSans-Regular.ttf") format("truetype");
}

@font-face {
  font-family: "Noto Sans";
  font-weight: 500;  // Medium
  src: url("/fonts/NotoSans-Medium.ttf") format("truetype");
}

@font-face {
  font-family: "Noto Sans";
  font-weight: 700;  // Bold
  src: url("/fonts/NotoSans-Bold.ttf") format("truetype");
}
```

### 타이포그래피 스케일

| 스타일 | 크기 | 줄 간격 | 굵기 | 사용처 |
|--------|------|---------|------|--------|
| **H1** | 24px | 30px | 700 | 페이지 제목 |
| **H2** | 20px | 25px | 700 | 섹션 제목 |
| **H3** | 18px | 23px | 700 | 서브 섹션 제목 |
| **Body Large** | 16px | 20px | 400 | 본문 텍스트 (큰) |
| **Body** | 14px | 18px | 400 | 본문 텍스트 |
| **Body Small** | 12px | 15px | 400 | 보조 텍스트 |
| **Caption** | 11px | 14px | 400 | 캡션, 저작권 |

### 타이포그래피 클래스

```scss
// 제목 스타일
.heading-1 {
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
  color: var(--color-gray-900);
}

.heading-2 {
  font-size: 20px;
  line-height: 25px;
  font-weight: 700;
  color: var(--color-gray-900);
}

.heading-3 {
  font-size: 18px;
  line-height: 23px;
  font-weight: 700;
  color: var(--color-gray-900);
}

// 본문 스타일
.body-large {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
}

.body {
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
}

.body-small {
  font-size: 12px;
  line-height: 15px;
  font-weight: 400;
}

.caption {
  font-size: 11px;
  line-height: 14px;
  font-weight: 400;
  color: var(--color-gray-600);
}
```

## 📐 그리드 시스템

### 레이아웃 기본 단위

```scss
:root {
  // Spacing Scale (8px 기반)
  --spacing-xs: 4px;    // 0.25rem
  --spacing-sm: 8px;    // 0.5rem
  --spacing-md: 16px;   // 1rem
  --spacing-lg: 24px;   // 1.5rem
  --spacing-xl: 32px;   // 2rem
  --spacing-xxl: 48px;  // 3rem
}
```

### 컨테이너 스타일

```scss
// 기본 콘텐츠 영역
.content {
  margin: 0 var(--spacing-md);        // 좌우 16px
  padding-bottom: var(--spacing-lg);  // 하단 24px
}

// 전체 너비 컨테이너
.container-fluid {
  width: 100%;
  padding: 0 var(--spacing-md);
}

// 제한된 너비 컨테이너
.container {
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
```

### 그리드 시스템

```scss
// Flexbox 기반 그리드
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(-1 * var(--spacing-sm));
}

.col {
  flex: 1;
  padding: 0 var(--spacing-sm);
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 var(--spacing-sm);
}

.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding: 0 var(--spacing-sm);
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 var(--spacing-sm);
}
```

## 🧩 컴포넌트 라이브러리

### Button 컴포넌트

```scss
.button {
  // 기본 스타일
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  // 최소 터치 영역 보장
  min-height: 44px;
  min-width: 44px;
  
  // 기본 색상
  background-color: var(--color-gray-800);
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-gray-400);
  }
  
  // 버튼 변형
  &.button-blue {
    background-color: var(--ion-color-primary);
    
    &:active {
      background-color: var(--ion-color-primary-shade);
    }
    
    &:disabled {
      background-color: var(--color-gray-300);
      color: var(--color-gray-400);
    }
  }
  
  &.button-line {
    background-color: transparent;
    border: 1px solid var(--ion-color-primary);
    color: var(--ion-color-primary);
    
    &:active {
      background-color: var(--color-gray-100);
    }
  }
  
  &.button-white {
    background-color: white;
    border: 1px solid var(--color-gray-800);
    color: var(--color-gray-800);
    
    &:active {
      background-color: var(--color-gray-100);
    }
  }
  
  // 크기 변형
  &.large {
    height: 56px;
    font-size: 18px;
  }
  
  &.regular {
    height: 36px;
    font-size: 14px;
  }
  
  &.small {
    height: 28px;
    font-size: 14px;
  }
}
```

### Input 컴포넌트

```scss
input[type='text'],
input[type='email'],
input[type='number'],
input[type='password'] {
  // 기본 스타일
  width: 100%;
  height: 44px;
  padding: 12px var(--spacing-md);
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: var(--color-gray-900);
  background: white;
  border: 1px solid var(--color-gray-300);
  border-radius: 5px;
  transition: border-color 0.2s ease;
  
  // iOS 줌 방지
  font-size: 16px;
  
  &::placeholder {
    color: var(--color-gray-600);
  }
  
  &:focus {
    outline: none;
    border-color: var(--ion-color-primary);
    box-shadow: 0 0 0 2px rgba(47, 69, 146, 0.1);
  }
  
  &:disabled,
  &:read-only {
    background-color: var(--color-gray-100);
    color: var(--color-gray-600);
    cursor: not-allowed;
    
    &:focus {
      border-color: var(--color-gray-300);
      box-shadow: none;
    }
  }
  
  &.error {
    border-color: var(--ion-color-danger);
  }
}

// 검색 입력 필드
.search-input {
  border-radius: 22px;
  border-color: var(--ion-color-primary);
  padding-left: 40px;
  font-weight: 400;
  color: var(--ion-color-primary);
  
  &::placeholder {
    color: var(--ion-color-primary);
    opacity: 0.7;
  }
}
```

### Card 컴포넌트

```scss
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-gray-300);
    
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-gray-900);
      margin: 0;
    }
  }
  
  .card-body {
    padding: var(--spacing-md);
    
    .card-text {
      font-size: 14px;
      line-height: 18px;
      color: var(--color-gray-800);
      margin: 0 0 var(--spacing-sm) 0;
    }
  }
  
  .card-footer {
    padding: var(--spacing-md);
    background-color: var(--color-gray-100);
    border-top: 1px solid var(--color-gray-300);
  }
}
```

### List 컴포넌트

```scss
.list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  
  .list-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-gray-300);
    transition: background-color 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: var(--color-gray-100);
    }
    
    &:active {
      background-color: rgba(47, 69, 146, 0.1);
    }
    
    .item-start {
      margin-right: var(--spacing-md);
      flex-shrink: 0;
    }
    
    .item-body {
      flex: 1;
      min-width: 0; // 텍스트 오버플로우 방지
      
      .item-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-gray-900);
        margin: 0 0 4px 0;
        
        // 텍스트 오버플로우 처리
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .item-subtitle {
        font-size: 14px;
        color: var(--color-gray-600);
        margin: 0;
        
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .item-end {
      margin-left: var(--spacing-md);
      flex-shrink: 0;
    }
  }
}
```

## 🔍 아이콘 시스템

### 아이콘 스타일

```scss
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  
  // 아이콘 크기 변형
  &.icon-small {
    width: 16px;
    height: 16px;
  }
  
  &.icon-large {
    width: 32px;
    height: 32px;
  }
  
  // 공통 아이콘
  &.icon-back {
    background-image: url('../images/ic_back.svg');
  }
  
  &.icon-close {
    background-image: url('../images/ic_close.svg');
  }
  
  &.icon-menu {
    background-image: url('../images/ic_header_menu.svg');
  }
  
  &.icon-search {
    background-image: url('../images/ic_search.svg');
  }
  
  &.icon-filter {
    background-image: url('../images/btn_filter.svg');
  }
  
  &.icon-arrow-right {
    background-image: url('../images/ic_arrow_r_g.svg');
  }
  
  &.icon-add {
    background-image: url('../images/ic_add_widget.svg');
  }
}
```

### 아이콘 사용 가이드라인

| 크기 | 사용처 | 예시 |
|------|--------|------|
| 16px | 인라인 텍스트, 작은 버튼 | 텍스트 옆 상태 아이콘 |
| 24px | 기본 버튼, 리스트 아이템 | 헤더 버튼, 네비게이션 |
| 32px | 주요 액션, 플로팅 버튼 | FAB, 대형 액션 버튼 |

## ⚡ 애니메이션 및 트랜지션

### 애니메이션 원칙

```scss
:root {
  // 애니메이션 지속 시간
  --transition-fast: 0.15s;
  --transition-normal: 0.2s;
  --transition-slow: 0.3s;
  
  // 이징 함수
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  --ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
}
```

### 기본 트랜지션

```scss
// 색상 변화
.transition-colors {
  transition: color var(--transition-normal) var(--ease-out),
              background-color var(--transition-normal) var(--ease-out),
              border-color var(--transition-normal) var(--ease-out);
}

// 변형 효과
.transition-transform {
  transition: transform var(--transition-normal) var(--ease-out);
}

// 크기 변화
.transition-scale {
  transition: transform var(--transition-fast) var(--ease-out);
  
  &:active {
    transform: scale(0.95);
  }
}

// 투명도 변화
.transition-opacity {
  transition: opacity var(--transition-normal) var(--ease-out);
}
```

### 로딩 애니메이션

```scss
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.loading-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

## 📱 반응형 디자인

### 브레이크포인트

```scss
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

// 미디어 쿼리 믹스인
@mixin media-sm {
  @media (min-width: 576px) { @content; }
}

@mixin media-md {
  @media (min-width: 768px) { @content; }
}

@mixin media-lg {
  @media (min-width: 992px) { @content; }
}
```

### 반응형 유틸리티

```scss
// 숨김/보임 유틸리티
.d-block { display: block; }
.d-inline { display: inline; }
.d-flex { display: flex; }
.d-none { display: none; }

// 반응형 숨김
.d-sm-none {
  @include media-sm {
    display: none !important;
  }
}

.d-md-block {
  @include media-md {
    display: block !important;
  }
}
```

## 🎭 테마 커스터마이징

### CSS Custom Properties 활용

```scss
:root {
  // 라이트 테마 (기본)
  --theme-background: #ffffff;
  --theme-surface: #f8f9fc;
  --theme-text-primary: #202020;
  --theme-text-secondary: #4d4d4d;
  --theme-border: #dfdfdf;
}

[data-theme="dark"] {
  // 다크 테마
  --theme-background: #1a1a1a;
  --theme-surface: #2d2d2d;
  --theme-text-primary: #ffffff;
  --theme-text-secondary: #b3b3b3;
  --theme-border: #404040;
}

// 테마 색상 적용
body {
  background-color: var(--theme-background);
  color: var(--theme-text-primary);
}

.card {
  background-color: var(--theme-surface);
  border: 1px solid var(--theme-border);
}
```

### 브랜드 커스터마이징

```scss
// 브랜드별 Primary 색상 오버라이드
.brand-company-a {
  --ion-color-primary: #e74c3c;
  --ion-color-primary-shade: #c0392b;
  --ion-color-primary-tint: #ea6153;
}

.brand-company-b {
  --ion-color-primary: #27ae60;
  --ion-color-primary-shade: #229954;
  --ion-color-primary-tint: #3db76d;
}
```

### 접근성 고려사항

```scss
// 고대비 모드 지원
@media (prefers-contrast: high) {
  :root {
    --color-gray-300: #000000;
    --color-gray-600: #ffffff;
  }
}

// 모션 감소 설정 지원
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 포커스 가시성 개선
:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}
```

## 📏 디자인 토큰

### 스페이싱 토큰

| 토큰 | 값 | 사용처 |
|------|----|---------| 
| `--spacing-xs` | 4px | 작은 요소 간격 |
| `--spacing-sm` | 8px | 기본 요소 간격 |
| `--spacing-md` | 16px | 컨테이너 패딩 |
| `--spacing-lg` | 24px | 섹션 간격 |
| `--spacing-xl` | 32px | 페이지 간격 |

### 보더 토큰

```scss
:root {
  --border-width: 1px;
  --border-radius-sm: 4px;
  --border-radius: 5px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
  --border-radius-full: 9999px;
}
```

### 그림자 토큰

```scss
:root {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

---

이 디자인 가이드는 일관된 사용자 경험을 제공하고 개발 효율성을 높이기 위한 표준입니다. 새로운 컴포넌트나 기능 개발 시 이 가이드를 참고하여 일관성 있는 디자인을 구현하시기 바랍니다.