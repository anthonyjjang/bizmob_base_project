<template>
    <ion-page>
        <ion-header>
            <AppHeader
                title="bizMOB4"
            />
        </ion-header>

        <ion-content>
            <div class="content">
                <div class="login-form">
                    <!-- ID -->
                    <div class="form-field">
                        <div class="form-input">
                            <AppInput
                                type="text"
                                placeholder="ID"
                                v-model="id"
                            />
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="form-field">
                        <div class="form-input">
                            <AppInput
                                type="password"
                                placeholder="Password"
                                v-model="pw"
                            />
                        </div>
                    </div>

                    <div class="form-submit">
                        <button type="button" class="button button-blue" @click="onLogin">LOGIN</button>
                    </div>

                    <div class="login-links">
                        <a href="#">아이디/비밀번호 찾기</a>
                        <a href="#">회원가입</a>
                    </div>
                </div>

                <div class="button-group">
                    <button type="button" class="sample-button" @click="openPage('README01')">Readme</button>
                </div>
            </div>
        </ion-content>

        <ion-footer>
            <div class="footer">
                <p class="copyright">Copyright (C) 2024 bizMOB4 SI</p>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { StoreService, useNavigate, useMessage } from '@/shared';
import { AppInput } from '@/components';

const loginStore = new StoreService('login');
const userStore = new StoreService('user');
const { openPage } = useNavigate();
const { alert, confirm } = useMessage();

const id = ref<string>('tester1');
const pw = ref<string>('1111');

// 로그인 버튼 클릭
const onLogin = async (): Promise<boolean> => {
    const { header, body }: Json = await loginStore.dispatch('postLogin', {
        userId: id.value,
        password: pw.value,
    });

    if (!isLogin(header)) {
        return false;
    }
    else {
        // 사용자 정보 저장 (후처리 과정에서 필요할 수 있기 때문에 미리 저장)
        setUser(body);

        // 사용자 정보 후처리
        if (await checkUser(body)) {
            // 화면 이동
            movePage(body);
            return true;
        }
        else {
            clearUser();
            return false;
        }
    }
};

// 정상 로그인 판단
const isLogin = (header: Json): boolean => {
    // 로그인 실패 코드
    if (header.error_code === 'DM000100501') {
        alert(header.error_text);
        return false;
    }
    else {
        return true;
    }
};

// 사용자 정보 저장
const setUser = (body: Json): void => {
    loginStore.dispatch('setLoginToken', 'TEST_TOKEN_01');
    userStore.dispatch('setUser', body);
};

// 사용자 정보 초기화
const clearUser = (): void => {
    loginStore.dispatch('setLoginToken', '');
    userStore.dispatch('setUser', null);
};

// 로그인 성공 후 정보 확인
const checkUser = async (body: Json): Promise<boolean> => {
    if (body.stopYn === 'Y') {
        return await confirm({
            title: '알림',
            text: '로그인 후처리 안내입니다.',
            buttons: [{
                text: '취소',
                handler: () => false
            }, {
                text: '확인',
                handler: () => true
            }]
        });
    }
    else {
        return true;
    }
};

// 화면 이동
const movePage = (body: Json): void => {
    openPage('MAIN0100');
};

</script>

<style scoped lang="scss">
.login-form {
    padding-bottom: 30px;

    .form-submit {
        margin-top: 65px;
    }
}

.login-links {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 15px 0 16px;

    a {
        margin-right: 19px;
        font-size: 12px;
        line-height: 15px;
        color: #202020;

        &:last-child {
            margin-right: 0;
            margin-left: auto;
        }
    }
}

.button-group {
    padding: 30px 0 30px;
    border-top: 1px solid #dfdfdf;
    display: flex;
    flex-direction: column;
    & > * + * {
        margin-top: 10px;
    }

    .sample-button {
        height: 32px;
        border: 4px solid lightgreen;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        border-radius: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
        line-height: 18px;
        color: #4d4d4d;
    }
}

.copyright {
    padding: 5px 0;
    font-size: 11px;
    line-height: 14px;
    font-weight: 400;
    color: #a7a7a7;
    text-align: center;
    background-color: #202020;
}
</style>
