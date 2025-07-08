<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <Card class="mt-6">
                <v-row>
                    <v-col>
                        <MvpInput v-model="reqMenuName" placeholder="화면그룹 명" />
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
                        <MvpSelect v-model="reqUseYn" :items="selectUseYnOpts" :placeholder="'선택해주세요'" itemValue="value"
                            itemTitle="title" :is-return-object="false" />
                    </v-col>
                    <v-col class="text-right">
                        <v-btn type="submit" class="submit-btn" flat color="info" @click="fetchScreenList">조회</v-btn>
                    </v-col>
                </v-row>
            </Card>
        </v-col>


        <v-col cols="12">
            <v-row class="mb-2">
                <v-col class="text-left">
                    <h4 class="mb-2">화면그룹 목록</h4>
                    <p>총 {{ screenList.length }}건 / 선택 {{ checkScreenCode.length }}건</p>
                </v-col>

                <v-col class="text-right mt-5">
                    <v-btn type="submit" class="submit-btn mr-5" flat color="primary" @click="openRegister">화면그룹 등록</v-btn>
                    <v-btn type="submit" class="submit-btn" flat color="secondary" @click="onDelete">삭제</v-btn>
                </v-col>
            </v-row>

            <v-data-table-server :headers="tableHeader" :items="screenList" :item-value="item => item" :hover="true"
                :items-length="checkScreenCode.length" show-select v-model="checkScreenCode" @click:row="openDetail"
                :height="400">

                <template v-slot:item.useYnName="{ item }">
                    {{ item.useYnName === 'Y' ? '사용' : '사용안함' }}
                </template>
                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="d-flex justify-space-between align-center mt-2 mb-3 pl-6">
                    </div>
                </template>

            </v-data-table-server>
        </v-col>

        <v-col cols="12">
            <v-row class="mb-2">
                <v-col class="text-left" col="3">
                    <h4 class="mb-2">화면 목록</h4>
                </v-col>
            </v-row>

            <Card>
                <v-row class="mb-2 align-center">
                    <v-col class="text-left">
                        <MvpInput v-model="reqScreenCode" placeholder="화면 명 / 화면ID" />
                    </v-col>
                    <v-col class="text-left">
                        <v-btn class="submit-btn" flat color="info">조회</v-btn>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn type="submit" class="submit-btn mr-5" flat color="primary" @click="openDetail">화면추가</v-btn>
                        <v-btn type="submit" class="submit-btn" flat color="secondary">삭제</v-btn>
                    </v-col>
                </v-row>


                <v-data-table-server :headers="tableHeader2" :items="pagedItems2" :item-value="item => item.screenId"
                    :hover="true" show-select v-model="selectItem2" @click:row="console.log('aa')">
                    <template v-slot:bottom>
                        <v-divider></v-divider>
                        <div class="d-flex justify-space-between align-center mt-2 mb-3 pl-6">
                        </div>
                    </template>
                </v-data-table-server>
            </Card>
        </v-col>
    </v-row>

    <template v-if="isRegisterOpen">
        <RegisterModal :title="'공지사항 등록'" @close="closeRegister" />
    </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNetwork } from '@/shared/composable/useNetwork';
import { useMessage } from '@/shared/composable/useMessage';
import Card from '@/components/Card.vue';
import { MvpInput, MvpSelect } from '@/components';
import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import RegisterModal from '@/views/screen/modal/RegisterModal.vue';

const { requestTr } = useNetwork();
const { alert } = useMessage();

/** 화면 Layout 정보 */
const page = ref({ title: '화면그룹' });
const breadcrumbs = ref([
    {
        text: 'ScreenGroup',
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
    { title: '화면그룹 코드', value: 'screenCode', align: 'center' },
    { title: '화면그룹명', value: 'menuName', align: 'center' },
    { title: '화면그룹 설명', value: 'screenName', align: 'center' },
    { title: '화면수', value: 'screenUrl', align: 'center' },
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

/** 테이블 관련 */
const tableHeader2: Json[] = [
    { title: '화면ID', value: 'screenId', align: 'center', width: '20%' },
    { title: '메뉴', value: 'menu', align: 'center', width: '20%' },
    { title: '화면명', value: 'screenName', align: 'center', width: '20%' },
    { title: '화면URL', value: 'screenUrl', align: 'center', width: '30%' },
    { title: '사용여부', value: 'isActive', align: 'center', width: '10%' },
];
/** 가상 데이터 생성 */
const pagedItems2 = [
    {
        screenId: '001',
        menu: 'screen',
        screenName: '시스템 점검 공지',
        screenUrl: '/admin/system-check',
        isActive: '사용',
    },
    {
        screenId: '002',
        menu: 'notice_list',
        screenName: '긴급 서버 점검 안내',
        screenUrl: '/user/server-maintenance',
        isActive: '사용',
    },
    {
        screenId: '003',
        menu: 'yjpark',
        screenName: '개발환경 개선 공지',
        screenUrl: '/dev/environment-update',
        isActive: '',
    }
];


onMounted(async () => {
    await fetchScreenList();
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
        screenDetail.value.screenCode = screenCode;
    }
    else {
        screenDetail.value = {};
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
    if (screenDetail.value.screenName == '') {
        await alert('화면 명을 작성해주세요');
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
