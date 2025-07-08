<template>
    <!-- class="dialog-mw" -->
    <v-dialog
        :model-value="true"
        transition="dialog-right-transition"
        content-class="dialog-content"
        fullscreen
        :style="{
            height: '100vh',
            width: '36%',
            justifySelf: 'self-end',
            margin: '0',
        }"
        @after-leave="emit('close', { message: '닫기' })"
    >
        <v-card height="100vh" class="overflow-auto rounded-e-0">
            <v-container v-if="isDataFetch">
                <v-card-title class="pa-5">
                    <span class="text-h5">{{ title }}</span>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">공지대상 사용자 그룹</v-label>
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

                        <v-col cols="12" md="6">
                            <v-label class="mb-2 font-weight-medium">시작일</v-label>
                            <v-text-field v-model="dStartDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-label class="mb-2 font-weight-medium">종료일</v-label>
                            <v-text-field v-model="dEndDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">제목</v-label>
                            <v-text-field v-model="dTitle" variant="outlined" placeholder="Enter Title" color="primary" hide-details></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">내용</v-label>
                            <div v-if="editor">
                                <EditorMenubar :editor="editor" class="editor-menubar" />
                                <EditorContent :editor="editor" class="editor-content" />
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">첨부파일</v-label>
                            <v-file-input
                                multiple
                                label="Drag file here to upload"
                                hide-details
                                variant="outlined"
                                :focused="false"
                                @update:modelValue="onInputFile"
                            ></v-file-input>
                        </v-col>

                        <v-col cols="12" v-if="files.length > 0">
                            <v-list lines="two" class="py-0">
                                <v-list-item
                                    v-for="(file, index) in files"
                                    :key="index"
                                    class="py-1"
                                    link
                                >
                                    <template v-slot:prepend>
                                        <v-avatar color="grey400">
                                            <component v-if="fileType(file) === 'png'" :is="PhotoIcon" size="20" stroke-width="1.5"  />
                                            <component v-else-if="fileType(file) === 'excel'" :is="FileSpreadsheetIcon" size="20" stroke-width="1.5"  />
                                            <component v-else :is="FileTextIcon" size="20" stroke-width="1.5"  />
                                        </v-avatar>
                                    </template>

                                    <template v-slot:title>
                                        <h5 class="text-subtitle-1">{{ fileName(file) }}</h5>
                                    </template>
                                    <template v-slot:subtitle>
                                        <span class="text-subtitle-2">{{ fileSize(file) + 'KB' }}</span>
                                    </template>

                                    <template v-slot:append>
                                        <v-icon @click.stop="onFileRemove(file, index)">mdi-close-circle</v-icon>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">활성화 여부</v-label>
                            <v-radio-group inline v-model="dActiveYn" hide-details>
                                <v-row>
                                    <v-col cols="12" md="4"><v-radio label="활성화" color="primary"  value="Y"></v-radio></v-col>
                                    <v-col cols="12" md="4"><v-radio label="비활성화" color="primary" value="N"></v-radio></v-col>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">긴급공지 여부</v-label>
                            <v-checkbox v-model="dEmergencyNoticeYn" true-value="Y" false-value="N" color="primary" label="체크 시 공지사항 상단에서 보여집니다." hide-details="true"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider class="mt-4"></v-divider>
                <div class="d-flex justify-end mt-4">
                    <v-btn flat color="error" variant="outlined" @click="emit('close', { result: false })">취소</v-btn>
                    <v-btn flat color="primary" class="ml-4" @click="submit">저장</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { type PropType, ref, onMounted, computed } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { parse, format, subDays } from 'date-fns';
import { PhotoIcon, FileTextIcon, FileSpreadsheetIcon } from 'vue-tabler-icons';
import StarterKit from '@tiptap/starter-kit';

import { useNetwork } from '@/shared/composable/useNetwork';
import { toFileSize } from '@/shared/utils';
import EditorMenubar from '@/components/Editor/EditorMenubar.vue';

const { requestTr } = useNetwork();
const emit = defineEmits([
    'close'
]);
const props = defineProps({
    title: { type: String as PropType<string> },
    noticeId: { type: String as PropType<string> }
});

const isDataFetch = ref(false);
const noticeId = ref(props.noticeId);

const groupList = ref<Json[]>([]);
const selectedGroup = ref<Json | null>(null);
const detail = ref<Json | null>(null);
const files = ref<Json[]>([]);
const deleteFiles = ref<Json[]>([]);

const dStartDate = ref(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
const dEndDate = ref(format(new Date(), 'yyyy-MM-dd'));
const dTitle = ref<string>('');
const dActiveYn = ref('Y');
const dEmergencyNoticeYn = ref('N');
const editor = useEditor({
    extensions: [StarterKit],
    content: '', // editor.value?.getHTML()
});

const formatDate = (date: string) => {
    return format(parse(date, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');
};

const fileType = computed(() => (file: any) => {
    if (file instanceof File) {
        return file.type.toLowerCase();
    }
    else {
        return file.fileExtension.toLowerCase();
    }
});

const fileName = computed(() => (file: any) => {
    if (file instanceof File) {
        return file.name;
    }
    else {
        return file.fileName;
    }
});

const fileSize = computed(() => (file: any) => {
    if (file instanceof File) {
        return toFileSize(file.size, 'KB');
    }
    else {
        return toFileSize(file.fileSize, 'KB');
    }
});

const onInputFile = (fileList: any) => {
    files.value = [...files.value, ...fileList];
};

const onFileRemove = (file: any, index: number) => {
    if (file instanceof File) {
        files.value.splice(index, 1);
    }
    else {
        files.value.splice(index, 1);
        deleteFiles.value.push(file);
    }
};

onMounted(async() => {
    if (noticeId.value) {
        [groupList.value, detail.value] = await Promise.all([
            fetchNoticeGroupList(),
            fetchItem()
        ]);

        if (detail.value) {
            selectedGroup.value = { groupName: detail.value.userGroupName, groupId: detail.value.userGroupId };
            files.value = await fetchFiles();

            dStartDate.value = formatDate(detail.value.startDate);
            dEndDate.value = formatDate(detail.value.endDate);
            dTitle.value = detail.value.title;
            editor.value?.commands.setContent(detail.value.content);
            dActiveYn.value = detail.value.activeYn;
            dEmergencyNoticeYn.value = detail.value.emergencyNoticeYn;
        }
        else {
            emit('close', { result: false });
        }
    }
    else {
        groupList.value = await fetchNoticeGroupList();
        selectedGroup.value = groupList.value[0];
    }

    isDataFetch.value = true;
});

async function fetchNoticeGroupList() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP0201',
        body: {
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return body.groupList;
    }
    else {
        return [];
    }
}

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

// 첨부파일 등록
async function fileUpload() {
    // 기존 값 변경
    if (noticeId.value && detail.value?.attachNo) {
        await fileDelete();
        await fileAdd();

        return detail.value?.attachNo;
    }
    // 신규 등록
    else {
        if (files.value.length) {
            const { result, body } = await requestTr({
                trcode: 'MVP0002',
                body: {
                    workGb: 'NOTICE'
                },
                fileList: files.value
            });

            if (result) {
                return body.fileUidList[0].attachFileNo;
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }
}

// 첨부파일 제거
async function fileDelete() {
    if (deleteFiles.value.length) {
        console.log(deleteFiles.value);

        await requestTr({
            trcode: 'MVP0005',
            body: {
                attachFileList: deleteFiles.value.map((file: any) => {
                    return {
                        attachFileNo: detail.value?.attachNo,
                        attachSeq: file.attachSeq,
                    };
                })
            },
        });
    }
}

// 첨부파일 추가
async function fileAdd() {
    const uploadFile = files.value.filter((file: any) => file instanceof File);

    if (uploadFile.length) {
        await requestTr({
            trcode: 'MVP0004',
            body: {
                workGb: 'NOTICE',
                fileUidList: [{
                    attachFileNo: detail.value?.attachNo,
                    fileUid: 'fileList'
                }]
            },
            fileList: uploadFile
        });
    }
}

async function submit() {
    const { result }: any = await requestTr({
        trcode: noticeId.value ? 'MVP0205' : 'MVP0203',
        body: {
            title: dTitle.value, //제목
            userGroupId: selectedGroup.value?.groupId, //공지대상 사용자 그룹 id
            noticeId: noticeId.value, //공지사항 id
            content: editor.value?.getHTML(), //내용
            emergencyNoticeYn: dEmergencyNoticeYn.value, //긴급 공지 여부
            activeYn: dActiveYn.value, //활성여부
            attachNo: await fileUpload(), //통합첨부파일번호
            startDate: dStartDate.value.replace(/-/gi, ''), //시작일 (YYYYMMDD)
            endDate: dEndDate.value.replace(/-/gi, ''), //종료일 (YYYYMMDD)
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
</script>

<style lang="scss">
.editor-menubar {
    border: 1px solid rgba(var(--v-border-color)) !important;
}
.editor-content > div {
    min-height: 300px;
    border: 1px solid rgba(var(--v-border-color)) !important;
}
</style>