<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" class="profile_popup">
        <template v-slot:activator="{ props }">
            <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img :src="userProfileImg" width="35" :alt="userName" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pt-6">
                <h6 class="text-h5 font-weight-medium">User Profile</h6>
                <div class="d-flex align-center mt-4 pb-6">
                    <v-avatar size="80">
                        <img :src="userProfileImg" width="80" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-h6 mb-n1">{{ userName }}</h6>
                        <span class="text-subtitle-1 font-weight-regular textSecondary">{{ userNick }}</span>
                        <div class="d-flex align-center mt-1">
                            <MailIcon size="18" stroke-width="1.5" />
                            <span class="text-subtitle-1 font-weight-regular textSecondary ml-2">{{ userEmail }}</span>
                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
            </div>
            <perfect-scrollbar style="height: calc(100vh - 240px); max-height: 240px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in profileData" :key="item.title" class="py-4 px-8 custom-text-primary" :to="item.href">
                        <template v-slot:prepend>
                            <v-avatar size="48" color="lightprimary"  rounded="md">
                                <v-img :src="item.avatar" width="24" height="24" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-subtitle-1 font-weight-semibold mb-2 custom-title">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                    </v-list-item>
                </v-list>
            </perfect-scrollbar>
            <div class="px-8 py-3">
                <div class="bg-lightprimary rounded-md pa-5 overflow-hidden position-relative">
                    <h5 class="text-h6">
                        Unlimited<br />
                        Access
                    </h5>
                    <v-btn variant="flat" color="primary" class="mt-3">Upgrade</v-btn>
                    <img src="@/assets/images/unlimited-bg.png" alt="bg-img" class="right-pos-img" />
                </div>
            </div>
            <div class="pt-4 pb-6 px-8 text-center">
                <v-btn color="primary" variant="outlined" block @click="logout">Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MailIcon } from 'vue-tabler-icons';
import { useUserStore } from '@/store/userStore';

import proUser1 from '@/assets/images/icon-account.svg';
import proUser2 from '@/assets/images/icon-inbox.svg';
import proUser3 from '@/assets/images/icon-tasks.svg';

const profileData = ref([
    {
        avatar: proUser1,
        title: 'My Profile',
        subtitle: 'Account settings',
        href: '/apps/profile'
    },
    {
        avatar: proUser2,
        title: 'My Inbox',
        subtitle: 'Messages & Emails',
        href: '/apps/inbox'
    },
    {
        avatar: proUser3,
        title: 'My Tasks',
        subtitle: 'To-do and Daily tasks',
        href: '/apps/task'
    }
]);

const userStore = useUserStore();

const userName = ref(userStore.userName);
const userNick = ref(userStore.userNick);
const userEmail = ref(userStore.userEmail);
const userProfileImg = ref(userStore.userProfileImg);

function logout() {
    userStore.logout();
}
</script>