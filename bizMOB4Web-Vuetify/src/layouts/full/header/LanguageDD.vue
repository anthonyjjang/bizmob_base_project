<template>
    <!-- ---------------------------------------------- -->
    <!-- language DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn icon variant="text" color="primary" v-bind="props">
                <v-avatar size="22">
                    <img v-if="$i18n.locale === 'en'" :src="flag1" :alt="$i18n.locale" width="24" height="24" class="obj-cover" />
                    <img v-if="$i18n.locale === 'fr'" :src="flag4" :alt="$i18n.locale" width="24" height="24" class="obj-cover" />
                    <img v-if="$i18n.locale === 'ro'" :src="flag2" :alt="$i18n.locale" width="24" height="24" class="obj-cover" />
                    <img v-if="$i18n.locale === 'zh'" :src="flag3" :alt="$i18n.locale" width="24" height="24" class="obj-cover" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="200" elevation="10">
            <v-list class="theme-list">
                <v-list-item
                    v-for="(item, index) in languageDate"
                    :key="index"
                    color="primary"
                    :active="$i18n.locale == item.value"
                    class="d-flex align-center"
                    @click="() => ($i18n.locale = item.value)"
                >
                    <template v-slot:prepend>
                        <v-avatar size="22">
                            <img :src="item.avatar" :alt="item.avatar" width="22" height="22" class="obj-cover" />
                        </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-1 font-weight-regular">
                        {{ item.title }}
                        <span class="text-disabled text-subtitle-1 pl-2">({{ item.subtext }})</span>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import flag1 from '@/assets/images/icon-flag-en.svg';
import flag2 from '@/assets/images/icon-flag-ro.svg';
import flag3 from '@/assets/images/icon-flag-zh.svg';
import flag4 from '@/assets/images/icon-flag-fr.svg';

const languageDate = ref([
    { title: 'English', subtext: 'UK', value: 'en', avatar: flag1 },
    { title: 'français', subtext: 'French', value: 'fr', avatar: flag2 },
    { title: 'عربي', subtext: 'Arbic', value: 'ro', avatar: flag3 },
    { title: '中国人', subtext: 'Chinese', value: 'zh', avatar: flag4 }
]);
</script>