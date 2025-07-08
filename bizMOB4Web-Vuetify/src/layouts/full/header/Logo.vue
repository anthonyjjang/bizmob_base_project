<template>
    <v-locale-provider>
        <div class="pt-2 d-sm-flex d-none">
            <div class="logo">
                <RouterLink to="/">
                    <img :src="MaterialLogo" alt="home" />
                </RouterLink>
            </div>
        </div>
        <div class="pt-2 pr-2 d-sm-none d-flex">
            <div class="logo">
                <RouterLink to="/">
                    <img :src="MaterialLogoIcon" alt="home" />
                </RouterLink>
            </div>
        </div>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MaterialLogo from '@/assets/images/material_logo.svg';
import MaterialLogoIcon from '@/assets/images/material_logo-icon.svg';
</script>