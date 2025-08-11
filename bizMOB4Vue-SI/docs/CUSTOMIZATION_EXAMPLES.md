# bizMOB4Vue-SI 커스터마이징 예제 가이드

실제 비즈니스 요구사항에 따른 커스터마이징 예제와 구현 방법을 제시합니다.

## 📋 목차

- [커스터마이징 요구사항 분류](#-커스터마이징-요구사항-분류)
- [UI/UX 커스터마이징](#-uiux-커스터마이징)
- [기능 확장 예제](#-기능-확장-예제)
- [API 통합 커스터마이징](#-api-통합-커스터마이징)
- [비즈니스 로직 커스터마이징](#-비즈니스-로직-커스터마이징)
- [성능 최적화 사례](#-성능-최적화-사례)
- [보안 강화 사례](#-보안-강화-사례)
- [다국어 지원 확장](#-다국어-지원-확장)

## 🎯 커스터마이징 요구사항 분류

### Level 1: 기본 커스터마이징 (1-2일)
- 브랜딩 색상 변경
- 로고 및 이미지 교체
- 기본 텍스트 수정
- 간단한 레이아웃 조정

### Level 2: 중급 커스터마이징 (3-5일)
- 새로운 페이지 추가
- 기존 폼 필드 수정/추가
- 커스텀 컴포넌트 개발
- 워크플로우 변경

### Level 3: 고급 커스터마이징 (1-2주)
- 복합 비즈니스 로직 구현
- 외부 API 통합
- 실시간 기능 추가
- 대용량 데이터 처리

### Level 4: 플랫폼 확장 (2-4주)
- 새로운 모듈 개발
- 플러그인 아키텍처 구현
- 마이크로서비스 통합
- 고급 분석 및 리포팅

## 🎨 UI/UX 커스터마이징

### 1. 브랜드 테마 커스터마이징

#### 요구사항
> **회사 브랜드 색상을 적용하고, 로고를 교체하여 자사 앱으로 브랜딩**

#### 구현 방법

```scss
// src/assets/css/custom-theme.scss
:root {
  // 기존 bizMOB 컬러를 회사 브랜드 컬러로 변경
  --ion-color-primary: #e74c3c;        // 회사 Red
  --ion-color-primary-rgb: 231,76,60;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #c0392b;
  --ion-color-primary-tint: #ea6153;
  
  // 세컨더리 컬러
  --ion-color-secondary: #f39c12;      // 회사 Orange
  --ion-color-secondary-rgb: 243,156,18;
  --ion-color-secondary-shade: #d68910;
  --ion-color-secondary-tint: #f5ab35;
  
  // 브랜드 전용 컬러
  --brand-gradient: linear-gradient(135deg, 
    var(--ion-color-primary) 0%, 
    var(--ion-color-secondary) 100%);
}

// 브랜드 전용 클래스
.brand-header {
  background: var(--brand-gradient);
  color: white;
  
  .brand-logo {
    width: 120px;
    height: 40px;
    background: url('../images/brand/company-logo.svg') no-repeat center;
    background-size: contain;
  }
}

.brand-button {
  background: var(--brand-gradient);
  border: none;
  border-radius: 25px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  }
}
```

```vue
<!-- src/components/BrandHeader.vue -->
<template>
  <ion-header class="brand-header">
    <ion-toolbar>
      <div class="brand-logo" slot="start"></div>
      <ion-title>{{ companyName }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="openProfile">
          <ion-icon :icon="person"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { person } from 'ionicons/icons';

interface Props {
  companyName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  companyName: '우리 회사'
});
</script>
```

### 2. 다크모드 토글 구현

#### 요구사항
> **사용자가 라이트/다크 모드를 전환할 수 있는 기능 추가**

#### 구현 방법

```typescript
// src/composables/useTheme.ts
import { ref, watch } from 'vue';
import { StoreService } from '@/shared';

export function useTheme() {
  const appStore = new StoreService('app');
  const isDarkMode = ref(false);
  
  // 초기 테마 로드
  const initTheme = () => {
    const savedTheme = appStore.getters('theme') || 'light';
    isDarkMode.value = savedTheme === 'dark';
    applyTheme(savedTheme);
  };
  
  // 테마 적용
  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    
    // Ionic 다크모드 적용
    document.body.classList.toggle('ion-palette-dark', theme === 'dark');
  };
  
  // 테마 토글
  const toggleTheme = () => {
    const newTheme = isDarkMode.value ? 'light' : 'dark';
    isDarkMode.value = !isDarkMode.value;
    
    appStore.dispatch('setTheme', newTheme);
    applyTheme(newTheme);
  };
  
  // 시스템 테마 감지
  const detectSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  };
  
  return {
    isDarkMode,
    initTheme,
    toggleTheme,
    detectSystemTheme
  };
}
```

```scss
// src/assets/css/dark-theme.scss
[data-theme="dark"] {
  --ion-background-color: #0d1117;
  --ion-text-color: #c9d1d9;
  --ion-color-step-50: #161b22;
  --ion-color-step-100: #21262d;
  --ion-color-step-150: #30363d;
  --ion-color-step-200: #484f58;
  
  .brand-header {
    background: linear-gradient(135deg, #8b2635 0%, #d68910 100%);
  }
  
  .card {
    background-color: var(--ion-color-step-100);
    border: 1px solid var(--ion-color-step-150);
  }
}
```

### 3. 커스텀 스플래시 화면

#### 요구사항
> **앱 로딩 중 회사 브랜드를 표시하는 커스텀 스플래시 화면 구현**

#### 구현 방법

```vue
<!-- src/components/CustomSplash.vue -->
<template>
  <div class="splash-container" :class="{ 'fade-out': shouldFadeOut }">
    <div class="splash-content">
      <div class="brand-animation">
        <img src="/images/brand/logo-large.svg" alt="회사 로고" class="brand-logo-large" />
        <div class="brand-name">{{ companyName }}</div>
        <div class="brand-tagline">{{ tagline }}</div>
      </div>
      
      <div class="loading-indicator">
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Props {
  companyName?: string;
  tagline?: string;
  loadingText?: string;
  minDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  companyName: '우리 회사',
  tagline: 'Innovation for Tomorrow',
  loadingText: '앱을 준비하고 있습니다...',
  minDuration: 2000
});

const emit = defineEmits<{
  ready: [];
}>();

const shouldFadeOut = ref(false);

onMounted(async () => {
  // 최소 표시 시간 보장
  await new Promise(resolve => setTimeout(resolve, props.minDuration));
  
  shouldFadeOut.value = true;
  
  // 페이드아웃 애니메이션 완료 후 이벤트 발생
  setTimeout(() => {
    emit('ready');
  }, 500);
});
</script>

<style scoped lang="scss">
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--brand-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  
  &.fade-out {
    opacity: 0;
    pointer-events: none;
  }
}

.splash-content {
  text-align: center;
  color: white;
}

.brand-animation {
  animation: slideUpFade 1s ease-out;
  
  .brand-logo-large {
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    animation: logoGlow 2s ease-in-out infinite alternate;
  }
  
  .brand-name {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .brand-tagline {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 48px;
  }
}

.loading-indicator {
  .loading-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: white;
      animation: dotPulse 1.4s ease-in-out infinite both;
      
      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
      &:nth-child(3) { animation-delay: 0s; }
    }
  }
  
  .loading-text {
    font-size: 14px;
    opacity: 0.8;
  }
}

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logoGlow {
  0% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
  }
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
```

## 🚀 기능 확장 예제

### 1. 실시간 채팅 기능 추가

#### 요구사항
> **사용자 간 실시간 채팅 기능을 추가하여 협업 환경 구축**

#### 구현 방법

```typescript
// src/services/ChatService.ts
import { ref, reactive } from 'vue';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'failed';
}

interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

export class ChatService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  public messages = ref<ChatMessage[]>([]);
  public rooms = ref<ChatRoom[]>([]);
  public currentRoom = ref<string | null>(null);
  public connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  // WebSocket 연결
  connect(userId: string, token: string) {
    const wsUrl = `${process.env.VUE_APP_WS_URL}/chat?userId=${userId}&token=${token}`;
    
    this.ws = new WebSocket(wsUrl);
    this.connectionStatus.value = 'connecting';
    
    this.ws.onopen = () => {
      this.connectionStatus.value = 'connected';
      this.reconnectAttempts = 0;
      console.log('채팅 서버에 연결됨');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleIncomingMessage(data);
    };
    
    this.ws.onclose = () => {
      this.connectionStatus.value = 'disconnected';
      this.attemptReconnect(userId, token);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };
  }
  
  // 메시지 전송
  sendMessage(roomId: string, message: string, type: 'text' | 'image' | 'file' = 'text') {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('채팅 서버에 연결되지 않음');
    }
    
    const messageData = {
      type: 'message',
      roomId,
      message,
      messageType: type,
      timestamp: new Date().toISOString()
    };
    
    this.ws.send(JSON.stringify(messageData));
    
    // 로컬에 임시 메시지 추가 (낙관적 업데이트)
    this.addLocalMessage({
      id: `temp_${Date.now()}`,
      userId: 'current_user',
      userName: '나',
      message,
      timestamp: new Date(),
      type,
      status: 'sending'
    });
  }
  
  // 방 입장
  joinRoom(roomId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    this.currentRoom.value = roomId;
    this.ws.send(JSON.stringify({
      type: 'join_room',
      roomId
    }));
  }
  
  // 방 나가기
  leaveRoom(roomId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    this.ws.send(JSON.stringify({
      type: 'leave_room',
      roomId
    }));
    
    if (this.currentRoom.value === roomId) {
      this.currentRoom.value = null;
    }
  }
  
  private handleIncomingMessage(data: any) {
    switch (data.type) {
      case 'message':
        this.messages.value.push({
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: new Date(data.timestamp),
          type: data.messageType,
          status: 'sent'
        });
        break;
        
      case 'room_list':
        this.rooms.value = data.rooms;
        break;
        
      case 'user_joined':
        console.log(`${data.userName}님이 입장했습니다.`);
        break;
        
      case 'user_left':
        console.log(`${data.userName}님이 퇴장했습니다.`);
        break;
    }
  }
  
  private addLocalMessage(message: ChatMessage) {
    this.messages.value.push(message);
  }
  
  private attemptReconnect(userId: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect(userId, token);
      }, Math.pow(2, this.reconnectAttempts) * 1000); // 지수 백오프
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

```vue
<!-- src/views/CHAT/CHAT0100.vue -->
<template>
  <ion-page>
    <ion-header>
      <AppHeader title="채팅" :left-buttons="['back']" />
    </ion-header>

    <ion-content>
      <!-- 연결 상태 표시 -->
      <div v-if="connectionStatus !== 'connected'" class="connection-status">
        <ion-chip :color="connectionStatus === 'connecting' ? 'warning' : 'danger'">
          <ion-icon :icon="connectionStatus === 'connecting' ? time : alertCircle"></ion-icon>
          <ion-label>
            {{ connectionStatus === 'connecting' ? '연결 중...' : '연결 끊어짐' }}
          </ion-label>
        </ion-chip>
      </div>

      <!-- 채팅 방 목록 -->
      <ion-list v-if="!currentRoom">
        <ion-item
          v-for="room in rooms"
          :key="room.id"
          button
          @click="joinChatRoom(room.id)"
        >
          <ion-avatar slot="start">
            <div class="room-avatar">{{ room.name[0] }}</div>
          </ion-avatar>
          
          <ion-label>
            <h2>{{ room.name }}</h2>
            <p v-if="room.lastMessage">
              {{ room.lastMessage.message }}
            </p>
          </ion-label>
          
          <div slot="end" class="room-meta">
            <ion-badge
              v-if="room.unreadCount > 0"
              color="primary"
              class="unread-badge"
            >
              {{ room.unreadCount }}
            </ion-badge>
            <p class="last-message-time">
              {{ formatTime(room.lastMessage?.timestamp) }}
            </p>
          </div>
        </ion-item>
      </ion-list>

      <!-- 채팅 메시지 -->
      <div v-else class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{
            'message-mine': message.userId === currentUserId,
            'message-other': message.userId !== currentUserId
          }"
        >
          <div class="message-bubble">
            <div class="message-content">
              {{ message.message }}
            </div>
            <div class="message-meta">
              <span class="message-time">
                {{ formatTime(message.timestamp) }}
              </span>
              <ion-icon
                v-if="message.userId === currentUserId"
                :icon="getStatusIcon(message.status)"
                :color="getStatusColor(message.status)"
                class="message-status"
              ></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- 메시지 입력 -->
    <ion-footer v-if="currentRoom">
      <ion-toolbar>
        <div class="message-input-container">
          <ion-textarea
            v-model="newMessage"
            placeholder="메시지를 입력하세요..."
            :rows="1"
            :auto-grow="true"
            @keydown.enter.prevent="sendMessage"
            class="message-input"
          ></ion-textarea>
          
          <ion-button
            fill="clear"
            @click="sendMessage"
            :disabled="!newMessage.trim() || connectionStatus !== 'connected'"
          >
            <ion-icon :icon="send"></ion-icon>
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { ChatService } from '@/services/ChatService';
import { send, time, alertCircle, checkmark, checkmarkDone } from 'ionicons/icons';

const chatService = new ChatService();
const newMessage = ref('');
const messagesContainer = ref<HTMLElement>();
const currentUserId = 'current_user'; // 실제 사용자 ID로 교체

// Reactive data from service
const { messages, rooms, currentRoom, connectionStatus } = chatService;

const joinChatRoom = (roomId: string) => {
  chatService.joinRoom(roomId);
  scrollToBottom();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentRoom.value) return;
  
  try {
    await chatService.sendMessage(currentRoom.value, newMessage.value);
    newMessage.value = '';
    scrollToBottom();
  } catch (error) {
    console.error('메시지 전송 실패:', error);
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp: Date | undefined) => {
  if (!timestamp) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sending': return time;
    case 'sent': return checkmark;
    case 'failed': return alertCircle;
    default: return checkmark;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sending': return 'medium';
    case 'sent': return 'success';
    case 'failed': return 'danger';
    default: return 'medium';
  }
};

onMounted(() => {
  // 사용자 토큰으로 채팅 서버 연결
  const userToken = 'user_jwt_token'; // 실제 토큰으로 교체
  chatService.connect(currentUserId, userToken);
});

onUnmounted(() => {
  chatService.disconnect();
});
</script>

<style scoped lang="scss">
.connection-status {
  padding: 8px 16px;
  background: rgba(255, 193, 7, 0.1);
  text-align: center;
}

.chat-messages {
  padding: 16px;
  min-height: 100%;
  
  .message-item {
    margin-bottom: 16px;
    
    &.message-mine {
      display: flex;
      justify-content: flex-end;
      
      .message-bubble {
        background: var(--ion-color-primary);
        color: white;
        border-radius: 18px 18px 4px 18px;
      }
    }
    
    &.message-other {
      display: flex;
      justify-content: flex-start;
      
      .message-bubble {
        background: var(--ion-color-light);
        color: var(--ion-color-dark);
        border-radius: 18px 18px 18px 4px;
      }
    }
  }
  
  .message-bubble {
    max-width: 70%;
    padding: 12px 16px;
    
    .message-content {
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .message-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      opacity: 0.7;
      
      .message-time {
        margin-right: 4px;
      }
      
      .message-status {
        font-size: 14px;
      }
    }
  }
}

.message-input-container {
  display: flex;
  align-items: end;
  padding: 8px;
  
  .message-input {
    flex: 1;
    margin-right: 8px;
  }
}

.room-meta {
  text-align: right;
  
  .unread-badge {
    margin-bottom: 4px;
  }
  
  .last-message-time {
    font-size: 12px;
    color: var(--ion-color-medium);
  }
}

.room-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ion-color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
```

### 2. 오프라인 모드 지원

#### 요구사항
> **네트워크 연결이 없어도 기본 기능을 사용할 수 있는 오프라인 모드 구현**

#### 구현 방법

```typescript
// src/services/OfflineService.ts
import { ref } from 'vue';

interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

export class OfflineService {
  private syncQueue: OfflineAction[] = [];
  private isOnline = ref(navigator.onLine);
  private syncInProgress = ref(false);
  
  constructor() {
    // 네트워크 상태 모니터링
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // 저장된 큐 복원
    this.restoreQueue();
  }
  
  // 오프라인 액션 큐에 추가
  queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
    const queueItem: OfflineAction = {
      ...action,
      id: `offline_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      retryCount: 0
    };
    
    this.syncQueue.push(queueItem);
    this.saveQueue();
    
    // 온라인 상태면 즉시 동기화 시도
    if (this.isOnline.value) {
      this.syncPendingActions();
    }
  }
  
  // 펜딩 액션 동기화
  async syncPendingActions() {
    if (!this.isOnline.value || this.syncInProgress.value || this.syncQueue.length === 0) {
      return;
    }
    
    this.syncInProgress.value = true;
    
    const actionsToSync = [...this.syncQueue];
    const failedActions: OfflineAction[] = [];
    
    for (const action of actionsToSync) {
      try {
        await this.executeAction(action);
        console.log(`오프라인 액션 동기화 완료: ${action.type} ${action.endpoint}`);
      } catch (error) {
        console.error(`오프라인 액션 동기화 실패: ${action.id}`, error);
        
        action.retryCount++;
        if (action.retryCount < 3) {
          failedActions.push(action);
        } else {
          console.warn(`최대 재시도 횟수 초과, 액션 제거: ${action.id}`);
        }
      }
    }
    
    this.syncQueue = failedActions;
    this.saveQueue();
    this.syncInProgress.value = false;
  }
  
  private async executeAction(action: OfflineAction): Promise<void> {
    const { type, endpoint, data } = action;
    
    let method: string;
    switch (type) {
      case 'CREATE': method = 'POST'; break;
      case 'UPDATE': method = 'PUT'; break;
      case 'DELETE': method = 'DELETE'; break;
      default: throw new Error(`Unknown action type: ${type}`);
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: type !== 'DELETE' ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  private handleOnline() {
    console.log('네트워크 연결됨');
    this.isOnline.value = true;
    
    // 온라인 상태가 되면 펜딩 액션 동기화
    setTimeout(() => {
      this.syncPendingActions();
    }, 1000);
  }
  
  private handleOffline() {
    console.log('네트워크 연결 끊어짐');
    this.isOnline.value = false;
  }
  
  private saveQueue() {
    localStorage.setItem('offline_sync_queue', JSON.stringify(this.syncQueue));
  }
  
  private restoreQueue() {
    try {
      const saved = localStorage.getItem('offline_sync_queue');
      if (saved) {
        this.syncQueue = JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error('오프라인 큐 복원 실패:', error);
      this.syncQueue = [];
    }
  }
  
  private getAuthToken(): string {
    // 인증 토큰 반환 로직
    return localStorage.getItem('auth_token') || '';
  }
  
  // Public getters
  get isOnlineStatus() {
    return this.isOnline;
  }
  
  get pendingActionsCount() {
    return this.syncQueue.length;
  }
  
  get isSyncing() {
    return this.syncInProgress;
  }
}

// 전역 오프라인 서비스 인스턴스
export const offlineService = new OfflineService();
```

```typescript
// src/composables/useOfflineData.ts
import { ref, computed } from 'vue';

interface CacheItem<T> {
  data: T;
  timestamp: Date;
  ttl: number; // Time to live in milliseconds
}

export function useOfflineData<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const cacheKey = `offline_cache_${key}`;
  
  // 로컬 캐시에서 데이터 로드
  const loadFromCache = (): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      
      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = new Date().getTime();
      const cacheTime = new Date(cacheItem.timestamp).getTime();
      
      // TTL 체크
      if (now - cacheTime > cacheItem.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('캐시 로드 실패:', error);
      return null;
    }
  };
  
  // 로컬 캐시에 데이터 저장
  const saveToCache = (data: T) => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: new Date(),
        ttl
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('캐시 저장 실패:', error);
    }
  };
  
  // 캐시 삭제
  const clearCache = () => {
    localStorage.removeItem(cacheKey);
  };
  
  // 캐시된 데이터 존재 여부
  const hasCachedData = computed(() => {
    return loadFromCache() !== null;
  });
  
  return {
    loadFromCache,
    saveToCache,
    clearCache,
    hasCachedData
  };
}
```

```vue
<!-- src/components/NetworkStatus.vue -->
<template>
  <ion-toast
    :is-open="showOfflineToast"
    message="오프라인 모드입니다. 일부 기능이 제한될 수 있습니다."
    :duration="0"
    position="top"
    color="warning"
    :buttons="[
      {
        text: '확인',
        role: 'cancel'
      }
    ]"
    @didDismiss="showOfflineToast = false"
  ></ion-toast>
  
  <ion-toast
    :is-open="showSyncToast"
    :message="syncMessage"
    :duration="3000"
    position="bottom"
    color="success"
  ></ion-toast>
  
  <!-- 동기화 상태 표시 -->
  <ion-chip
    v-if="pendingCount > 0"
    color="warning"
    class="sync-status-chip"
    @click="forcSync"
  >
    <ion-icon :icon="isSyncing ? hourglass : cloud" class="sync-icon"></ion-icon>
    <ion-label>
      {{ isSyncing ? '동기화 중...' : `${pendingCount}개 대기 중` }}
    </ion-label>
  </ion-chip>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { offlineService } from '@/services/OfflineService';
import { cloud, hourglass } from 'ionicons/icons';

const showOfflineToast = ref(false);
const showSyncToast = ref(false);
const syncMessage = ref('');

// 오프라인 서비스 상태
const isOnline = computed(() => offlineService.isOnlineStatus.value);
const pendingCount = computed(() => offlineService.pendingActionsCount);
const isSyncing = computed(() => offlineService.isSyncing.value);

// 네트워크 상태 변화 감지
watch(isOnline, (online) => {
  if (!online) {
    showOfflineToast.value = true;
  } else {
    showOfflineToast.value = false;
    if (pendingCount.value > 0) {
      syncMessage.value = `${pendingCount.value}개 항목을 동기화합니다.`;
      showSyncToast.value = true;
    }
  }
});

// 동기화 완료 감지
watch([pendingCount, isSyncing], ([newCount, syncing]) => {
  if (!syncing && newCount === 0) {
    syncMessage.value = '모든 데이터가 동기화되었습니다.';
    showSyncToast.value = true;
  }
});

const forcSync = () => {
  if (isOnline.value) {
    offlineService.syncPendingActions();
  }
};
</script>

<style scoped lang="scss">
.sync-status-chip {
  position: fixed;
  top: 60px;
  right: 16px;
  z-index: 1000;
  cursor: pointer;
  
  .sync-icon {
    animation: spin 2s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

## 🔒 보안 강화 사례

### 1. 생체 인증 통합

#### 요구사항
> **지문/얼굴 인식을 통한 생체 인증 기능 추가**

#### 구현 방법

```typescript
// src/services/BiometricService.ts
import { Capacitor } from '@capacitor/core';
import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';

export class BiometricService {
  private isAvailable = false;
  private supportedTypes: BiometryType[] = [];
  
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('생체 인증은 네이티브 플랫폼에서만 지원됩니다.');
      return;
    }
    
    try {
      const result = await BiometricAuth.checkBiometry();
      this.isAvailable = result.isAvailable;
      this.supportedTypes = result.biometryTypes;
      
      console.log('지원되는 생체 인증:', this.supportedTypes);
    } catch (error) {
      console.error('생체 인증 초기화 실패:', error);
    }
  }
  
  async authenticate(reason: string = '앱에 로그인하기 위해 생체 인증이 필요합니다.'): Promise<boolean> {
    if (!this.isAvailable) {
      throw new Error('생체 인증을 사용할 수 없습니다.');
    }
    
    try {
      await BiometricAuth.authenticate({
        reason,
        cancelTitle: '취소',
        allowDeviceCredential: true,
        iosFallbackTitle: '패스코드 사용',
        androidTitle: '생체 인증',
        androidSubtitle: '등록된 생체 정보로 인증하세요',
        androidConfirmationRequired: false,
        androidNegativeButtonText: '취소'
      });
      
      return true;
    } catch (error: any) {
      console.error('생체 인증 실패:', error);
      
      // 에러 타입에 따른 처리
      switch (error.code) {
        case 'userCancel':
          throw new Error('사용자가 인증을 취소했습니다.');
        case 'biometryNotEnrolled':
          throw new Error('등록된 생체 정보가 없습니다.');
        case 'biometryNotAvailable':
          throw new Error('생체 인증을 사용할 수 없습니다.');
        default:
          throw new Error('생체 인증에 실패했습니다.');
      }
    }
  }
  
  get isBiometricAvailable(): boolean {
    return this.isAvailable;
  }
  
  get supportedBiometryTypes(): BiometryType[] {
    return this.supportedTypes;
  }
  
  getBiometryTypeText(type: BiometryType): string {
    switch (type) {
      case BiometryType.fingerprintAuthentication:
        return '지문 인식';
      case BiometryType.faceAuthentication:
        return '얼굴 인식';
      case BiometryType.touchId:
        return 'Touch ID';
      case BiometryType.faceId:
        return 'Face ID';
      default:
        return '생체 인증';
    }
  }
}

export const biometricService = new BiometricService();
```

```vue
<!-- src/components/BiometricLogin.vue -->
<template>
  <div class="biometric-login">
    <div class="biometric-option" v-if="isBiometricAvailable">
      <ion-button
        expand="block"
        fill="outline"
        @click="authenticateWithBiometric"
        :disabled="isAuthenticating"
        class="biometric-button"
      >
        <ion-icon :icon="fingerPrint" slot="start"></ion-icon>
        {{ biometricButtonText }}
      </ion-button>
      
      <ion-loading
        :is-open="isAuthenticating"
        message="생체 인증 중..."
      ></ion-loading>
    </div>
    
    <div class="biometric-setup" v-else-if="canSetupBiometric">
      <ion-card>
        <ion-card-header>
          <ion-card-title>생체 인증 설정</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>더 안전하고 편리한 로그인을 위해 생체 인증을 설정하세요.</p>
          <ion-button
            expand="block"
            @click="promptBiometricSetup"
          >
            생체 인증 설정하기
          </ion-button>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { biometricService } from '@/services/BiometricService';
import { useMessage } from '@/shared';
import { fingerPrint } from 'ionicons/icons';

const emit = defineEmits<{
  success: [];
  error: [string];
}>();

const isAuthenticating = ref(false);
const isBiometricAvailable = ref(false);
const supportedTypes = ref<string[]>([]);

const { alert, confirm } = useMessage();

const biometricButtonText = computed(() => {
  if (supportedTypes.value.length === 0) return '생체 인증으로 로그인';
  
  const typeTexts = supportedTypes.value.map(type => 
    biometricService.getBiometryTypeText(type as any)
  );
  
  return `${typeTexts.join('/')}로 로그인`;
});

const canSetupBiometric = computed(() => {
  // 생체 인증은 사용할 수 없지만 설정 가능한 경우
  return !isBiometricAvailable.value && supportedTypes.value.length > 0;
});

const authenticateWithBiometric = async () => {
  if (isAuthenticating.value) return;
  
  isAuthenticating.value = true;
  
  try {
    const success = await biometricService.authenticate();
    if (success) {
      emit('success');
    }
  } catch (error: any) {
    console.error('생체 인증 실패:', error);
    emit('error', error.message);
    
    // 사용자 취소가 아닌 경우에만 에러 메시지 표시
    if (!error.message.includes('취소')) {
      await alert(error.message);
    }
  } finally {
    isAuthenticating.value = false;
  }
};

const promptBiometricSetup = async () => {
  const confirmed = await confirm({
    title: '생체 인증 설정',
    text: '디바이스 설정에서 생체 인증을 활성화하시겠습니까?',
    buttons: [{
      text: '취소',
      handler: () => false
    }, {
      text: '설정으로 이동',
      handler: () => true
    }]
  });
  
  if (confirmed) {
    // 디바이스 설정 앱으로 이동하는 로직
    // (실제 구현은 플랫폼별 네이티브 코드 필요)
    await alert('디바이스 설정 > 보안에서 생체 인증을 설정해주세요.');
  }
};

onMounted(async () => {
  await biometricService.initialize();
  isBiometricAvailable.value = biometricService.isBiometricAvailable;
  supportedTypes.value = biometricService.supportedBiometryTypes.map(type => 
    biometricService.getBiometryTypeText(type)
  );
});
</script>

<style scoped lang="scss">
.biometric-login {
  margin-top: 24px;
  
  .biometric-button {
    --border-color: var(--ion-color-primary);
    --color: var(--ion-color-primary);
    margin-bottom: 16px;
    
    ion-icon {
      font-size: 20px;
    }
  }
  
  .biometric-setup {
    margin-top: 16px;
    
    ion-card {
      margin: 0;
      
      p {
        margin-bottom: 16px;
        color: var(--ion-color-medium);
      }
    }
  }
}
</style>
```

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Create initial setup environment configuration guide", "status": "completed", "id": "1"}, {"content": "Create design and style guide for UI components", "status": "completed", "id": "2"}, {"content": "Create publishing guide for HTML/CSS development", "status": "completed", "id": "3"}, {"content": "Define customization example requirements", "status": "completed", "id": "4"}, {"content": "Create live coding task samples", "status": "in_progress", "id": "5"}]