import AuthorizationModule from './module/AuthorizationModule.js';
import ListModule from './module/ListModule.js';

const authorization = document.getElementById('authorization');
const list = document.getElementById('list');

const root = document.getElementById('root');

authorization.addEventListener('click', e => {
    e.preventDefault();
    root.innerHTML = '';
    AuthorizationModule(root);
});

list.addEventListener('click', e => {
    e.preventDefault();
    root.innerHTML = '';
    ListModule(root);
});
