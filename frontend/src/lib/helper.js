import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);
dayjs.calendar("jalali");


export const formatPrice = (value = 0) => {
    let calc;

    if (value === 0) {
        calc = "رایگان";
    } else {
        calc = new Intl.NumberFormat('fa-IR').format(value);
    }
    return calc
};

// فرمت کننده اعداد ساده
export const formatNumber = (value) => {
    return new Intl.NumberFormat('fa-IR').format(value);
};


const toPersianDigits = (input) => {
    if (input === null || input === undefined) return "";
    const str = String(input); // ⚡ تبدیل به رشته
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

export const formatTime = (date) => {
    if (!date) return "";
    const d = dayjs(date).calendar("jalali");

    if (!d.isValid()) return "تاریخ نامعتبر";

    const year = toPersianDigits(d.year());
    const month = toPersianDigits(String(d.month() + 1).padStart(2, "0"));
    const day = toPersianDigits(String(d.date()).padStart(2, "0"));

    return `${year}/${month}/${day}`;
};

