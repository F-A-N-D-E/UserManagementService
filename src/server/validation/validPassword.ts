export default function validPassword(password: string): boolean {
    const regex = /^[A-Za-z0-9]{4,}$/;
    return regex.test(password);
}
