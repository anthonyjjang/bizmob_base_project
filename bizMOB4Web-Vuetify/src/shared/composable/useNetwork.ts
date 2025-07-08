import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useMessage } from '@/shared/composable/useMessage';
import Network from '@/bizMOB/Xross/Network';
import App from '@/bizMOB/Xross/App';

/**
 * @title Network Composable
 * @description Network 요청과 관련된 셋팅 및 일련의 과정 처리
 */
export function useNetwork() {
    // TRCODE 응답값 에러 체크
    function handleTrcodeChecker(tr: any) {
        // 응답 전문 데이터 구조 오류
        if (typeof tr !== 'object' || tr === null || tr.header === undefined) {
            return {
                result: false,
                errorType: 'WAIT',
                errorCode: '',
                errorMessage: '알 수 없는 오류입니다.\n잠시후 다시 시도해 주세요.'
            };
        }
        // 긴급업데이트 처리
        else if (tr.header.content_update_flag && tr.header.emergency_flag) {
            return {
                result: false,
                errorType: 'RESTART',
                errorCode: '',
                errorMessage: '컨텐츠가 새 버전으로 변경되었습니다.\n확인을 눌러 업데이트를 진행해주세요.',
            };
        }
        else if (tr.header.result === false) {
            switch (tr.header.error_code) {
                case 'HE0404':
                case 'HE0503':
                case 'NE0001':
                case 'CE0001':
                    return {
                        result: false,
                        errorType: 'WAIT',
                        errorCode: tr.header.error_code,
                        errorMessage: `서버에 연결할 수 없습니다.\n(에러 코드: ${tr.header.error_code})`,
                    };

                case 'NE0002':
                case 'NE0003':
                    return {
                        result: false,
                        errorType: 'WAIT',
                        errorCode: tr.header.error_code,
                        errorMessage: `네트워크 상태가 좋지 않습니다.\n잠시후 다시 시도해 주세요.\n(에러 코드: ${tr.header.error_code})`,
                    };

                case 'ERR000': // 세션 끊김
                    return {
                        result: false,
                        errorType: 'RESTART',
                        errorCode: tr.header.error_code,
                        errorMessage: `장기간 미사용으로 접속이 끊어졌습니다.\n다시 로그인하시기 바랍니다.\n(에러 코드: ${tr.header.error_code})`,
                    };

                default:
                    return {
                        result: false,
                        errorType: 'WAIT',
                        errorCode: tr.header.error_code,
                        errorMessage: `${tr.header.error_text || '서버 연결 상태가 좋지 않습니다.\n잠시후 다시 시도해 주세요.'}\n(에러 코드: ${tr.header.error_code})`,
                    };
            }
        }
        // 정상
        else {
            return {
                result: true,
                errorType: 'SUCCESS',
                errorCode: '',
                errorMessage: '',
            };
        }
    }

    // TR 요청 Http Header 생성
    function generateHttpHeader() {
        return {
            // TODO
        };
    }

    // TR 요청 Header 생성
    function generateTrHeader() {
        return {
            // TODO
        };
    }

    // API 요청 Header 생성
    function generateApiHeader() {
        return {
            // TODO
        };
    }

    return {
        requestLogin: async({
            trcode,
            userId,
            password,
            httpHeader = {},
            header = {},
            body = {},
            timeout = 60, // sec 단위 (기본 60초)
            isMock = false,
            isLoading = true,
            isErrorAlert = true
        }: ReqLogin): Promise<Res> => {
            const { toggleProgress } = useAppStore();
            const { alert } = useMessage();

            /** Call Api */
            if (isLoading) {
                toggleProgress(true);
            }

            const res: any = await Network.requestLogin({
                _sTrcode: trcode,
                _sUserId: userId,
                _sPassword: password,
                _oHttpHeader: {
                    ...generateHttpHeader(),
                    ...httpHeader
                },
                _oHeader: {
                    ...generateTrHeader(),
                    ...header
                },
                _oBody: body,
                _bMock: isMock,
                _nTimeout: timeout,
                _bProgressEnable: false, // Native 프로그레스는 Off
            });

            if (isLoading) {
                toggleProgress(false);
            }

            /** 에러 확인 */
            const state: any = handleTrcodeChecker(res);

            // 성공
            if (state.result) {
                return {
                    result: state.result,
                    errorCode: state.errorCode,
                    trcode: trcode,
                    header: res.header,
                    body: res.body,
                };
            }
            // 실패
            else {
                // 재시작 처리
                if (state.errorType === 'RESTART') {
                    return await alert(state.errorMessage, () => {
                        App.exit({ _sType: 'logout' });

                        return {
                            result: state.result,
                            trcode: trcode,
                            errorCode: state.errorCode,
                            header: res.header,
                            body: res.body,
                        };
                    });

                }
                // 에러 Alert 표기 여부 확인
                else if (isErrorAlert) {
                    return await alert(state.errorMessage, () => ({
                        result: state.result,
                        errorCode: state.errorCode,
                        trcode: trcode,
                        header: res.header,
                        body: res.body,
                    }));
                }
                // 데이터 전달
                else {
                    return {
                        result: state.result,
                        errorCode: state.errorCode,
                        trcode: trcode,
                        header: res.header,
                        body: res.body,
                    };
                }
            }
        },

        requestTr: async({
            trcode,
            httpHeader = {},
            header = {},
            body = {},
            fileList = [],
            timeout = 60, // sec 단위 (기본 60초)
            isMock = false,
            isLoading = true,
            isErrorAlert = true
        }: ReqTr): Promise<Res> => {
            const { toggleProgress } = useAppStore();
            const { alert } = useMessage();

            /** Call Api */
            if (isLoading) {
                toggleProgress(true);
            }

            const res: any = await Network.requestTr({
                _sTrcode: trcode,
                _oHttpHeader: {
                    ...generateHttpHeader(),
                    ...httpHeader
                },
                _oHeader: {
                    ...generateTrHeader(),
                    ...header
                },
                _oBody: body,
                _aFileList: fileList,
                _bMock: isMock,
                _nTimeout: timeout,
                _bProgressEnable: false, // Native 프로그레스는 Off
            });

            if (isLoading) {
                toggleProgress(false);
            }

            /** 에러 확인 */
            const state: any = handleTrcodeChecker(res);

            // 성공
            if (state.result) {
                return {
                    result: state.result,
                    errorCode: state.errorCode,
                    trcode: trcode,
                    header: res.header,
                    body: res.body,
                };
            }
            // 실패
            else {
                // 재시작 처리
                if (state.errorType === 'RESTART') {
                    return await alert(state.errorMessage, () => {
                        App.exit({ _sType: 'logout' });

                        return {
                            result: state.result,
                            trcode: trcode,
                            errorCode: state.errorCode,
                            header: res.header,
                            body: res.body,
                        };
                    });

                }
                // 에러 Alert 표기 여부 확인
                else if (isErrorAlert) {
                    return await alert(state.errorMessage, () => ({
                        result: state.result,
                        errorCode: state.errorCode,
                        trcode: trcode,
                        header: res.header,
                        body: res.body,
                    }));
                }
                // 데이터 전달
                else {
                    return {
                        result: state.result,
                        errorCode: state.errorCode,
                        trcode: trcode,
                        header: res.header,
                        body: res.body,
                    };
                }
            }
        },

        requestApi: async({
            url,
            httpHeader = {},
            body,
            timeout = 60, // sec 단위 (기본 60초)
            isLoading = true,
            isErrorAlert = true,
        }: ReqApi): Promise<Res> => {
            const { toggleProgress } = useAppStore();
            const { alert } = useMessage();

            /** Call Api */
            if (isLoading) {
                toggleProgress(true);
            }

            const res: any = await Network.requestApi({
                _sMethod: 'POST',
                _sUrl: `${import.meta.env.VITE_APP_PROXY === 'on' ? import.meta.env.VITE_APP_PROXY_CONTEXT : import.meta.env.VITE_APP_SERVER_CONTEXT}${url}`,
                _oHeader: {
                    ...generateApiHeader(),
                    ...httpHeader,
                },
                _oBody: JSON.stringify(body ?? {}), // 또는 new URLSearchParams(body || {}).toString()
                _nTimeout: timeout,
            });

            if (isLoading) {
                toggleProgress(false);
            }

            // TODO - 서버에 따른 후 처리 로직은 프로젝트에서 별도 처리
            return res;
        },

        fileDownload: async(arg: {
            url: string,
            filename: string,
        }) => {
            const authStore = useAuthStore();

            fetch(arg.url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.accessToken}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;

                    // 여기서 파일 이름을 설정합니다.
                    a.download = arg.filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('There was an error!', error));
        }
    };
}