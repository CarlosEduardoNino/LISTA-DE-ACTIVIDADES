import { createApp } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';
import App from './App.vue';
import { router } from './routes/routes.js'; 
import{createPinia} from 'pinia'
import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'quasar/src/css/index.sass';
const pinia =createPinia()
pinia.use(piniaPluginPersistedstate)
const myapp = createApp(App);

myapp.use(Quasar, {
    plugins: {}, 
});
myapp.use(pinia)
myapp.use(router);

myapp.mount('#app');
