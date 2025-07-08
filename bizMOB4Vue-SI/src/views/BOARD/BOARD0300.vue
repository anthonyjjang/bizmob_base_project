<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <AppHeader
                title="게시글 상세"
                :leftButtons="['back']"
            />
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div class="board-content" v-show="isLoad">
                <div class="board-container">
                    <div class="board-detail">
                        <div class="item-header">
                            <div class="notice">
                                <p class="time">{{ toFormattedDate(regDate, 'full') }}</p>
                                <p class="division">{{ categoryName }}</p>
                            </div>
                            <span class="notice-type">{{ targetName }}</span>
                        </div>

                        <p class="item-title">{{ title }}</p>

                        <div class="item-content">
                            <!-- 등록된 컨텐츠 확인후 스타일 조정 필요 -->
                            <div class="text-block" v-html="toHtml(content)"></div>
                        </div>
                    </div>

                </div>
            </div>
        </ion-content>

        <ion-footer>
            <div class="button-group bottom-cta">
                <button type="button" class="button button-blue" @click="onModify">수정</button>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { useNavigate, useNetwork, useModal, useDate } from '@/shared';
import { toHtml } from '@/shared/utils';

import BOARD0201 from '@/views/BOARD/BOARD0201.vue';

const { getPropsComp, back } = useNavigate();
const { requestTr } = useNetwork();
const { toFormattedDate } = useDate();
const { openPopup } = useModal();

const props = getPropsComp({
    boardSeq: '',
});

const isLoad = ref<boolean>(false);
const regDate = ref<string>('');
const categoryName = ref<string>('');
const targetName = ref<string>('');
const title = ref<string>('');
const content = ref<string>('');

onIonViewWillEnter(async () => {
    await handlePost();
    isLoad.value = true;
});

// 수정
const onModify = async () => {
    const { result }: any = await openPopup(BOARD0201, {
        props: {
            boardSeq: props.value.boardSeq,
        },
    });

    // 수정 성공시 재조회
    if (result) {
        handlePost();
    }
};

const handlePost = async () => {
    const post = await getPost({ boardSeq: props.value.boardSeq });

    if (post) {
        regDate.value = post.regDate;
        categoryName.value = post.categoryName;
        targetName.value = post.targetName;
        title.value = post.title;
        content.value = post.content;
    }
};

// 게시글 조회
const getPost = async (payload: {
    boardSeq: string; // 게시글 번호
}) => {
    const { result, body }: Res = await requestTr({
        isMock: true,
        trcode: 'DM0003',
        body: payload,
    });

    return result ? body : null;
};
</script>
