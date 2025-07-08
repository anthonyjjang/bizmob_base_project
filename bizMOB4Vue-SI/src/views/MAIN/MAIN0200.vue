<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <AppHeader
                title="Sandbox"
                :leftButtons="['back']"
                :rightButtons="['menu']"
            />
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div class="button-group column">
                <button id="open-modal" class="button button-line" @click="onButton01">Button</button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
const onButton01 = () => {
    console.log('Button Clicked');
};
</script>

<style scoped lang="scss">
.button-group {
    padding: 0 16px 24px;
}
</style>
