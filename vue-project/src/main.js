import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import { useUserStore } from "./composables/useUser.js";


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const user = useUserStore();
user.loadFromLocalStorage();

app.mount('#app');