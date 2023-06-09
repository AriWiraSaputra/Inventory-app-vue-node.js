import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import ItemForm from './components/Item/ItemForm.vue';
import CustomerForm from './components/Customer/CustomerForm.vue';
import SalesForm from './components/Sales/SalesForm.vue';


const routes = [
  { path: '/items/new', component: ItemForm },{ path: '/customers/new', component: CustomerForm }, { path: '/sales/new', component: SalesForm },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
