import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus, faCircleXmark, faUndo, faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

library.add(faPencil, faTrash, faCirclePlus, faSquareMinus, faSquarePlus, faCircleXmark, faUndo, faChevronCircleDown, faChevronCircleUp);

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)

app.mount('#app')
