<template>
    <!-- class="dialog-mw" -->
    <v-dialog :model-value="true" transition="dialog-right-transition" content-class="dialog-content" fullscreen :style="{
        height: '100vh',
        width: '36%',
        justifySelf: 'self-end',
        margin: '0',
    }" @after-leave="emit('close', { message: '닫기' })">
        <v-card height="100vh" class="overflow-auto rounded-e-0">
            <v-container>
                <v-card-title class="pa-5">
                    <span class="text-h5">{{ props.title }}</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">화면코드</v-label>
                            <MvpInput placeholder="화면코드" v-model="screenCode" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">메뉴레벨</v-label>
                            <MvpSelect 
                                v-model="menuLevel" 
                                :items="props.menulevel" 
                                itemValue="parentMenuLevel"
                                :placeholder="'메뉴레벨을 선택해주세요.'" 
                                itemTitle="parentMenuLevelName" 
                                :is-return-object="false" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">메뉴</v-label>
                            <MvpSelect 
                                v-model="menuCode"
                                :items="menuList" 
                                :placeholder="'메뉴를 선택해주세요'" 
                                itemValue="parentMenuCode" 
                                itemTitle="locationFullName"
                                :is-return-object="false" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">화면 명</v-label>
                            <MvpInput placeholder="화면 명" v-model="screenName" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">화면 URL</v-label>
                            <MvpInput placeholder="화면 URL" v-model="screenUrl" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">화면 설명</v-label>
                            <MvpInput placeholder="화면 설명" v-model="screenDescription" />
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">사용여부</v-label>
                            <v-switch 
                                v-model="useYn" 
                                :true-value="'Y'" 
                                :false-value="'N'" 
                                inset
                                color="primary"></v-switch>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider class="mt-4"></v-divider>
                <div class="d-flex justify-end mt-4">
                    <v-btn flat color="error" variant="outlined" @click="emit('close', { result: false })">취소</v-btn>
                    <v-btn flat color="primary" class="ml-4" @click="insertScreen">저장</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { MvpInput, MvpSelect } from '@/components';
import { useNetwork } from '@/shared/composable/useNetwork';
import { useMessage } from '@/shared/composable/useMessage';

const { requestTr } = useNetwork();
const { alert } = useMessage();
const emit = defineEmits([
    'close'
]);
const props = defineProps({
    title: { type: String as PropType<string> },
    menulevel: { type: Array as PropType<string> }
});

const screenCode = ref<string>('');          //화면코드
const menuLevel = ref(null);                 //메뉴레벨
const menuList = ref<Json[]>([]);            //메뉴리스트
const menuCode = ref<string>('');            //메뉴코드
const screenName = ref<string>('');          //화면명
const screenUrl = ref<string>('');           //화면URL
const screenDescription = ref<string>('');   //화면설명
const useYn = ref('Y');           


async function insertScreen() {
    const menuName = menuList.value.find((item) => item.parentMenuCode === menuCode.value)?.parentMenuName || '';

    const inputs = [
        { value: screenCode.value, message: '화면코드를 작성해주세요' },
        { value: menuLevel.value, message: '메뉴레벨을 작성해주세요' },
        { value: menuCode.value, message: '메뉴를 선택해주세요' },
        { value: screenName.value, message: '화면 명을 작성해주세요' },
        { value: screenUrl.value, message: '화면 URL을 작성해주세요' },
    ];

    for (const { value, message } of inputs) {
        if (!value) {
            await alert(message);
            return;
        }
    }

    const { result }: any = await requestTr({
        trcode: 'MVP9203',
        body: {
            menuCode: menuCode.value,
            menuLevel: menuLevel.value,
            menuName: menuName,
            screenCode: screenCode.value,
            screenDescription: screenDescription.value,
            screenName: screenName.value,
            screenUrl: screenUrl.value,
            useYn: useYn.value,
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return emit('close', { result: true });
    }
    else {
        return null;
    }
}

watch(() => menuLevel.value, (newVal) => {
    fetchMenuList();
});

//메뉴 리스트
async function fetchMenuList() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9104',
        body: {
            parentMenuLevel : menuLevel.value
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        menuList.value = body.parentMenuList;
        menuCode.value = menuList.value[0].parentMenuCode;
    }
    else {
        menuList.value = [];
    }
}

</script>

<style lang="scss">
.editor-menubar {
    border: 1px solid rgba(var(--v-border-color)) !important;
}

.editor-content>div {
    min-height: 300px;
    border: 1px solid rgba(var(--v-border-color)) !important;
}
</style>
