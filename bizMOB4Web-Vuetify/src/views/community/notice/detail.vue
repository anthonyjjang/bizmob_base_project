<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row v-if="isDataFetch">
        <v-col cols="12">
            <Card class="mt-6">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">등록자</v-label>
                        <v-text-field :value="detail.creatorName" variant="outlined" color="primary" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">등록일자</v-label>
                        <v-text-field :value="formatDate(detail.createDate)" variant="outlined" color="primary" type="date" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">수정자</v-label>
                        <v-text-field :value="detail.updaterName" variant="outlined" color="primary" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">수정일자</v-label>
                        <v-text-field :value="formatDate(detail.updateDate)" variant="outlined" color="primary" type="date" hide-details="true" readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">활성여부</v-label>
                        <v-text-field :value="detail.activeYn === 'Y' ? '활성화' : '비활성화'" variant="outlined" color="primary" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">긴급공지 여부</v-label>
                        <v-text-field :value="detail.emergencyNoticeYn === 'Y' ? '긴급' : '일반'" variant="outlined" color="primary" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">시작일</v-label>
                        <v-text-field :value="formatDate(detail.startDate)" variant="outlined" color="primary" type="date" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-label class="mb-2 font-weight-medium">종료일</v-label>
                        <v-text-field :value="formatDate(detail.endDate)" variant="outlined" color="primary" type="date" hide-details="true" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-label class="mb-2 font-weight-medium">공지대상 사용자그룹</v-label>
                        <v-text-field :value="detail.userGroupName" variant="outlined" color="primary" hide-details="true" readonly></v-text-field>
                    </v-col>
                </v-row>
            </Card>
            <Card class="mt-4">
                <v-card-item class="pt-0">
                    <h1 class="text-h1 font-weight-medium">{{ detail.title }}</h1>
                </v-card-item>
                <v-divider></v-divider>
                <div class="pa-6 text-body-1" v-html="detail.content">
                </div>
            </Card>
            <Panel :title="`첨부 파일 (${files.length})`" class="mt-4" v-if="files.length">
                <v-list lines="two" class="py-0">
                    <v-list-item
                        v-for="(file, index) in files"
                        :key="index"
                        class="py-1"
                        link
                        @click="onClickFile(file)"
                    >
                        <template v-slot:prepend>
                            <v-avatar color="grey400">
                                <component :is="fileIcon(file.fileExtension)" size="20" stroke-width="1.5"  />
                            </v-avatar>
                        </template>

                        <template v-slot:title>
                            <h5 class="text-subtitle-1">{{ file.fileName }}</h5>
                        </template>
                        <template v-slot:subtitle>
                            <span class="text-subtitle-2">{{ toFileSize(file.fileSize, 'KB') }}KB</span>
                        </template>
                    </v-list-item>
                </v-list>
            </Panel>
            <div class="d-flex justify-md-space-between mt-2">
                <div class="d-flex ga-2">
                    <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="openRegister">수정</v-btn>
                    <v-btn type="submit" class="submit-btn mt-2" flat color="error" @click="onDelete">삭제</v-btn>
                </div>
                <div>
                    <v-btn type="submit" class="submit-btn mt-2" flat color="primary" @click="router.back">목록으로 돌아가기</v-btn>
                </div>
            </div>
        </v-col>
    </v-row>

    <template v-if="isRegisterOpen">
        <RegisterModal :title="'공지사항 수정'" :notice-id="noticeId" @close="closeRegister" />
    </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { parse, format } from 'date-fns';
import { useAppStore } from '@/store/appStore';
import { useNetwork } from '@/shared/composable/useNetwork';
import { useMessage } from '@/shared/composable/useMessage';
import { toFileSize } from '@/shared/utils';
import { PhotoIcon, FileTextIcon, FileSpreadsheetIcon } from 'vue-tabler-icons';

import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import Card from '@/components/Card.vue';
import Panel from '@/components/Panel.vue';
import RegisterModal from '@/views/community/modal/RegisterModal.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const { requestTr, fileDownload } = useNetwork();
const { alert } = useMessage();

/** 화면 Layout 정보 */
const page = ref({ title: '공지사항 상세' });
const breadcrumbs = ref([
    {
        text: 'Community',
        disabled: false,
        href: '/notice_list'
    },
    {
        text: 'Notice',
        disabled: false,
        href: '/notice_list'
    },
    {
        text: 'Detail',
        disabled: true,
        href: '#'
    }
]);

// 상세 정보
const isDataFetch = ref(false);
const params = ref<any>(route.params);
const noticeId = ref<any>(params.value.id);
const detail = ref<any>({});
const files = ref<any>([]);
// 수정 Modal 오픈 여부
const isRegisterOpen = ref<any>(false);

const fileIcon = computed(() => (extension: string) => {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return FileTextIcon;
        case 'png':
        case 'jpg':
        case 'jpeg':
            return PhotoIcon;
        case 'xlsx':
        case 'xls':
            return FileSpreadsheetIcon;
        default:
            return FileTextIcon;
    }

});

const formatDate = (date: string) => {
    return format(parse(date, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');
};

onMounted(async () => {
    detail.value = await fetchItem();
    files.value = await fetchFiles();

    if (detail.value) {
        isDataFetch.value = true;
    }
    else {
        router.back();
    }
});

const onClickFile = (item: any) => {
    fileDownload({ url: item.downloadUrl, filename: item.fileName });
};

// 데이터 조회
async function fetchItem() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP0204',
        body: {
            noticeId: noticeId.value
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return body;
    }
    else {
        return null;
    }
}

// 첨부파일 조회
async function fetchFiles() {
    if (!detail.value || !detail.value.attachNo) {
        return [];
    }

    const { result, body }: any = await requestTr({
        trcode: 'MVP0003',
        body: {
            attachFileNoList: [{
                attachFileNo: detail.value.attachNo
            }]
        },
        isMock: false,
        isLoading: true,
    });

    return result ? body.attachFileNoList[0]?.attachFileList || [] : [];
}

// 데이터 삭제
async function deleteItem() {
    const { result }: any = await requestTr({
        trcode: 'MVP0206',
        body: {
            noticeId: noticeId.value
        },
        isMock: false,
        isLoading: true,
    });

    return result;
}

// 첨부파일 삭제
async function deleteFiles() {
    if (!detail.value.attachNo) {
        return true;
    }

    const { result }: any = await requestTr({
        trcode: 'MVP0005',
        body: {
            attachFileList: files.value.map((file: any) => ({
                attachFileNo: detail.value.attachNo,
                attachFileSeq: file.attachFileSeq
            }))
        },
        isMock: false,
        isLoading: true,
    });

    return result;
}

async function openRegister() {
    isRegisterOpen.value = true;
}

async function closeRegister(msg: any) {
    isRegisterOpen.value = false;

    if (msg.result) {
        isDataFetch.value = false;

        detail.value = await fetchItem();
        files.value = await fetchFiles();

        if (detail.value) {
            isDataFetch.value = true;
        }
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
        await deleteFiles();
        await deleteItem();

        appStore.setBackData({ result: true });
        router.back();
    }
}
</script>