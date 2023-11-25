import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
    faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
    faSquare, faCheckSquare, faEllipsis
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus,
    faCircleXmark, faUndo, faUpDown, faChevronCircleDown, faChevronCircleUp,
    faSquare, faCheckSquare, faEllipsis
);

import App from './App.vue'
import router from './router'
import { query } from './database/database'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)

app.mount('#app')

query('SELECT * FROM categories', {}, (row) => ({ id: row[0] as number })).then(rows => console.log(rows));