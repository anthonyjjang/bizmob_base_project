<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <div>
                Modal Template
            </div>
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div>
                Contents
                <div><button @click="closeModal">Back</button></div>
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
import { PropType, onMounted } from 'vue';
import { modalController } from '@ionic/vue';

// 전달받은 데이터
const props = defineProps({
    string: { type: String, default: '' },
    json: { type: Object as PropType<Json>, default: {} as Json },
    array: { type: Array as PropType<string[]>, default: [] as string[] },
});

onMounted(() => {
    console.log(props.string); // foo
    console.log(props.json); // {x: 'y'}
    console.log(props.array); // ['a', 'b']
});

const closeModal = () => {
    // modal을 close 하면서 data, role 전달
    modalController.dismiss({ foo: 'foo' }, 'ok');
};
</script>