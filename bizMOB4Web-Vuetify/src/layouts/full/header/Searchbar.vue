<template>
    <!-- ---------------------------------------------- -->
    <!-- search1 -->
    <!-- ------------------------------------------------>
    <v-menu :close-on-content-click="false" class="search_popup">
        <template v-slot:activator="{ props }">
            <v-btn icon variant="text" class="custom-hover-primary ml-2" size="small" color="primary" v-bind="props">
                <SearchIcon size="22" />
            </v-btn>
        </template>
        <v-sheet width="360" elevation="10" rounded="md" >
            <div class="d-flex align-center justify-space-between pa-5">
                <v-text-field placeholder="Search" color="primary" density="compact" variant="outlined" hide-details></v-text-field>
            </div>
            <v-divider></v-divider>
            <h5 class="text-h5 mt-4 px-5 pb-4">Quick Page Links</h5>
            <perfect-scrollbar style="height: 380px">
                <v-list class="pt-0 pb-5" lines="two">
                    <v-list-item
                        :value="item"
                        v-for="(item, index) in searchData"
                        :key="index"
                        :to="item.href"
                        color="primary"
                        class="px-5 py-2"
                    >
                        <h6 class="text-subtitle-1 font-weight-medium mb-1">{{ item.title }}</h6>
                        <p class="text-subtitle-2 text-medium-emphasis">{{ item.href }}</p>
                    </v-list-item>
                </v-list>
            </perfect-scrollbar>
        </v-sheet>
    </v-menu>
</template>

<script setup>
import { ref } from 'vue';
import { SearchIcon } from 'vue-tabler-icons';

const searchData = ref([
    {
        title: 'Modern',
        href: '/dashboards/modern'
    },
    {
        title: 'eCommerce',
        href: '/dashboards/ecommerce'
    },
    {
        title: 'Contacts',
        href: '/apps/contacts'
    },
    {
        title: 'Shop',
        href: '/ecommerce/shop'
    },
    {
        title: 'Checkout',
        href: '/ecommerce/checkout'
    },
    {
        title: 'Chats',
        href: '/apps/chats'
    },
    {
        title: 'Notes',
        href: '/apps/notes'
    },
    {
        title: 'Pricing',
        href: '/pages/pricing'
    },
    {
        title: 'Account Setting',
        href: '/pages/account-settings'
    },
]);
</script>