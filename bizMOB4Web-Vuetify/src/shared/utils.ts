import DOMPurify from 'dompurify';

/**
 * @title Utils
 * @description 개별적인 작은 기능들을 모아놓은 공통함수
 */

// string or number 형태의 숫자를 comma number로 변경 (comma가 있는 String 숫자는 콤마 제거 후 변환)
export function toComma(amt: any, minDigits = 0, maxDigits = 0) {
    if (amt) {
        const num = typeof amt === 'number' ? amt : Number(amt.replace(/,/g, ''));

        if (isNaN(num)) {
            return amt;
        }
        else if (minDigits && maxDigits) {
            return Intl.NumberFormat(undefined, { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits }).format(num);
        }
        else if (minDigits) {
            return Intl.NumberFormat(undefined, { minimumFractionDigits: minDigits }).format(num);
        }
        else if (maxDigits) {
            return Intl.NumberFormat(undefined, { maximumFractionDigits: maxDigits }).format(num);
        }
        else {
            return Intl.NumberFormat().format(num);
        }
    }
    else {
        return amt;
    }
}

// string을 html 형태로 변환 ('\n' => '<br />')
export function toHtml(str: string | null) {
    if (str) {
        // 엔터 처리를 위한 변환 및 XSS 방지를 위한 정화
        const sanitized = DOMPurify.sanitize(str);
        return sanitized.replace(/\n/g, '<br>');
    }
    else {
        return '';
    }
}

// 파일 사이즈 변환
export function toFileSize(size: string | number, unit?: 'Bytes' | 'KB' | 'MB' | 'GB') {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const K = 1024;
    const bytes = Number(size);

    if (unit) {
        const decimals = sizes.indexOf(unit);

        if (decimals === 0) {
            return bytes.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
        else {
            const str = parseFloat((bytes / K ** decimals).toFixed(1));
            return str.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
    }
    else {
        const num = Math.floor(Math.log(bytes) / Math.log(K));
        const decimals = parseInt(String(num), 10);

        if (decimals === 0 ) {
            return `${bytes} ${sizes[decimals]}`;
        }
        else {
            return `${(bytes / (K ** decimals)).toFixed(1)} ${sizes[decimals]}`;
        }
    }
}

// await 대기 함수
export function wait(delay: number) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}