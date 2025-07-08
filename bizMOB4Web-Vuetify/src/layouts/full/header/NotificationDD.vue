<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" class="notification_popup">
        <template v-slot:activator="{ props }">
            <v-btn icon class="mx-1" color="primary" variant="flat" v-bind="props">
                    <v-badge dot color="error">
                        <v-icon size="24">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pb-4 pt-6">
                <div class="d-flex align-center justify-space-between">
                    <h6 class="text-h5">Notifications</h6>
                    <v-chip color="primary" variant="flat" size="small" class="text-white">5 New</v-chip>
                </div>
            </div>
            <perfect-scrollbar style="height: 400px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in notificationData" :key="item.title" :value="item" color="primary" class="py-4 px-8">
                        <template v-slot:prepend>
                            <v-avatar size="48" >
                                <v-img :src="item.avatar" width="48" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-subtitle-1 font-weight-semibold mb-1">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-list>
            </perfect-scrollbar>
            <div class="py-4 px-6 text-center">
                <v-btn color="primary" variant="outlined" block>See all Notifications</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import user1 from '@/assets/images/user-1.jpg';
import user2 from '@/assets/images/user-2.jpg';
import user3 from '@/assets/images/user-3.jpg';
import user4 from '@/assets/images/user-4.jpg';
import user5 from '@/assets/images/user-5.jpg';

const notificationData = ref([
    {
        avatar: user1,
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him'
    },
    {
        avatar: user2,
        title: 'New message received',
        subtitle: 'Salma sent you new message'
    },
    {
        avatar: user3,
        title: 'New Payment received',
        subtitle: 'Check your earnings'
    },
    {
        avatar: user4,
        title: 'Jolly completed tasks',
        subtitle: 'Assign her new tasks'
    },
    {
        avatar: user5,
        title: 'New Payment received',
        subtitle: 'Check your earnings'
    },
    {
        avatar: user1,
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him'
    }
]);
</script>
