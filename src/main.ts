import {createApp} from 'vue'
import './assets/style.css'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import About from "./components/About.vue";
import Players from "./components/Players.vue";

const app = createApp(App)
const routes = [
    {path: '/about', component: About},
    {path: '/players', component: Players},
]
app.use(createRouter({history: createWebHistory('/'), routes}))
app.mount('#app')
