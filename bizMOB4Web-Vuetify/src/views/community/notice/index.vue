<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <Panel :title="'공지사항 조회'" class="mt-6">
                <v-row>
                    <v-col cols="12" md="3">
                        <v-label class="mb-2 font-weight-medium">공지대상 사용자그룹</v-label>
                        <v-select
                            v-model="selectedGroup"
                            :items="groupList"
                            item-title="groupName"
                            item-value="groupId"
                            return-object
                            single-line
                            variant="outlined"
                            hide-details
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="5">
                        <v-label class="mb-2 font-weight-medium">제목</v-label>
                        <v-text-field v-model="keyword" variant="outlined" color="primary" hide-details="true"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">시작일</v-label>
                        <v-text-field v-model="startDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">종료일</v-label>
                        <v-text-field v-model="endDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                    </v-col>
                </v-row>
            </Panel>
            <div class="d-flex justify-sm-end ga-2">
                <v-btn type="submit" class="submit-btn mt-2" flat color="primary" @click="openRegister">등록</v-btn>
                <v-btn type="submit" class="submit-btn mt-2" flat color="secondary" @click="search">조회</v-btn>
            </div>
        </v-col>
        <v-col cols="12">
            <v-data-table-server
                class="border rounded-md"
                :headers="tableHeader"
                :items="pagedItems"
                :items-length="totalItems"
                :items-per-page="itemsPerPage"
                :hover="true"
                :loading="loading"
                @click:row="openDetail"
            >
                <template v-slot:[`item.index`]="{ index }">
                    {{ index + 1 }}
                </template>
                <template v-slot:[`item.title`]="{ item }">
                    <div class="d-flex align-center">
                        <UrgentIcon v-if="item.emergencyNoticeYn === 'Y'" size="20" color="red" class="mr-2" /> {{ item.title }}
                    </div>
                </template>
                <template v-slot:[`item.attachYn`]="{ value }">
                    <FileIcon v-if="value === 'Y'" size="18" />
                </template>
                <template v-slot:[`item.updateDate`]="{ value }">
                    {{ formatDate(value) }}
                </template>
                <template v-slot:[`item.activeYn`]="{ value }">
                    <v-chip :color="value === 'Y' ? '#13DEB9' : '#FA896B'">
                        {{ value === 'Y' ? '활성화' : '비활성화' }}
                    </v-chip>
                </template>
                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="d-flex justify-space-between align-center mt-2 mb-3 pl-6">
                        <div class="text-h6">
                            <span>총 {{ totalItems }} 개</span>
                        </div>
                        <div class="d-flex align-center">
                            <v-select
                                v-model="itemsPerPage"
                                :items="itemsPerPageOptions"
                                item-title="text"
                                item-value="value"
                                hide-details
                            ></v-select>
                            <v-pagination
                                class="d-flex align-center ml-4 elevation-0"
                                density="comfortable"
                                v-model="currentPage"
                                :length="totalPages"
                                total-visible="4"
                                @input="pageChange"
                            ></v-pagination>
                        </div>
                    </div>
                </template>
            </v-data-table-server>
        </v-col>
    </v-row>

    <template v-if="isRegisterOpen">
        <RegisterModal :title="'공지사항 등록'" @close="closeRegister" />
    </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { UrgentIcon, FileIcon } from 'vue-tabler-icons';
import { parse, format, subDays } from 'date-fns';
import { useAppStore } from '@/store/appStore';
import { useNetwork } from '@/shared/composable/useNetwork';

import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import Panel from '@/components/Panel.vue';
import RegisterModal from '@/views/community/modal/RegisterModal.vue';

const router = useRouter();
const appStore = useAppStore();
const { requestTr } = useNetwork();

/** 화면 Layout 정보 */
const page = ref({ title: '공지사항 관리' });
const breadcrumbs = ref([
    {
        text: 'Community',
        disabled: false,
        href: '/notice_list'
    },
    {
        text: 'Notice',
        disabled: true,
        href: '#'
    }
]);

/** 공지대상 관련 */
const groupList = ref<Json[]>([]);
const selectedGroup = ref<Json | null>(null);

/** 제목 */
const keyword = ref('');

/** 날짜 관련 */
const startDate = ref(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
const endDate = ref(format(new Date(), 'yyyy-MM-dd'));

const formatDate = (date: string) => {
    return format(parse(date, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');
};

/** 테이블 관련 */
const tableHeader: Json[] = [
    { title: '번호', value: 'index', align: 'center', width: '6%' },
    { title: '공지대상자 그룹', value: 'userGroupName', align: 'center', width: '17%' },
    { title: '제목', value: 'title', headerProps: { align: 'center' } },
    { title: '파일', value: 'attachYn', align: 'center', width: '8%' },
    { title: '작성자', value: 'authorName', align: 'center', width: '10%'},
    { title: '등록일시', value: 'updateDate', align: 'center', width: '10%' },
    { title: '활성화', value: 'activeYn', align: 'center', width: '8%' },
];

const itemsPerPageOptions: Json[] = [
    { text: '1개씩 보기', value: 1 },
    { text: '2개씩 보기', value: 2 },
    { text: '4개씩 보기', value: 4 },
    { text: '5개씩 보기', value: 5 },
    { text: '10개씩 보기', value: 10 },
];
const itemsPerPage = ref(10);
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = ref(0);
const pagedItems = ref([]);
const loading = ref(false);

const isRegisterOpen = ref<any>(false);

/** 코드 */
onActivated(async () => {
    // 문제가 있다.. 오픈시에도 호출 되기 때문에 오픈시는 제외해야 하는데.. 어떻게 하지?
    // const backData = appStore.backData() || null;

    // 메인 목록 상세 화면 존재
    // 메인에서 목록가면 초기화
    // 상세에서 삭제 후 넘어오면 갱신
    // 상세에서 그냥 돌아오면 갱신 X

    await fetchNoticeGroupList();
    await fetchItems(true);
});

// 페이지 변경
watch([itemsPerPage, currentPage], () => fetchItems());

// 검색
function search() {
    if (currentPage.value === 1) {
        fetchItems();
    }
    else {
        currentPage.value = 1;
    }
}

function pageChange(page: number) {
    console.log(page);
}

async function fetchNoticeGroupList() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP0201',
        body: {
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        groupList.value = body.groupList;
        selectedGroup.value = groupList.value[0];
    }
    else {
        groupList.value = [];
    }
}

// 데이터 조회
async function fetchItems(isLoading: boolean = false) {
    loading.value = true;

    try {
        const { body }: any = await requestTr({
            trcode: 'MVP0202',
            body: {
                page: String(currentPage.value), // 페이지 번호
                pageSize: String(itemsPerPage.value), // 페이지 항목 수
                userGroupId: selectedGroup.value?.groupId, // 사용자 그룹
                query: keyword.value, // 검색어
                startDate: startDate.value.replace(/-/g, ''), // 시작일
                endDate: endDate.value.replace(/-/g, ''), // 종료일
            },
            isMock: false,
            isLoading,
        });

        pagedItems.value = body.list;
        totalItems.value = Number(body.totalItems);
        totalPages.value = Number(body.totalPages);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
}

async function openRegister() {
    isRegisterOpen.value = true;
}

function closeRegister(msg: any) {
    isRegisterOpen.value = false;

    if (msg.result) {
        fetchItems();
    }
}

const openDetail = (e: Event, { item }: Json) => {
    router.push(`/notice_list/${item.noticeId}`);
};
</script>

<style>
.v-table .v-table__wrapper {
    border-radius: 7px 7px 0 0;
}

.v-table.v-table--hover > .v-table__wrapper > table > tbody > tr:hover > td::after {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>