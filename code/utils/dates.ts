import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export const formatDate = (date: Date | number | string) => {
    return dayjs(date).format(`L`);
};
