<template>
    <v-navigation-drawer left v-model="appStore.isSidebar" elevation="0" rail-width="75"
        app class="leftSidebar" :rail="appStore.isMiniSidebar" expand-on-hover width="256">

        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="scrollnavbar">
            <div class="profile">
                <div class="profile-pic profile-pic py-7 px-3">
                    <v-avatar size="45">
                        <img :src="userProfileImg" width="50" :alt="userName" />
                    </v-avatar>
                </div>
                <div class="profile-name d-flex align-center px-3">
                    <h5 class="text-white font-weight-medium">{{ userName }}</h5>
                    <div class="ml-auto profile-logout">
                        <v-btn variant="text" icon rounded="md" color="white" @click="logout">
                            <PowerIcon size="22"/>
                            <v-tooltip activator="parent" location="top">Logout</v-tooltip>
                        </v-btn>
                    </div>
                </div>
            </div>
            <v-list class="py-6 px-4">
                <!---Menu Loop -->
                <template v-for="(item, i) in menus" :key="i">
                    <!---Item Sub Header -->
                    <template v-if="item.menuLvl === '1'">
                        <v-list-subheader  class="smallCap text-uppercase text-subtitle-2 mt-5 d-flex align-items-center">
                            <span class="mini-icon"><DotsIcon size="16" stroke-width="1.5" class="iconClass" /></span>
                            <span class="mini-text">{{ $t(item.menuName) }}</span>
                        </v-list-subheader>
                    </template>
                    <template v-for="(menu, j) in item.children" :key="j">
                        <!---If Has Child -->
                        <NavCollapse class="leftPadding" :item="menu" :level="0" v-if="menu.children?.length" />
                        <!---Single Item-->
                        <NavItem :item="menu" v-else class="leftPadding" />
                        <!---End Single Item-->
                    </template>
                </template>
            </v-list>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/store/appStore';
import { useMenuStore } from '@/store/menuStore';
import { useUserStore } from '@/store/userStore';
import { PowerIcon, ChartPieIcon, Message2Icon, CircleDotIcon, DotsIcon } from 'vue-tabler-icons';

import NavItem from './NavItem.vue';
import NavCollapse from './NavCollapse.vue';

const appStore = useAppStore();
const menuStore = useMenuStore();
const userStore = useUserStore();

const menus = ref(menuStore.menuTree(true));
const userName = ref(userStore.userName);
const userProfileImg = ref(userStore.userProfileImg);

function logout() {
    userStore.logout();
}
</script>

<style scoped lang="scss">
.profile {
    background: url('@/assets/images/@bg-user-info.jpg') no-repeat;
}
</style>