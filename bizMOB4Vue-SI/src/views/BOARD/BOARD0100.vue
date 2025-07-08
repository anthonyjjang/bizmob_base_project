<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <AppHeader
                title="게시판"
                :leftButtons="['back']"
                :rightButtons="['menu']"
            />
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div class="board-content">
                <div class="header-search-container">
                    <div class="search-bar">
                        <AppInput
                            type="text"
                            placeholder="제목을 검색하세요."
                            v-model="searchKeyword"
                            @enter="onSearch"
                        />
                        <button type="button" class="search-button" @click="onSearch">Search</button>
                    </div>
                    <button type="button" class="button-icon" @click="onClickFilter">
                        <i class="icon filter">Filter</i>
                    </button>
                </div>
                <div class="board-container">
                    <div class="board-list-container">
                        <div class="board-list" v-if="list">

                            <a
                                href="#"
                                class="list-item ion-activatable"
                                v-for="(item, index) in list"
                                :key="index"
                                @click.prevent="onClickPost(item)"
                            >
                                <span class="item-header">
                                    <span class="notice">
                                        <span class="time">{{ toFormattedDate(item.regDate, 'full') }}</span>
                                    </span>
                                    <span class="notice-type">{{ item.targetName }}</span>
                                </span>
                                <span class="item-content">{{ title(item) }}</span>
                                <ion-ripple-effect></ion-ripple-effect>
                            </a>

                            <!-- 스크롤 로딩 -->
                            <AppScrollLoading
                                :page-index="pageIndex"
                                :max-index="pageMaxIndex"
                                @more="onMorePosts"
                            ></AppScrollLoading>

                            <!-- 결과없음 -->
                            <div class="no-data" v-if="list?.length === 0">
                                <p >No data</p>
                            </div>
                        </div>
                    </div>

                    <div class="board-write">
                        <button type="button" class="link-write" @click="onClickWrite">
                            <span class="message">Board Write</span>
                        </button>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { IonRippleEffect } from '@ionic/vue';
import { useNavigate, useModal, useNetwork, useDate } from '@/shared';
import { ROW_NUM } from '@/shared/constants';
import { AppInput, AppScrollLoading } from '@/components';

import BOARD0101 from '@/views/BOARD/BOARD0101.vue';
import BOARD0200 from '@/views/BOARD/BOARD0200.vue';

const { openPage } = useNavigate();
const { openSheet, openPopup } = useModal();
const { requestTr } = useNetwork();
const { toFormattedDate } = useDate();

// 검색어
const searchKeyword = ref<string>('');
// 검색 조건
const searchParams = ref<Json>({
    keyword: '',
    targetCode: '',
    categoryCode: '',
});
// 현재 페이지
const pageIndex = ref<number>(1);
// 최대 페이지
const pageMaxIndex = computed(() => Math.ceil(totalCount.value / ROW_NUM));
// 전체 건수
const totalCount = ref<number>(0);
// 목록
const list = ref<Json[] | null>(null);

// 게시글 제목
const title = computed(() => (post: Json) => {
    return `[${post.categoryName}] ${post.title}`;
});

onMounted(async () => {
    list.value = await handleList(pageIndex.value);
});

// 검색
const onSearch = async () => {
    // 1페이지 조회
    list.value = await handleList(1, {
        keyword: searchKeyword.value,
    });
};

// 필터 목록
const onClickFilter = async () => {
    const { result, data }: any = await openSheet(BOARD0101, {
        props: {
            targetCode: searchParams.value.targetCode,
            categoryCode: searchParams.value.categoryCode,
        },
        option: {
            css: ['sheet-height-60vh']
        }
    });

    if (result) {
        // 1페이지 조회
        list.value = await handleList(1, {
            keyword: searchKeyword.value,
            targetCode: data.targetCode,
            categoryCode: data.categoryCode,
        });
    }
};

// 게시글 상세 조회
const onClickPost = (item: Json) => {
    openPage('BOARD0300', { boardSeq: item.boardSeq });
};

// 게시글 작성
const onClickWrite = async () => {
    const { result, data, type }: any = await openPopup(BOARD0200);

    // 등록 완료시 목록 재조회
    if (result) {
        list.value = await handleList(1);
    }
};

// 더보기
const onMorePosts = async({ next, complete }: MoreItem) => {
    const posts = await handleList(next);
    list.value = list.value ? list.value.concat(posts) : posts;
    complete();
};

// 목록 조회
const handleList = async(index: number, params?: Json) => {
    // 검색 조건 저장
    searchParams.value = { ...searchParams.value, ...params };

    // 첫 목록 조회시 목록 초기화
    if (index === 1) {
        list.value = null;
    }

    // 검색
    const start = (index - 1) * ROW_NUM + 1;
    const end = index * ROW_NUM;
    const body = await getPosts({
        startIndex: start,
        endIndex: end,
        keyword: searchParams.value.keyword, // 검색어
        targetCode: searchParams.value.targetCode, // 검색 대상
        categoryCode: searchParams.value.categoryCode, // 검색 카테고리
    });

    // 조회 결과가 있을 경우
    if (body) {
        pageIndex.value = index; // 현재 페이지 수 저장
        totalCount.value = body.totalCnt; // 총 건수 저장

        return body.list;
    }
    else {
        return [];
    }
};

// 게시글 조회
const getPosts = async (payload: {
    startIndex: number, // 시작 인덱스
    endIndex: number, // 종료 인덱스
    keyword: string, // 검색어
    targetCode: string, // 검색 대상
    categoryCode: string, // 검색 카테고리
}) => {
    const { result, header, body }: Res = await requestTr({
        isMock: true,
        trcode: 'DM0002',
        body: payload,
        isLoading: payload.startIndex === 1,
    });

    return result ? body : null;
};
</script>

<style lang="scss" scoped>
.board-list-container {
    padding-bottom: 80px;
}
</style>