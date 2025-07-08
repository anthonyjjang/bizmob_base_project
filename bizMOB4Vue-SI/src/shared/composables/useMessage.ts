import { alertController, toastController } from '@ionic/vue';

interface AlertOptions {
    title?: string;
    text: string;
    buttons: (AlertButton | null)[],
    options?: AlertOption,
}

interface AlertButton {
    text?: string;
    handler: AlertCallback;
}

interface AlertOption {
    css?: string[];
    textAlign?: 'left' | 'center' | 'right';
    titleAlign?: 'left' | 'center' | 'right';
}

type AlertCallback = (arg: boolean) => any;

/**
 * @title Message Composable
 * @description 메시지 제어와 연관된 공통함수
 */
export function useMessage() {
    let isCreating = false; // Alert 생성중 여부 (Alert 호출을 동시에 하는 케이스 조절)
    const getDefault = () => { // Alert, Confirm 기본 텍스트
        return {
            cancel: '취소',
            ok: '확인',
            titleAlign: 'center',
            textAlign: 'center',
        };
    };

    return {
        /**
         * Alert
         * @param arg 노출 메시지 또는 Alert 옵션
         * @param btn 확인 버튼 클릭 callback
         */
        alert: async(arg: string | AlertOptions, btn?: AlertButton | AlertCallback): Promise<any> => {
            // 가장 위에 있는 alert
            const top = await alertController.getTop();
            // 닫히는 중이라면 null 반환
            const isHidden = document.getElementsByTagName('ion-router-outlet')[0]?.getAttribute('aria-hidden');

            // 현재 노출되고 있는 Alert/Confirm 있고, 여전히 열려있는 상태
            if (isCreating || (isHidden && top)) {
                return new Promise((resolve: any) => {
                    resolve(false);
                });
            }
            // Alert 노출
            else {
                isCreating = true; // Alert 생성중

                // alert({ title: "title", text: "message", buttons: [{ text: "ok", handler: () => true }], options: { ... } });
                if (typeof arg === 'object') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            header: arg.title, // 알림 제목
                            message: arg.text.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'), // 알림 내용
                            buttons: [{
                                text: arg.buttons[0]?.text || getDefault().ok, // 버튼 텍스트
                                handler: () => resolve(arg.buttons[0]?.handler(true) || true) // 버튼 클릭 핸들러
                            }],
                            cssClass: arg.options?.css, // CSS 클래스
                            backdropDismiss: false, // 배경 클릭 시 닫히지 않도록 설정
                        }).then((alert: HTMLIonAlertElement) => {
                            const title = alert.querySelector('.alert-title') as HTMLElement; // 알림 제목 요소
                            const message = alert.querySelector('.alert-message') as HTMLElement; // 알림 내용 요소

                            title.style.textAlign = arg.options?.titleAlign || getDefault().titleAlign; // 알림 제목 정렬 설정
                            message.style.textAlign = arg.options?.textAlign || getDefault().textAlign; // 알림 내용 정렬 설정

                            isCreating = false; // 생성 완료
                            alert.present(); // 알림 표시
                        });
                    });
                }
                // alert("message", { text: "ok", handler: () => true });
                else if (typeof arg === 'string' && typeof btn === 'object') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [{
                                text: btn?.text || getDefault().ok,
                                handler: () => resolve(btn?.handler(true) || true)
                            }],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // alert("message", () => true);
                else if (typeof arg === 'string' && typeof btn === 'function') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [{
                                text: getDefault().ok,
                                handler: () => resolve(btn(true) || true)
                            }],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // alert("message");
                else if (typeof arg === 'string') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [{
                                text: getDefault().ok,
                                handler: () => resolve(true)
                            }],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // 비정상 파라미터
                else {
                    isCreating = false; // 생성 실패
                    console.error('Message Parameter error!');
                    return new Promise((resolve: any) => {
                        resolve(false);
                    });
                }
            }
        },
        /**
         * Alert
         * @param arg 노출 메시지 또는 Alert 옵션
         * @param btn
         */
        confirm: async(arg: string | AlertOptions, btn?: AlertButton | AlertCallback): Promise<any> => {
            // 가장 위에 있는 alert
            const top = await alertController.getTop();
            // 닫히는 중이라면 null 반환
            const isHidden = document.getElementsByTagName('ion-router-outlet')[0]?.getAttribute('aria-hidden');

            // 현재 노출되고 있는 Alert/Confirm 있고, 여전히 열려있는 상태
            if (isCreating || (isHidden && top)) {
                return new Promise((resolve: any) => {
                    resolve(false);
                });
            }
            // Confirm 노출
            else {
                // alert({ title: "title", text: "message", buttons: [{ ... }, { ... }], options: { ... } });
                if (typeof arg === 'object') {
                    return new Promise((resolve: any) => {
                        const lBtn = arg.buttons[0];
                        const rBtn = arg.buttons[1];
                        alertController.create({
                            header: arg.title,
                            message: arg.text.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [
                                lBtn !== null
                                    ? {
                                        text: lBtn.text || getDefault().cancel,
                                        handler: () => resolve(lBtn.handler(false) || false)
                                    }
                                    : {
                                        text: getDefault().cancel,
                                        handler: () => resolve(false)
                                    },
                                rBtn !== null
                                    ? {
                                        text: rBtn.text || getDefault().ok,
                                        handler: () => resolve(rBtn.handler(true) || true)
                                    }
                                    : {
                                        text: getDefault().ok,
                                        handler: () => resolve(true)
                                    },
                            ],
                            cssClass: arg.options?.css,
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const title = alert.querySelector('.alert-title') as HTMLElement;
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            title.style.textAlign = arg.options?.titleAlign || getDefault().titleAlign;
                            message.style.textAlign = arg.options?.textAlign || getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // confirm("message", { text: "ok", handler: () => true });
                else if (typeof arg === 'string' && typeof btn === 'object') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [
                                {
                                    text: getDefault().cancel,
                                    handler: () => resolve(false)
                                }, {
                                    text: btn.text || getDefault().ok,
                                    handler: () => resolve(btn.handler(true) || true)
                                }
                            ],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // confirm("message", () => true);
                else if (typeof arg === 'string' && typeof btn === 'function') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [
                                {
                                    text: getDefault().cancel,
                                    handler: () => resolve(false)
                                }, {
                                    text: getDefault().ok,
                                    handler: () => resolve(btn(true) || true)
                                }
                            ],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // const result = await confirm("message");
                else if (typeof arg === 'string') {
                    return new Promise((resolve: any) => {
                        alertController.create({
                            message: arg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                            buttons: [
                                {
                                    text: getDefault().cancel,
                                    handler: () => resolve(false)
                                }, {
                                    text: getDefault().ok,
                                    handler: () => resolve(true)
                                }
                            ],
                            backdropDismiss: false,
                        }).then((alert: HTMLIonAlertElement) => {
                            const message = alert.querySelector('.alert-message') as HTMLElement;

                            message.style.textAlign = getDefault().textAlign;

                            isCreating = false; // 생성 완료
                            alert.present();
                        });
                    });
                }
                // 그 외
                else {
                    isCreating = false; // 생성 실패
                    console.error('Message Parameter error!');
                    return new Promise((resolve: any) => {
                        resolve(false);
                    });
                }
            }
        },
        // 하단 노출 Toast
        toast: async(msg: string) => {
            // 가장 위에 있는 alert
            const top = await toastController.getTop();

            if (top) {
                toastController.dismiss();
            }

            const toast = await toastController.create({
                message: msg.replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />'),
                duration: 1500,
                position: 'bottom',
            });

            await toast.present();
        }
    };
}