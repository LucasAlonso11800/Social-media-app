import moment from "moment"

export const transformDate = (date: string) => {
    const offset = new Date().getTimezoneOffset();

    return moment(date)
        .utc()
        .utcOffset(offset, true)
        .fromNow(true)
};