declare global {
    interface Window {
        bizMOB: Record<any, any>; // window에 포함될 전역 변수 declare
        forge: Record<any, any>; // window에 포함될 전역 변수 declare
    }

    /** 전역 Type 선언 */

    // Json Type
    type Json = { [key: string]: any };

    // requestTr 요청 타입
    interface ReqTr {
        trcode: string;
        httpHeader?: { [key: string]: any };
        header?: { [key: string]: any };
        body?: { [key: string]: any };
        fileList?: any[];
        timeout?: number;
        isMock?: boolean;
        isLoading?: boolean;
        isErrorAlert?: boolean;
    }

    // requestApi 요청 타입
    interface ReqApi {
        url: string;
        httpHeader?: { [key: string]: any };
        body?: T;
        timeout?: number;
        isLoading?: boolean;
        isErrorAlert?: boolean;
    }

    // requestLogin 요청 타입
    interface ReqLogin {
        userId: string;
        password: string;
        trcode: string;
        httpHeader?: { [key: string]: any };
        header?: { [key: string]: any };
        body?: { [key: string]: any };
        timeout?: number;
        isMock?: boolean;
        isLoading?: boolean;
        isErrorAlert?: boolean;
    }

    // request 응답 타입
    interface Res {
        result: boolean; // 응답 결과
        errorCode: string; // 에러 코드. 정상인 경우 ''
        trcode: string; // TR 코드
        header: { [key: string]: any }; // 응답 헤더
        body: { [key: string]: any }; // 응답 바디
    }

    interface MoreItem {
        pageNum: number;
        next: number;
        complete: () => void;
    }

    /**
     * SelectBox Option Interface
     * @property {string|number} text - option text
     * @property {string|number} value - option value
     * @property {any} [item] - 원본 데이터
     * @property {boolean} [selected] - option 기본 선택 여부
     */
    interface Option {
        text: string | number;
        value: string | number | null;
        item?: any;
        selected?: boolean;
    }
}

export { };