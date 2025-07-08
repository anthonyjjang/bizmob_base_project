<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12" sm="12">
            <v-row>
                <v-col cols="8">
                    <v-card elevation="10">
                        <v-card-text>
                            <v-file-input
                                v-model="files"
                                multiple
                                label="Drag file here to upload"
                                hide-details
                                variant="outlined"
                                :focused="false"
                            ></v-file-input>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card elevation="10">
                        <v-card-text>
                            <div class="d-flex align-start" @click="onFileUpload">
                                <h2 class="text-h5 mt-1">File Upload</h2>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" sm="12">
            <v-row>
                <v-col cols="8">
                    <v-card elevation="10">
                        <v-card-text>
                            <div class="d-flex align-start" @click="onFileDownload">
                                <h2 class="text-h5 mt-1">File Download Test</h2>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="4">
                    <v-card elevation="10">
                        <v-card-text>
                            <div class="d-flex align-start">
                                <h2 class="text-h5 mt-1">Test</h2>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" sm="12">
            <v-row>
                <v-col cols="3">
                    <v-card elevationg="30">
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">MvpInput Demo (text)</v-label>
                            <MvpInput
                                v-model="textKeyword"
                                placeholder="입력해주세요."
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="3">
                    <v-card elevationg="30">
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">MvpInput Demo (password)</v-label>
                            <MvpInput
                                v-model="password"
                                type="password"
                                placeholder="입력해주세요."
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="3">
                    <v-card elevationg="30">
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">MvpInput Demo (date)</v-label>
                            <MvpInput
                                v-model="date"
                                type="date"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="3">
                    <v-card elevation="10">
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">MvpSelect Demo</v-label>
                            <MvpSelect
                                v-model="selectedItem"
                                :items="selectOpts"
                                :placeholder="'선택해주세요.'"
                                itemTitle="title"
                                :is-return-object="true"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" sm="12">
            <v-row>
                <v-col cols="6">
                    <v-card>
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">Activate MvpTreeview Demo</v-label>
                            <div class="d-flex justify-sm-end ga-2">
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="activateTreeview?.changeActivatedNode('0')">탑노드 변경</v-btn>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="activateTreeview?.allCloseNode">모든 노드 닫기</v-btn>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="activateTreeview?.allOpenNode">모든 노드 펼치기</v-btn>
                            </div>
                            <MvpTreeview 
                                ref="activateTreeview"
                                type="activate"
                                v-model:activated="activatedNode"
                                v-model:opened="activateOpenedList"
                                :items="items"
                                :loading="activateLoading"
                                itemValue="userGroupCode"
                                itemTitle="userGroupName"
                                @on-activated-treeview="onActivatedATreeview"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card>
                        <v-card-text>
                            <v-label class="mb-2 font-weight-medium">Select MvpTreeview Demo</v-label>
                            <div class="d-flex justify-sm-end ga-2">
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="setAllSelect">모든 노드 선택</v-btn>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="setAllDeselect">모든 노드 선택 해제</v-btn>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="allCloseNode">모든 노드 닫기</v-btn>
                                <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="allOpenNode">모든 노드 펼치기</v-btn>
                            </div>
                            <MvpTreeview 
                                ref="selectTreeview"
                                type="select"
                                v-model:selected="selectedNodes"
                                v-model:opened="selectOpenedList"
                                :items="items"
                                :loading="selectLoading"
                                itemValue="userGroupCode"
                                itemTitle="userGroupName"
                                @on-activated-treeview="onActivatedSTreeview"
                            />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue';
import { useMessage } from '@/shared/composable/useMessage';
import { useNetwork } from '@/shared/composable/useNetwork';

import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import { MvpTreeview, MvpInput, MvpSelect } from '@/components';

const { alert } = useMessage();
const { requestTr } = useNetwork();

/* MvpInput */
const textKeyword = ref<string>('');
const password = ref<string>('');
const date = ref<string>('');

/* MvpSelect */
const selectedItem = ref(null);
const selectOpts = ref<Json[]>([
    { title: 'option1', value: 1 },
    { title: 'option2', value: 2 },
    { title: 'option3', value: 3 }
]);

const userGroupList = ref<Json[]>([]);
const items = ref<Json[]>([]); // 트리 구조의 데이터

/* MvpTreeview */
const activateTreeview = ref();

const activateLoading = ref<boolean>(true); // Progress Loading
const activatedNode = ref<Json>({}); // 활성화 노드 객체
const activateOpenedList = ref<Json[]>([]); // 오픈된 노드 객체 목록


/* MvpTreeview */
const selectTreeview = ref();

const selectLoading = ref<boolean>(true); // Progress Loading
const selectedNodes = ref<Json[]>([]); // 선택된 노드 객체
const selectOpenedList = ref<Json[]>([]); // 오픈된 노드 객체 목록

/**
 * 트리 구조로 변경
 */
function listToTree(data: Json[]) {
    const rootNodes: Json[] = [];
    const lookup: { [key: number]: Json } = {};

    // 각 항목에 대해 트리 노드 생성
    data.forEach(item => {
        // 새로운 트리 노드 생성
        const node = { 
            userGroupCode: item.userGroupCode,
            parentUserGroupLevel: item.parentUserGroupLevel,
            parentUserGroupCode: item.parentUserGroupCode,
            userGroupName: item.userGroupName,
            userGroupDescription: item.userGroupDescription,
            userGroupLevel: item.userGroupLevel,
            userGroupSortOrder: item.userGroupSortOrder,
            children: null,
        };
        lookup[item.userGroupCode] = node; // id를 키로 하는 맵에 저장

        if (item.parentUserGroupCode === null) {
        // 부모가 없으면 루트 노드로 추가
            rootNodes.push(node);
        } else {
            // 부모가 있으면 부모의 자식으로 추가
            const parentNode = lookup[item.parentUserGroupCode];
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentNode.children.push(node);
            }
        }
    });

    return rootNodes;
}

const page = ref({ title: 'Dashboard' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '#',
    },
    {
        text: 'Dashboard',
        disabled: true,
        href: '#',
    },
]);

const files = ref<Json[]>([]);
const onFileUpload = async () => {
    console.log(files.value);

    const { result, body } = await requestTr({
        trcode: 'MVP0002',
        body: {
            workGb: 'NOTICE'
        },
        fileList: files.value
    });

    console.log(result, body);
};


const onFileDownload = async () => {
    const msg = await alert('파일 다운로드 테스트');

    console.log(msg);
};

/**
 * 모든 노드 선택
 * select
 */
function setAllSelect() {
    selectTreeview.value.allSelectedNodes();
}

/**
 * 모든 노드 선택 해제
 * select
 */
function setAllDeselect() {
    selectTreeview.value.allDeselectNodes();
}

/**
 * 모든 노드 닫기
 * select
 */
function allCloseNode() {
    selectTreeview.value.allCloseNode();
}

/**
 * 모든 노드 열기
 * select
 */ 
function allOpenNode() {
    selectTreeview.value.allOpenNode();
}

async function getUserGroupList() {
    activateLoading.value = true;
    selectLoading.value = true;

    const { result, body }: any = await requestTr({
        trcode: 'MVP9009',
        body: {
            userGroupName: '',
            userName: '',
            userId: '',
            useYn: 'ALL',
        },
        isLoading: false,
        isMock: true,
    });
    if (result) {
        activateLoading.value = false;
        selectLoading.value = false;
        return body.userGroupList;
    }
    return null;
}

onActivated(async() => {
    items.value.length = 0;
    setTimeout(async() => {
        userGroupList.value = await getUserGroupList();
        items.value = listToTree(userGroupList.value);
    }, 3000);
});

/**
 * MvpTreeview Mounted (activate)
 * treeview Mounted 완료 시 호출
 */
async function onActivatedATreeview() {
    console.log('### onActivated Activate Treeview');
}

/**
 * MvpTreeview Mounted (select)
 * treeview Mounted 완료 시 호출
 */
function onActivatedSTreeview() {
    console.log('### onActivated Select Treeview');
}
</script>