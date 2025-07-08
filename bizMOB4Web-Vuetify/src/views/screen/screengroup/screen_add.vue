<template>
    <v-row>
        <v-col cols="12">
            <v-row class="mb-2 mt-6">
                    <v-col class="text-left">
                        <h4 class="mb-2">화면그룹</h4>
                    </v-col>
                </v-row>
            <Card>
                <v-row class="mb-2">
                    <v-col col="6">
                        <v-label class="mb-2 font-weight-medium">화면그룹 코드</v-label>
                        <v-text-field label="화면 명 / 화면ID" outlined color="primary" hide-details
                            class="mr-2"></v-text-field>
                    </v-col>
                    <v-col col="6">
                        <v-label class="mb-2 font-weight-medium">화면그룹 코드</v-label>
                        <v-text-field label="화면 명 / 화면ID" outlined color="primary" hide-details
                            class="mr-2"></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="mb-2">
                    <v-col col="12">
                        <v-label class="mb-2 font-weight-medium">화면그룹 코드</v-label>
                        <v-text-field label="화면 명 / 화면ID" outlined color="primary" hide-details
                            class="mr-2"></v-text-field>
                    </v-col>
                </v-row>
            </Card>
        </v-col>

        <v-col cols="12" class="text-right">
            <v-btn class="submit-btn" flat color="info">저장</v-btn>
        </v-col>

        <v-col cols="6">
            <v-row class="mb-2">
                <v-col class="text-left" col="3">
                    <h4 class="mb-2">추가 안된 화면</h4>
                    <p>총 0건 / 선택 0건</p>
                </v-col>
            </v-row>

            <Card>
                <v-row class="mb-2 align-center">
                    <v-col class="text-left">
                        <v-text-field label="화면 명 / 화면ID" outlined color="primary" hide-details
                            class="mr-2"></v-text-field>
                    </v-col>
                    <v-col class="text-left">
                        <v-btn class="submit-btn" flat color="info">조회</v-btn>
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

        <v-col cols="6">
            <v-row class="mb-2">
                <v-col class="text-left" col="3">
                    <h4 class="mb-2">추가된 화면</h4>
                    <p>총 0건 / 선택 0건</p>
                </v-col>
            </v-row>

            <Card>
                <v-row class="mb-2 align-center">
                    <v-col class="text-left">
                        <v-text-field label="화면 명 / 화면ID" outlined color="primary" hide-details
                            class="mr-2"></v-text-field>
                    </v-col>
                    <v-col class="text-left">
                        <v-btn class="submit-btn" flat color="info">조회</v-btn>
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
import { ref } from 'vue';
import Card from '@/components/Card.vue';
import RegisterModal from '@/views/screen/modal/RegisterModal.vue';

const page = ref({ title: '화면그룹' });
const breadcrumbs = ref([
    {
        text: 'Screen_group',
        disabled: false,
        href: '/screen_group'
    },
    {
        text: 'screen',
        disabled: true,
        href: '#'
    }
]);

const isRegisterOpen = ref<any>(false);
const selectItem = ref<any>(false);
const selectItem2 = ref<any>(false);


/** 가상 데이터 생성 */
const pagedItems = [
    {
        screenId: '001',
        menu: 'user_management',
        screenName: '사용자 관리',
        screenUrl: '/admin/user-management',
        screenDescription: '사용자 정보를 관리하는 화면',
        screenCount: 5, // 화면 수 추가
        isActive: '사용',
    },
    {
        screenId: '002',
        menu: 'reporting',
        screenName: '보고서 생성',
        screenUrl: '/admin/report-generator',
        screenDescription: '보고서를 생성하는 화면',
        screenCount: 3, // 화면 수 추가
        isActive: '사용',
    },
    {
        screenId: '003',
        menu: 'settings',
        screenName: '설정',
        screenUrl: '/admin/settings',
        screenDescription: '시스템 설정을 관리하는 화면',
        screenCount: 2, // 화면 수 추가
        isActive: '사용',
    },
    {
        screenId: '004',
        menu: 'dashboard',
        screenName: '대시보드',
        screenUrl: '/admin/dashboard',
        screenDescription: '시스템의 전반적인 상태를 보여주는 대시보드',
        screenCount: 4, // 화면 수 추가
        isActive: '사용',
    },
    {
        screenId: '005',
        menu: 'notifications',
        screenName: '알림',
        screenUrl: '/admin/notifications',
        screenDescription: '사용자에게 알림을 제공하는 화면',
        screenCount: 1, // 화면 수 추가
        isActive: '미사용',
    }
];


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


async function openRegister() {
    isRegisterOpen.value = true;
}

function closeRegister(msg: any) {
    isRegisterOpen.value = false;

    if (msg.result) {
        // fetchItems();
    }
}
</script>
