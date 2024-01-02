import './assets/main.css'

import { createApp } from 'vue'
import { init } from './database/database';

import { setupFA } from './font-awesome';

import App from './App.vue'
import router from './router'

init();

const app = createApp(App)

setupFA(app);

app.use(router)

app.mount('#app')