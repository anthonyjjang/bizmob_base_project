<template>
    <div class="authentication">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" class="d-flex align-center">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0  mx-auto" max-width="450">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4 mb-5">
                                <div class="logo">
                                    <RouterLink to="/">
                                        <img :src="logo" alt="home" />
                                    </RouterLink>
                                </div>
                            </div>
                            <Form @submit="login" v-slot="{ errors, isSubmitting }" class="mt-5">
                                <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">언어설정</v-label>
                                <v-select
                                    v-model="select"
                                    :items="items"
                                    item-title="text"
                                    item-value="value"
                                    return-object
                                    single-line
                                    variant="outlined"
                                    placeholder="언어를 선택해주세요."
                                ></v-select>

                                <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">사번</v-label>
                                <v-text-field
                                    v-model="userId"
                                    :rules="userIdRules"
                                    class="mb-8"
                                    required
                                    hide-details="auto"
                                    placeholder="사번을 입력해주세요."
                                    :clearable="true"
                                    @click:clear="userId = ''"
                                >
                                    <template v-slot:prepend-inner>
                                        <UserIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                    </template>
                                </v-text-field>

                                <v-label class="text-subtitle-1 font-weight-medium pb-2 text-lightText">비밀번호</v-label>
                                <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    required
                                    :hide-details="true"
                                    :type="showPassword ? 'text' : 'password'"
                                    class="pwdInput"
                                    placeholder="비밀번호를 입력해주세요."
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showPassword = !showPassword"
                                    :clearable="true"
                                    @click:clear="password = ''"
                                >
                                    <template v-slot:prepend-inner>
                                        <LockIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                                    </template>
                                </v-text-field>
                                <div class="mt-6">
                                    <v-btn size="large" :loading="isSubmitting" color="primary" :disabled="valid" block type="submit" flat>로그인</v-btn>
                                </div>
                                <div v-if="errors.apiError" class="mt-2">
                                    <v-alert color="error">{{ errors.apiError }}</v-alert>
                                </div>
                            </Form>
                            <h6 class="text-h6 text-medium-emphasis d-flex justify-center align-center mt-3">
                                <v-btn class="pl-0 text-primary text-body-1 text-decoration-underline opacity-1 pl-2" height="auto" to="/" variant="plain"
                                    >사용자 등록 신청</v-btn
                                >
                                <v-btn class="pl-0 text-primary text-body-1 text-decoration-underline opacity-1 pl-2" height="auto" to="/" variant="plain"
                                    >비밀번호 초기화</v-btn
                                >
                            </h6>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Form } from 'vee-validate';
import { RouterLink, useRouter } from 'vue-router';
import { LockIcon, UserIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useMenuStore } from '@/store/menuStore';
import { useNetwork } from '@/shared/composable/useNetwork';

import logo from '@/assets/images/mcnc_logo_b.svg';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const menuStore = useMenuStore();
const { requestTr } = useNetwork();

const select = ref('한국어');
// 언어 목록
const items = ref([
    { text: '한국어', value: 'ko' },
    { text: 'English', value: 'en' },
    { text: '日本語', value: 'jp' }
]);
const userId = ref<string>('honggildong');
const password = ref<string>('12345');
const showPassword = ref(false);
const valid = computed(() => !select.value || !userId.value || !password.value);

const userIdRules = ref([(v: string) => !!v || 'UserId is required']);
const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters'
]);

async function login(values: any, { setErrors }: any) {
    
    const { result, body }: any = await requestTr({
        trcode: 'PCLOGIN',
        body: {
            os_type: 'web',
            user_id: userId.value,
            legacy_trcode: 'MVP0101',
            legacy_message: {
                header: {
                    result: true,
                    trcode: 'MVP0101',
                },
                body: {
                    userId: userId.value,
                    userPwd: password.value,
                }
            },
        },
        isLoading: false,
        isMock: false,
    });

    if (result) {
        authStore.setToken({
            accessToken: body.accessToken,
            accessTokenExpTime: body.accessTokenExpTime,
            refreshToken: body.refreshToken,
            refreshTokenExpTime: body.refreshTokenExpTime,
        });
        authStore.initBzToken();

        const user = body.legacy_message.body;

        await menu(user.userRoleList.map((role: any) => ({ roleId: role.roleId })));

        userStore.setUser(user);

        router.push('/dashboard');
    }
}

async function menu(roleIdList: any) {
    const { result, body }: any = await requestTr({
        trcode: 'MVP0102',
        body: {
            roleIdList,
        },
        isLoading: false,
        isMock: false,
    });

    if (result) {
        menuStore.setMenus(body.menuList);
        return true;
    }
}
</script>