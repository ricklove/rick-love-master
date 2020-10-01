import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const formatDate = (date: Date | number | string) => {
    return dayjs(date).format(`L`);
};

export const formatDate_FromNow = (date: Date | number | string) => {
    return dayjs(date).fromNow();
};
