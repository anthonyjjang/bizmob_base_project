import { modalController } from '@ionic/vue';
import { useNetwork } from '@/shared';

/**
 * @title Modal Composable
 * @description useNavigate의 경우 IonRouter로 인하여 store 에서 사용을 못하기에 따로 분리
 */
export function useModal() {
    // Bottom Sheet Option (하단에서 올라오는 일부분만 채우는 Layer Popup)
    function getSheetOption(component: any, { props, option }: Record<string, any> = {}) {
        return {
            component,
            componentProps: props,
            showBackdrop: true, // 어두운 배경 여부
            backdropDismiss: true, // 배경 클릭시 닫기 여부
            initialBreakpoint: option?.initialBreakpoint || 1, // 초기 브레이크 포인트
            breakpoints: option?.breakpoints || [0, 1], // 브레이크 포인트
            handle: option?.handle ?? true, // handle 여부
            cssClass: [ 'ion-sheet-wrapper' ] // 기본 클래스 추가
                .concat(option?.isBackbuttonPrevent ? [ 'backbutton-prevent' ] : []) // 뒤로가기 막기 플래그에 따른 클래스 추가
                .concat(option?.css || []), // modal 별 적용 클래스 추가
        };
    }

    // Modal Option (화면 일부분만 채우는 Layer Popup)
    function getModalOption(component: any, { props, option }: Record<string, any> = {}) {
        return {
            component,
            componentProps: props,
            showBackdrop: true, // 어두운 배경 여부
            backdropDismiss: true, // 배경 클릭시 닫기 여부
            cssClass: [ 'ion-modal-wrapper' ] // 기본 클래스 추가
                .concat(option?.isBackbuttonPrevent ? [ 'backbutton-prevent' ] : []) // 뒤로가기 막기 플래그에 따른 클래스 추가
                .concat(option?.css || []), // modal 별 적용 클래스 추가
        };
    }

    // Popup Option (화면 꽉채우는 Layer Popup)
    function getPopupOption(component: any, { props, option }: Record<string, any> = {}) {
        return {
            component,
            componentProps: props,
            showBackdrop: true, // 어두운 배경 여부
            backdropDismiss: true,// 배경 클릭시 닫기 여부
            cssClass: [ 'ion-popup-wrapper' ] // 라우터에서 사용할 "view-popup" 클래스 추가
                .concat(option?.isBackbuttonPrevent ? [ 'backbutton-prevent'] : []) // 뒤로가기 막기 플래그에 따른 클래스 추가
                .concat(option?.css || []), // modal 별 적용 클래스 추가
        };
    }

    return {
        // Bottom Sheet Open (하단에서 올라오는 일부분만 채우는 Layer Popup)
        openSheet: async(component: any, { props, option }: Record<string, any> = {}) => {
            const opt = getSheetOption(component, { props, option });
            const sheet = await modalController.create(opt);

            sheet.present();

            const { data, role } = await sheet.onDidDismiss();

            return { result: role === 'ok', data, type: 'sheet' };
        },

        // Bottom Sheet Close (하단에서 올라오는 일부분만 채우는 Layer Popup)
        closeSheet: (result: boolean, data: any = null) => {
            modalController.dismiss(data, result ? 'ok' : 'cancel');
        },

        // Modal Open (화면 일부분만 채우는 Layer Popup)
        openModal: async(component: any, { props, option }: Record<string, any> = {}) => {
            const opt = getModalOption(component, { props, option });
            const modal = await modalController.create(opt);

            modal.present();

            const { data, role } = await modal.onDidDismiss();

            return { result: role === 'ok', data, type: 'modal' };
        },

        // Modal Close (화면 일부분만 채우는 Layer Popup)
        closeModal: (result: boolean, data: any = null) => {
            modalController.dismiss(data, result ? 'ok' : 'cancel');
        },

        // Popup Open (화면 꽉채우는 Layer Popup)
        openPopup: async(component: any, { props, option }: Record<string, any> = {}) => {
            const { requestTr } = useNetwork();
            const opt = getPopupOption(component, { props, option });
            const popup = await modalController.create(opt);

            popup.present();

            // 화면 추적(팝업 오픈) 전문 호출 (await 없이 호출)
            requestTr({
                trcode: 'DM9999',
                body: {
                    from: location.pathname,
                    to: component.__name,
                },
                isMock: true
            });

            const { data, role } = await popup.onDidDismiss();

            // 화면 추적(팝업 닫기) 전문 호출 (await 없이 호출)
            requestTr({
                trcode: 'DM9999',
                body: {
                    from: component.__name,
                    to: location.pathname,
                },
                isMock: true
            });

            return { result: role === 'ok', data, type: 'popup' };
        },

        // Popup Close (화면 꽉채우는 Layer Popup)
        closePopup: (result: boolean, data: any = null) => {
            modalController.dismiss(data, result ? 'ok' : 'cancel');
        },
    };
}