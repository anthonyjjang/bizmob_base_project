import moment from 'moment';

/**
 * @title Date Composable
 * @description Moment의 제어와 연관된 공통함수
 */
export function useDate() {
    // 기본 날짜 포맷
    function getDefaultFormat() {
        const year = 'YYYY';
        const month = 'MM';
        const date = 'YYYY/MM/DD';
        const time = 'HH:mm:ss';
        const full = 'YYYY/MM/DD HH:mm:ss';

        return {
            year,
            month,
            date,
            time,
            full,
        };
    }

    return {
        // 날짜 포맷 조회
        get dateFormat() {
            return getDefaultFormat();
        },

        // moment 조회
        get moment() {
            return moment;
        },

        // 오늘 날짜 moment 형식으로 조회
        today() {
            return moment();
        },

        // 날짜를 YYYYMMDD 형식으로 변환
        toYYYYMMDD(date: string | Date | moment.Moment) {
            return moment(date).format('YYYYMMDD');
        },

        // String 또는 Date 또는 moment 형식을 Date Format 형태로 변경
        // - toFormattedDate(today, 'year) => 'YYYY'
        // - toFormattedDate(today, 'month') => 'MM
        // - toFormattedDate(today, 'date') => 'YYYY/MM/DD
        // - toFormattedDate(today, 'time') => 'HH:mm:ss
        // - toFormattedDate(today, 'full') => 'YYYY/MM/DD HH:mm:ss
        // - toFormattedDate(today, 'YYYY-MM-DD') => 'YYYY-MM-DD'
        toFormattedDate(date: string | Date | moment.Moment, format?: 'year' | 'y' | 'month' | 'm' | 'date' | 'd' | 'time' | 't' | 'full' | 'f' | string) {
            const defaultFormat = getDefaultFormat();
            const momentDate = moment(date);

            if (format === 'year' || format === 'y') {
                return momentDate.format(defaultFormat.year);
            }
            else if (format === 'month' || format === 'm') {
                return momentDate.format(defaultFormat.month);
            }
            else if (format === 'date' || format === 'd') {
                return momentDate.format(defaultFormat.date);
            }
            else if (format === 'time' || format === 't') {
                return momentDate.format(defaultFormat.time);
            }
            else if (format === 'full' || format === 'f') {
                return momentDate.format(defaultFormat.full);
            }
            else {
                return momentDate.format(format);
            }
        }
    };
}