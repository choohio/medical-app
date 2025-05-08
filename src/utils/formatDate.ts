import { DateTime } from 'luxon';

export function formatDate(date: string) {
    return DateTime.fromISO(date).setLocale('ru').toFormat('d MMMM (cccc)');
}
