import { DefineComponent } from 'vue';

// 확장할 때 기존 타입을 오버라이드 하지 않고 추가하는 방법
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        IonPage: DefineComponent<unknown, unknown, unknown>;
        IonHeader: DefineComponent<unknown, unknown, unknown>;
        IonContent: DefineComponent<unknown, unknown, unknown>;
        IonFooter: DefineComponent<unknown, unknown, unknown>;
        IonModal: DefineComponent<unknown, unknown, unknown>;

        AppHeader: DefineComponent<unknown, unknown, unknown>;
    }
}

// 이 코드는 모든 TypeScript 파일에서 Vue 컴포넌트를 자동으로 인식할 수 있게 해줍니다.
export {};