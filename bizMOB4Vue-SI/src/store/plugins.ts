import CryptoJS from 'crypto-js';

// state 값 변화시 Storage에 저장하는 플러그인
export const customStorage = (storage: any) => {
    // Storage 사용 여부
    const isStorage = process.env.VUE_APP_VUEX_STORAGE_USE === 'true';

    // 암호화 키
    const ENCRYPT_PREFIX = '__enc__';
    const SECRET_KEY = process.env.VUE_APP_STORAGE_ENCRYPTION_KEY || '';

    // 암호화 사용 여부
    const isCrypto = SECRET_KEY && (process.env.VUE_APP_VUEX_ENCRYPTION_USE === 'true');

    // 키를 생성하는 함수: prefix와 path를 결합하여 고유 키를 생성합니다.
    const getKey = (prefix: string, path: string) => `${prefix}::${path}`;

    // prefix를 생성하는 함수: prefix에 "::"를 붙여서 반환합니다.
    const getPrefix = (prefix: string) => `${prefix}::`;

    // 경로를 얻는 함수: "::"로 구분된 키에서 두 번째 부분을 반환합니다.
    const getPath = (key: string) => key.split('::')[1];

    // 암호화 함수
    const encrypt = (data: string): string => isCrypto ? ENCRYPT_PREFIX + CryptoJS.AES.encrypt(data, SECRET_KEY).toString() : data;
    
    // 복호화 함수
    const decrypt = (data: string): string | null => {
        // 암호화 사용 여부에 따라 복호화 또는 원본 데이터 반환
        if (isCrypto) {
            // 암호화 사용 중인데, 암호화 구분자가 없는 경우 null 반환
            if (!data.startsWith(ENCRYPT_PREFIX)) {
                return null; // 암호화 사용 중인데 암호화 구분자가 없는 경우 null 데이터 반환
            }
            else {
                // 암호화된 데이터에서 ENCRYPT_PREFIX를 제거하고 복호화
                const encryptedData = data.replace(ENCRYPT_PREFIX, '');
                const decryptedData = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);

                // 복호화된 데이터가 비어있지 않으면 반환
                if (decryptedData) {
                    return decryptedData;
                } else {
                    return null; // 복호화 실패 시 null 데이터 반환
                }
            }
        }
        else {
            // 암호화 사용 안하는데, 암호화 구분자가 있는 경우 null 반환
            if (data.startsWith(ENCRYPT_PREFIX)) {
                return null; // 암호화 사용 안함에도 불구하고 암호화된 데이터가 들어온 경우 null 반환
            }
            else {
                return data; // 암호화 사용 안함
            }
        }
    };

    return {
        // 저장소에서 모든 항목을 가져오는 함수
        getItem: () => {
            if (!isStorage) {
                return {}; // Storage 사용 안함
            }

            const json: any = {};
            for (const path in storage) {
                if (Object.prototype.hasOwnProperty.call(storage, path)) {
                    const value = storage[path];
                    let data = null; // 복호화된 데이터 초기화

                    try {
                        data = decrypt(value); // 복호화
                    }
                    catch (error) {
                        data = value; // 복호화 실패 시 원본 데이터 사용
                    }

                    // 복호화 실패시 state에 저장 안하고 건너뛰기
                    if (data === null) {
                        continue; // 복호화 실패 시 해당 항목 건너뛰기
                    }
                    else {
                        try {
                            // JSON 형식으로 변환할 수 있으면 변환해서 저장
                            json[getPath(path)] = JSON.parse(data);
                        } catch (error) {
                            // JSON 형식이 아니면 그대로 저장
                            json[getPath(path)] = data;
                        }
                    }
                }
            }

            return json;
        },
        // 항목을 저장소에 설정하는 함수
        setItem: (key: string, value: string) => {
            if (!isStorage) {
                return null; // Storage 사용 안함
            }

            const object = JSON.parse(value);
            for (const path in object) {
                if (Object.prototype.hasOwnProperty.call(object, path)) {
                    const storageKey = getKey(key, path);
                    const state = object[path];

                    try {
                        const data = JSON.stringify(state);
                        const encryptedData = encrypt(data); // 암호화
                        // 객체를 JSON 형식으로 저장
                        storage.setItem(storageKey, encryptedData);
                    } catch (error) {
                        // JSON 형식으로 변환할 수 없으면 그대로 저장
                        storage.setItem(storageKey, encrypt(state));
                    }
                }
            }
        },
        // 특정 키를 포함하는 항목을 저장소에서 제거하는 함수
        removeItem: (key: string) => {
            if (!isStorage) {
                return null; // Storage 사용 안함
            }

            for (const path in storage) {
                if (Object.prototype.hasOwnProperty.call(storage, path)) {
                    // 특정 키가 포함된 항목을 찾아서 제거
                    if (path.includes(getPrefix(key))) {
                        storage.removeItem(path);
                    }
                }
            }
        }
    };
};