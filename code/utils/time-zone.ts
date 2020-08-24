// export const TimeZone = {
//     calculateTime(date: string, hourOfDay: string, timeZone: number): number {
//         const timeAtYearStart = new Date(`${date.substr(0, 4)}-01-01 ${hourOfDay}`).toISOString().substr(11, 2);
//         const timeAtTargetDateStart = new Date(`${date} ${hourOfDay}`).toISOString().substr(11, 2);
//         const shouldAddOneHour = timeAtYearStart !== timeAtTargetDateStart;
//         const timeZoneCorrected = shouldAddOneHour ? timeZone + 1 : timeZone;
//         const isoTime = `${date} ${hourOfDay}:00.000${`${timeZoneCorrected < 0 ? `-` : `+`}${Math.abs(timeZoneCorrected)}`.padStart(2, `0`)}:00`;
//         const dateTime = new Date(isoTime);

//         return {
//             timeAtYearStart,
//             timeAtTargetDateStart,
//             shouldAddOneHour,
//             timeZoneCorrected,
//             isoTime,
//             dateTime,
//         };
//         // return moment.utc(`${date} ${hourOfDay}`).utcOffset(timeZone, true).toDate().getTime() as Timestamp;
//     },
// };


// const test = (date: string, hourOfDay: string, timeZone: number, expected: number) => {

// };

// test(`2020-07-01`, `12:00`, -6, new Date(2020, 7 - 1, 1 - 1, 12).getTime());
