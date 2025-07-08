<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <Card class="mt-6">
                <v-row @keydown.enter.prevent="$refs.submitBtn.$el.click()">
                    <v-col>
                        <MvpInput v-model="reqMenuName" placeholder="메뉴명" />
                    </v-col>
                    <v-col>
                        <MvpInput v-model="reqScreenCode" placeholder="화면ID" />
                    </v-col>
                    <v-col>
                        <MvpInput v-model="reqScreenName" placeholder="화면명" />
                    </v-col>
                    <v-col>
                        <MvpInput v-model="reqScreenURL" placeholder="화면URL" />
                    </v-col>
                    <v-col>
                        <MvpSelect 
                            v-model="reqUseYn" 
                            :items="selectUseYnOpts" 
                            :placeholder="'선택해주세요'" 
                            itemValue="value"
                            itemTitle="title" 
                            :is-return-object="false" />
                    </v-col>
                    <v-col class="text-right">
                        <v-btn ref="submitBtn" type="submit" class="submit-btn" flat color="info" @click="fetchScreenList">조회</v-btn>
                    </v-col>
                </v-row>
            </Card>
        </v-col>


        <v-col cols="12">
            <v-row class="mb-2">
                <v-col class="text-left">
                    <h4 class="mb-2">화면목록</h4>
                    <p>총 {{ screenList.length }}건 / 선택 {{ checkScreenCode.length }}건</p>
                </v-col>

                <v-col class="text-right mt-5">
                    <v-btn type="submit" class="submit-btn mr-5" flat color="primary" @click="openRegister">화면등록</v-btn>
                    <v-btn type="submit" class="submit-btn" flat color="secondary" @click="onDelete">삭제</v-btn>
                </v-col>
            </v-row>

            <perfect-scrollbar style="height: 400px; width: 100%; overflow-x: auto;">
                <v-data-table-server 
                    :headers="tableHeader" 
                    :items="screenList" 
                    :item-value="item => item"
                    :hover="true"
                    :items-length="checkScreenCode.length" 
                    show-select 
                    v-model="checkScreenCode" 
                    @click:row="openDetail"
                    style="min-width: 90vw;"
                >
                <template v-slot:item.useYnName="{ item }">
                    {{ item.useYnName === 'Y' ? '사용' : '미사용' }}
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="d-flex justify-space-between align-center mt-2 mb-3 pl-6"></div>
                </template>
                </v-data-table-server>
            </perfect-scrollbar>

        </v-col>

        <v-col cols="12" v-if="Object.keys(screenDetail).length > 0">
            <v-row class="mb-2">
                <v-col class="text-left">
                    <h4 class="mt-10">화면 상세정보</h4>
                </v-col>
                <v-col class="text-right mt-5">
                    <v-btn type="submit" class="submit-btn" flat color="primary" @click="onUpdate">저장</v-btn>
                </v-col>
            </v-row>

            <Card class="mt-6">
                <v-row>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">화면코드</v-label>
                        <MvpInput v-model="screenDetail.screenCode" placeholder="화면코드" disabled />
                    </v-col>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">메뉴레벨</v-label>
                        <MvpSelect 
                            v-model="screenDetail.menuLevel" 
                            :items="menuLevelList" 
                            itemValue="parentMenuLevel"
                            :placeholder="'메뉴레벨을 선택해주세요.'" 
                            itemTitle="parentMenuLevelName" 
                            :is-return-object="false" />
                    </v-col>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">메뉴</v-label>
                        <MvpSelect 
                            v-model="screenDetail.menuCode" 
                            :items="menuList" 
                            :placeholder="'메뉴를 선택해주세요.'"
                            itemValue="parentMenuCode" 
                            itemTitle="locationFullName" 
                            :is-return-object="false" />
                    </v-col>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">화면 명</v-label>
                        <MvpInput v-model="screenDetail.screenName" placeholder="화면 명" />
                    </v-col>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">화면 URL</v-label>
                        <MvpInput v-model="screenDetail.screenUrl" placeholder="화면URL" />
                    </v-col>
                    <v-col cols="6">
                        <v-label class="mb-2 font-weight-medium">화면 설명</v-label>
                        <MvpInput v-model="screenDetail.screenDescription" placeholder="화면 설명" />
                    </v-col>
                    <v-col cols="12">
                        <v-label class="mb-2 font-weight-medium">사용여부</v-label>
                        <v-switch 
                            v-model="screenDetail.useYn" 
                            :true-value="'Y'" 
                            :false-value="'N'" inset
                            color="primary"></v-switch>
                    </v-col>
                </v-row>
            </Card>
        </v-col>
    </v-row>

    <template v-if="isRegisterOpen">
        <RegisterModal :title="'화면등록'" :menulevel="menuLevelList" @close="closeRegister" />
    </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useNetwork } from '@/shared/composable/useNetwork';
import { useMessage } from '@/shared/composable/useMessage';
import Card from '@/components/Card.vue';
import { MvpInput, MvpSelect } from '@/components';
import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import RegisterModal from '@/views/screen/modal/RegisterModal.vue';

const { requestTr } = useNetwork();
const { alert } = useMessage();

/** 화면 Layout 정보 */
const page = ref({ title: '화면관리' });
const breadcrumbs = ref([
    {
        text: 'Screen',
        disabled: false,
        href: '/screen'
    },
    {
        text: 'management',
        disabled: true,
        href: '#'
    }
]);

/** 모달창 관련 */
const isRegisterOpen = ref<any>(false);

/** 화면리스트 조회 */
const reqMenuName = ref<string>('');            //메뉴명
const reqScreenCode = ref<string>('');          //화면ID
const reqScreenName = ref<string>('');          //화면명
const reqScreenURL = ref<string>('');           //화면URL
const reqUseYn = ref<string>('');               //사용여부

/** 화면리스트 테이블 헤더 */
const tableHeader: Json[] = [
    { title: '화면ID', value: 'screenCode', align: 'center' },
    { title: '메뉴', value: 'menuName', align: 'center' },
    { title: '화면명', value: 'screenName', align: 'center' },
    { title: '화면URL', value: 'screenUrl', align: 'center' },
    { title: '화면 설명', value: 'screenDescription', align: 'center' },
    { title: '사용여부', value: 'useYnName', align: 'center' },
];

/** 화면리스트 테이블 헤더 사용여부 */
const selectUseYnOpts = ref<Json[]>([
    { title: '전체', value: '' },
    { title: '사용', value: 'Y' },
    { title: '미사용', value: 'N' }
]);

const screenList = ref<Json[]>([]);             //화면리스트 
const checkScreenCode = ref<Json[]>([]);        //체크한 화면

/** 화면 상세 */
const screenDetail = ref<{}>({});               //화면 상세정보
const screenSelmenuCode = ref<string>('');      //화면 상세정보 메뉴코드

/** 메뉴레벨 */
const menuLevelList = ref<Json[]>([]);

/** 메뉴 리스트 */
const menuList = ref<Json[]>([]);

onMounted(async () => {
    await fetchScreenList();
    fetchMenuLevel();
});


//화면 조회
async function fetchScreenList() {
    checkScreenCode.value = [];
    const { result, body }: any = await requestTr({
        trcode: 'MVP9200',
        body: {
            menuName: reqMenuName.value || '',
            screenUrl: reqScreenURL.value || '',
            screenCode: reqScreenCode.value || '',
            screenName: reqScreenName.value || '',
            useYn: reqUseYn.value || ''
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        screenList.value = body.screenList;
    }
    else {
        screenList.value = [];
    }
}

// 화면상세조회
async function fetchScreenDetail(screenCode: String) {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9202',
        body: {
            'screenCode': screenCode,
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        screenDetail.value = body;
        screenSelmenuCode.value = body.menuCode;
        screenDetail.value.screenCode = screenCode;
    }
    else {
        screenDetail.value = {};
    }
}

//메뉴 레벨
async function fetchMenuLevel() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9103',
        body: {},
        isMock: false,
        isLoading: true,
    });

    if (result) {
        menuLevelList.value = body.parentMenuLevelList;
    }
    else {
        menuLevelList.value = [];
    }
}

watch(() => screenDetail.value.menuLevel, (newVal) => {
    fetchMenuList();
});


//메뉴 리스트
async function fetchMenuList() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9104',
        body: {
            parentMenuLevel : screenDetail.value.menuLevel
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        menuList.value = body.parentMenuList;

        const isMatch = menuList.value.some(item => item.parentMenuCode === screenSelmenuCode.value);
        screenDetail.value.menuCode = screenSelmenuCode.value;

        if (!isMatch) {
            screenDetail.value.menuCode = '';
        }
        else {
            screenDetail.value.menuCode = screenSelmenuCode.value;
        }
    }
    else {
        menuList.value = [];
    }
}

// 삭제
async function onDelete() {
    const result = await alert({
        message: '삭제하시겠습니까?',
        buttons: [
            { text: '취소', value: false },
            { text: '삭제', value: true }
        ]
    });

    if (result) {
        await deleteScreenList();

    }
}

async function deleteScreenList() {
    if (checkScreenCode.value.length === 0) {
        await alert('삭제할 화면을 선택해 주세요');
        return;
    }
    const screenList = checkScreenCode.value.map(item => ({ 'screenCode': item.screenCode }));

    const { result }: any = await requestTr({
        trcode: 'MVP9201',
        body: {
            screenList: screenList,
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return fetchScreenList();
    }
    else {
        return null;
    }
}

async function onUpdate() {
    const result = await alert({
        message: '저장하시겠습니까?',
        buttons: [
            { text: '취소', value: false },
            { text: '저장', value: true }
        ]
    });

    if (result) {
        await updateScreenList();

    }
}

async function updateScreenList() {
    if (screenDetail.value.screenName === '') {
        await alert('화면 명을 작성해주세요');
        return;
    }
    else if(screenDetail.value.menuCode === '') {
        await alert('메뉴를 선택해주세요');
        return;
    }

    const { result }: any = await requestTr({
        trcode: 'MVP9204',
        body: {
            menuLevel: screenDetail.value.menuLevel,
            menuCode: screenDetail.value.menuCode,
            screenUrl: screenDetail.value.screenUrl,
            menuName: screenDetail.value.menuName,
            screenDescription: screenDetail.value.screenDescription,
            screenName: screenDetail.value.screenName,
            useYn: screenDetail.value.useYn,
            screenCode: screenDetail.value.screenCode
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        screenDetail.value = {};
        screenSelmenuCode.value = '';
        return fetchScreenList();
    }
    else {
        return null;
    }
}

// 화면 상세정보
const openDetail = (e: Event, { item }: Json) => {
    fetchScreenDetail(item.screenCode);
};


/** modal open */
async function openRegister() {
    isRegisterOpen.value = true;
}

/** modal close */
function closeRegister(msg: any) {
    isRegisterOpen.value = false;

    if (msg.result) {
        fetchScreenList();
    }
}
</script>
