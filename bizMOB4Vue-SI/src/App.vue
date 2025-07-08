<template>
    <ion-app>
        <!-- Loading Progress Component -->
        <AppLoading />

        <!-- 메뉴 Component -->
        <AppMenu>
            <!-- 메뉴 화면 -->
            <MENU0100 />
        </AppMenu>

        <!-- Ion Router -->
        <ion-router-outlet id="ion-router-outlet" />
    </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet, modalController } from '@ionic/vue';

import AppLoading from '@/components/AppLoading.vue';
import AppMenu from '@/components/AppMenu.vue';
import Event from '@/bizMOB/Xross/Event';

import MENU0100 from '@/views/MENU/MENU0100.vue';

onMounted(async () => {
    console.log('App onMounted');

    Event.setEvent('ready', init);
});

// App, Web initialization code here
const init = () => {
    console.log('App initialized');
};

// modal handle 클릭시 modal close 처리
window.document.querySelector('body')?.addEventListener('click', (e: any) => {
    if (e.target.classList.contains('modal-sheet') && e.target.classList.contains('show-modal')) {
        modalController.dismiss(null, 'cancel'); // Modal 닫기
    }
});
</script>
