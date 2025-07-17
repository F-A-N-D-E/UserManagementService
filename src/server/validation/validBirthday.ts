export default function validBirthday(date: string) {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(date)) return false;

    const [dayStr, monthStr, yearStr] = date.split('.');
    const day = parseInt(dayStr);
    const month = parseInt(monthStr);
    const year = parseInt(yearStr);

    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();

    if (day < 1 || day > daysInMonth) return false;

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (birthDate > today) return false;

    return true;
}
