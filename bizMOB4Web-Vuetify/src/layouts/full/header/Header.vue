<template>
    <v-app-bar elevation="5" :priority="priority" height="64" color="primary" id="top">
        <!-- ---------------------------------------------- -->
        <!-- Logo part -->
        <!-- ---------------------------------------------- -->
        <Logo />

        <!-- ---------------------------------------------- -->
        <!-- Menu part -->
        <!-- ---------------------------------------------- -->
        <v-btn class="hidden-md-and-down " icon color="primary" variant="text"
            @click.stop="appStore.toggleMiniSidebar">
            <Menu2Icon size="25" />
        </v-btn>
        <v-btn class="hidden-lg-and-up" icon variant="text" @click.stop="appStore.toggleSidebar" size="small">
            <Menu2Icon size="25" />
        </v-btn>

        <!-- ---------------------------------------------- -->
        <!-- Search part -->
        <!-- ---------------------------------------------- -->
        <Searchbar />

        <v-spacer />

        <!-- ---------------------------------------------- -->
        <!---right part -->
        <!-- ---------------------------------------------- -->

        <!-- ---------------------------------------------- -->
        <!-- translate -->
        <!-- ---------------------------------------------- -->
        <LanguageDD />
        <!-- ---------------------------------------------- -->
        <!-- Notification -->
        <!-- ---------------------------------------------- -->
        <NotificationDD />
        <!-- ---------------------------------------------- -->
        <!-- User Profile -->
        <!-- ---------------------------------------------- -->
        <div class="ml-2">
            <ProfileDD />
        </div>
    </v-app-bar>

</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Menu2Icon } from 'vue-tabler-icons';
import { useAppStore } from '@/store/appStore';

import Logo from './Logo.vue';
import LanguageDD from './LanguageDD.vue';
import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';
import Searchbar from './Searchbar.vue';

const appStore = useAppStore();
const showSearch = ref(false);
const priority = ref(0);
function searchbox() {
    showSearch.value = !showSearch.value;
}
watch(priority, (newPriority) => {
    priority.value = newPriority;
});
</script>