<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <AppHeader
                title="메인"
                :rightButtons="['menu']"
            />
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div class="button-group column">
                <button id="open-modal" class="button button-line" @click="openPage('BOARD0100')">Board Open</button>
                <button id="open-modal" class="button button-line" @click="openPage('MAIN0200')">Sandbox Open</button>
                <button id="open-modal" class="button button-line" @click="alert('Alert Test')">Alert Test</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from '@ionic/vue';
import { useNavigate, useMessage } from '@/shared';

const { openPage, isBackNavigation } = useNavigate();
const { alert } = useMessage();

// 페이지 진입시 호출 라이플 사이클 1 (재진입시에도 호출됨)
onIonViewWillEnter(() => {
    // 페이지 진입시 onMounted 보다 먼저 호출되는 ionic 라이플 사이클
    // 화면 back으로 진입해도 호출되기 때문에 사용시 주의가 필요
    // useNavigate의 isBackNavigation() 함수를 통해서 back으로 진입했는지 확인 가능
    console.log('ionViewWillEnter');
    console.log('>> 화면 Back 진입 여부', isBackNavigation());
});

// 페이지 진입시 호출 라이플 사이클 2 (단, 재진입시 호출되지 않음)
onMounted(() => {
    // 최초에 페이지 생성시 호출되는 라이플 사이클
    // 재진입시에는 호출되지 않음
    console.log('mounted');
});

// 페이지 진입시 호출 라이플 사이클 3 (재진입시에도 호출됨)
onIonViewDidEnter(() => {
    // 페이지 진입시 onMounted 후에 호출되는 ionic 라이플 사이클
    // 화면 back으로 진입해도 호출되기 때문에 사용시 주의가 필요
    console.log('ionViewDidEnter');
});


// 페이지 Leave 1
onIonViewWillLeave(() => {
    console.log('ionViewWillLeave');
});

// 페이지 Leave 2
onIonViewDidLeave(() => {
    console.log('ionViewDidLeave');
});
</script>

<style scoped lang="scss">
.button-group {
    padding: 0 16px 24px;
}
</style>
