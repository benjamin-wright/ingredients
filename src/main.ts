import './assets/main.css'

import { createApp } from 'vue'
import { init } from './database/database';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
    faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
    faSquare, faCheckSquare, faEllipsis, faList, faListOl
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
    faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
    faSquare, faCheckSquare, faEllipsis, faList, faListOl
);

import App from './App.vue'
import router from './router'

init();

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')