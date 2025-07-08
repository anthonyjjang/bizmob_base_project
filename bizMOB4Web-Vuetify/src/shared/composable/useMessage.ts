import AlertService from '@/shared/service/AlertService';

/**
 * @title Message Composable
 * @description 메시지 제어와 연관된 공통함수
 */
export function useMessage() {
    const isCreating = false; // Alert 생성중 여부 (Alert 호출을 동시에 하는 케이스 조절)
    const getDefault = () => { // Alert, Confirm 기본 텍스트
        return {
            cancel: '취소',
            ok: '확인',
        };
    };

    return {
        /**
         * Alert
         * @param arg 노출 메시지 또는 Alert 옵션
         * @param btn 확인 버튼 클릭 callback
         */
        alert: async(arg: any, btn?: any): Promise<any> => {

            // alert({ message: "message", buttons: [{ text: "ok", value: () => true }] });
            if (typeof arg === 'object') {
                return await AlertService.show({
                    message: arg.message, // replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />')
                    buttons: arg.buttons,
                });
            }
            // alert("message", () => true);
            else if (typeof arg === 'string' && typeof btn === 'function') {
                return await AlertService.show({
                    message: arg, // replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />')
                    buttons: [{ text: getDefault().ok, value: btn }],
                });
            }
            // alert("message");
            else if (typeof arg === 'string') {
                return await AlertService.show({
                    message: arg, // replace(/\n/gi, '<br />').replace(/\\n/gi, '<br />')
                    buttons: [{ text: getDefault().ok, value: true }],
                });
            }
            // 비정상 파라미터
            else {
                console.error('Message Parameter error!');
                return new Promise((resolve: any) => {
                    resolve(false);
                });
            }
        },
    };
}