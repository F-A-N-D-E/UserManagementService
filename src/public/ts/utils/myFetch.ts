import { TypeResponFromServer } from '../../../../@types/type';

export default function myFetch<T = 'ok'>(url: string, otherOption?: RequestInit) {
    const defaultOption: RequestInit = {
        credentials: 'include',
        ...otherOption,
    };

    return fetch(`http://localhost:3000${url}`, defaultOption)
        .then(res => res.json())
        .then((res: TypeResponFromServer<T>) => {
            return res;
        });
}
