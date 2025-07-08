<template>
    <ion-page>
        <!-- Ionic Contents Tag -->
        <ion-content class="ion-padding">
            <div>
                <div class="logo">
                    <img src="@/assets/images/bizMOB.png" alt="logo" />
                </div>
                <div class="buttons">
                    <div><button @click="openPage">Open Page</button></div>
                    <div><button @click="openModal">Open Modal</button></div>
                </div>
                <div class="buttons">
                    <div><button @click="onLocale">Locale Service</button></div>
                </div>
                <div class="buttons">
                    <div><button @click="onBizMOBRequestLogin">bizMOB Request Login</button></div>
                    <div><button @click="onBizMOBRequestTr">bizMOB Request Tr</button></div>
                    <div><button @click="onBizMOBRequestHttp">bizMOB Request Http</button></div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
/** Open Page */
import { useRouter } from 'vue-router';

const router = useRouter();

const openPage = () => {
    router.push({ name: 'README02', query: { foo: 'foo', bar: 'bar' } });
};

/** Open Modal */
import { modalController } from '@ionic/vue';
import README03 from '@/views/README/README03_modal.vue';

const openModal = async() => {
    // Modal 객체 생성
    const modal = await modalController.create({
        component: README03,
        componentProps: {
            string: 'foo',
            json: { x: 'y' },
            array: [ 'a', 'b' ],
        },
        showBackdrop: true,
        backdropDismiss: true,
        cssClass: [ 'modal-class-sample' ],
    });

    // Modal 표시
    modal.present();

    // Modal callback 대기
    const { data, role } = await modal.onDidDismiss();
    console.log(data, role);
};

/** Locale Service */
import BzLocale from '@/bizMOB/BzClass/BzLocale';

const onLocale = async() => {
    BzLocale.initLocale(); // 언어 초기화
    BzLocale.changeLocale('ko-KR'); // 언어 변경

    console.log(await BzLocale.getLocale()); // {result: true, locale: 'ko-KR'}
};

/** bizMOB Request Login */
import Network from '@/bizMOB/Xross/Network';

const onBizMOBRequestLogin = async() => {
    const res: any = await Network.requestLogin({
        _bMock: false,
        _sTrcode: 'DM0001',
        _sUserId: 'tester1',
        _sPassword : '1111',
        _oBody: {
            userId: 'tester1',
            passwd: '1111',
        }
    });

    console.log(res);
};

/** bizMOB Request Tr */
const onBizMOBRequestTr = async() => {
    const res: any = await Network.requestTr({
        _bMock: false,
        _sTrcode: 'DM0002',
        _oBody: {
            startIndex: 0,
            endIndex: 9
        },
    });

    console.log(res);
};

/** bizMOB Request Http */
const onBizMOBRequestHttp = async() => {
    const res: any = await Network.requestHttp({
        _sUrl: 'https://jsonplaceholder.typicode.com/posts', // 외부 API 서버
        _sMethod: 'GET',
    });

    /**
    * @returns {Object} Response 객체
    * @returns {Boolean} returns.result 결과
    * @returns {Number} returns.response_code 응답 코드 (200 <= .. <= 300)
    * @returns {String} returns.response_data 응답 데이터
    * @returns {Object} returns.error 응답 실패시 에러 객체 (실패시에만 존재)
    * @returns {Number} returns.error.code Native 응답 실패코드 (ERR000)
    * @returns {String} returns.error.message Native에서 주는 응답 실패 메시지
    * @returns {Number} returns.error.response_code Server 응답 실패코드 (401, 402, ...) -- 없을 수도 있음
    * @returns {String} returns.error.response_data Server 응답 실패 데이터 -- 없을 수도 있음
    */
    console.log(res);
};
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  justify-content: center;
  height: 50px;
}

.buttons {
  margin-top: 20px;

  button {
    width: 100%;
    margin-top: 10px;
    background-color: #2250fc; /* 기본 파란색 배경 */
    color: white; /* 흰색 텍스트 */
    padding: 15px 32px; /* 상하 15px, 좌우 32px 패딩 */
    font-size: 16px; /* 폰트 크기 */
    font-weight: bold; /* 폰트 굵기 */
    margin: 4px 2px; /* 마진 */
    border: none; /* 테두리 없음 */
    border-radius: 12px; /* 라운딩 처리, 모서리 둥글게 */
    transition: all 0.3s; /* 애니메이션 효과 */
  }

  button:active {
    background-color: #1a3db8; /* 클릭 시 어두운 파란색으로 변경 */
  }
}
</style>