import { TypeGetUsers, TypeResponFromServer } from '../../../../@types/type';
import myFetch from '../utils/myFetch.js';

const tableHead = `
    <tr>
        <th>ФИО</th>
        <th>ID</th>
        <th>Статус</th>
        <th>Дата рождения</th>
        <th>Почта</th>
        <th>Роль</th>
        <th>Действия</th>
    </tr>
`;

export default function ListModule(root: HTMLElement) {
    const layot = document.createElement('div');
    layot.innerHTML = `
        <div style="margin-bottom: 20px">
            <input id="search" style="margin-bottom: 5px" type="text" placeholder="Поиск по ID"/>
            </br>
            <input id="all" type="submit" value="Показать всех" />
        </div>
    `;
    root.appendChild(layot);

    let parentTable = document.createElement('div');
    root.appendChild(parentTable);

    const search = layot.querySelector('#search') as HTMLInputElement;
    search.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            myFetch<TypeGetUsers[]>('/search?id=' + search.value).then(res => {
                if (res.err) alert(res.err);
                else addUsers(parentTable, res.respon);
            });

            /* fetch('http://localhost:3000/search?id=' + search.value)
                .then(res => res.json())
                .then((res: TypeResponFromServer<TypeGetUsers[]>) => {
                    if (res.err) alert(res.err);
                    else {
                        let { respon } = res;
                        addUsers(parentTable, respon);
                    }
                }); */
        }
    });

    const showAll = layot.querySelector('#all') as HTMLAnchorElement;
    showAll.addEventListener('click', e => {
        e.preventDefault();

        myFetch<TypeGetUsers[]>('/all').then(res => {
            if (res.err) alert(res.err);
            else addUsers(parentTable, res.respon);
        });

        /* fetch('http://localhost:3000/all')
            .then(res => res.json())
            .then((res: TypeResponFromServer<TypeGetUsers[]>) => {
                if (res.err) alert(res.err);
                else {
                    let { respon } = res;
                    addUsers(parentTable, respon);
                }
            }); */
    });
}

function addUsers(parentTable: HTMLDivElement, users: TypeGetUsers[]) {
    if ((parentTable as any)._hasTable) parentTable.innerHTML = '';

    const table = document.createElement('table');
    table.border = '1';
    table.setAttribute('id', 'listTable');
    table.innerHTML = tableHead;

    users.forEach(user => {
        let { FIO, birthday, email, id, isActive, rol } = user;

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <tr>
                <td>${FIO}</td>
                <td>${id}</td>
                <td id="status_${id}">${isActive == 1 ? 'Активен' : 'Неактивен'}</td>
                <td>${birthday}</td>
                <td>${email}</td>
                <td>${rol}</td>
                <td><a id="block_${id}" href="#">${
            isActive == 1 ? 'Заблокировать' : 'Разблокировать'
        }</a></td>
            </tr>
        `;

        let block = tr.querySelector('#block_' + id) as HTMLAnchorElement;
        let status = tr.querySelector('#status_' + id) as HTMLTableCellElement;

        block.addEventListener('click', e => {
            e.preventDefault();

            myFetch('/block/' + id).then(res => {
                if (res.err) alert(res.err);
                else {
                    status.textContent = status.textContent === 'Активен' ? 'Неактивен' : 'Активен';

                    block.textContent =
                        block.textContent === 'Заблокировать' ? 'Разблокировать' : 'Заблокировать';
                }
            });

            /* fetch('http://localhost:3000/block/' + id)
                .then(res => res.json())
                .then((res: TypeResponFromServer) => {
                    if (res.err) alert(res.err);
                    else {
                        status.textContent = status.textContent === 'Активен' ? 'Неактивен' : 'Активен';

                        block.textContent =
                            block.textContent === 'Заблокировать' ? 'Разблокировать' : 'Заблокировать';
                    }
                }); */
        });

        table.appendChild(tr);
    });

    (parentTable as any)._hasTable = true;
    parentTable.appendChild(table);
}
