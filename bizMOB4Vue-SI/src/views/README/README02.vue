<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <div>
                Page Template
            </div>
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div>
                Contents
                <div><button @click="closePage">Back</button></div>
            </div>
        </ion-content>

        <!-- Ionic Footer Tag -->
        <ion-footer>
            <div>
                Footer
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const query = route.query;

onMounted(() => console.log(query));

const closePage = () => {
    router.back();
};
</script>