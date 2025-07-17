import { TypeResponFromServer } from '../../../../@types/type';

const BlockAuthorization = `
    <div class="BlockAuthorization">
        <a id="LoginWrapper" href="#">Login</a>
        <a id="RegistWrapper" href="#">Registration</a>
    </div>

    <div id="wrapperForm"></div>
`;
const registration = `
    <form id="registration">
        <input type="text" name="FIO" placeholder="ФИО" />
        <input
            type="text"
            name="birthday"
            placeholder="Дата рождения (ДД.ММ.ГГГГ)"
        />
        <input type="email" name="email" placeholder="Почта" />
        <input type="text" name="password" placeholder="Пароль" />

        <fieldset>
            <legend style="margin-left: 25px">Роль</legend>

            <div>
                <label
                    ><input
                        type="radio"
                        name="rol"
                        value="admin"
                        checked
                    />
                    Администратор</label
                >
            </div>

            <div>
                <label
                    ><input type="radio" name="rol" value="user" />
                    Пользователь</label
                >
            </div>
        </fieldset>

        <input type="submit" value="Регистрация" />
    </form>
`;
const login = `
    <form id="login">
        <input type="email" name="email" placeholder="Почта" />
        <input type="text" name="password" placeholder="Пароль" />

        <input type="submit" value="Войти" />
    </form>
`;

export default function AuthorizationModule(root: HTMLElement) {
    root.innerHTML = BlockAuthorization;

    const LoginWrapper = root.querySelector('#LoginWrapper') as HTMLAnchorElement;
    const RegistWrapper = root.querySelector('#RegistWrapper') as HTMLAnchorElement;

    const wrapperForm = root.querySelector('#wrapperForm') as HTMLDivElement;
    wrapperForm.innerHTML = registration;
    Form('registration');

    LoginWrapper.addEventListener('click', e => {
        e.preventDefault();
        wrapperForm.innerHTML = login;
        Form('login');
    });

    RegistWrapper.addEventListener('click', e => {
        e.preventDefault();
        wrapperForm.innerHTML = registration;
        Form('registration');
    });
}

function Form(id: 'login' | 'registration') {
    const form = document.getElementById(id) as HTMLFormElement;

    form.addEventListener('submit', e => {
        e.preventDefault();

        let formData = new FormData(form);

        if (id == 'login') {
            let url = new URLSearchParams();

            for (let [name, value] of formData.entries()) {
                url.set(name, value as string);
            }

            fetch('http://localhost:3000/login?' + url.toString())
                .then(result => result.json())
                .then((result: TypeResponFromServer) => {
                    if (result.err) alert(result.err);
                    else alert('Успешно');
                });
        } else {
            fetch('http://localhost:3000/registration', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData.entries())),
            })
                .then(result => result.json())
                .then((result: TypeResponFromServer) => {
                    if (result.err) alert(result.err);
                    else alert('Успешно');
                });
        }
    });
}
