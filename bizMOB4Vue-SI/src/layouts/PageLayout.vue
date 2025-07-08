<template>
    <ion-page>
        <ion-router-outlet></ion-router-outlet>
    </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from '@ionic/vue';
import { IonRouterOutlet } from '@ionic/vue';

// 페이지 Enter 1
onIonViewWillEnter(() => {
    console.log('PageLayout ionViewWillEnter');
});

// 페이지 Enter 2
onMounted(() => {
    console.log('PageLayout mounted');
});

// 페이지 Enter 3
onIonViewDidEnter(() => {
    console.log('PageLayout ionViewDidEnter');
});


// 페이지 Leave 1
onIonViewWillLeave(() => {
    console.log('PageLayout ionViewWillLeave');
});

// 페이지 Leave 2
onIonViewDidLeave(() => {
    console.log('PageLayout ionViewDidLeave');
});
</script>