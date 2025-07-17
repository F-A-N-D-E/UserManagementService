export default function validFIO(FIO: string): boolean {
    let splitFIO = FIO.split(' ');
    let joinFIO = splitFIO.join();

    if (splitFIO.length < 3) return false;

    if (/[a-zA-Z]/g.test(joinFIO)) return false;

    return true;
}
