import { createRouter, createWebHashHistory } from "vue-router";
import Actividades from "../components/Actividades.vue";
import Agregar from "../components/Agregar.vue";
import Editar from "../components/Editar.vue";

const routes = [
    {
        path: "/",
        name: "actividades",
        component: Actividades
    },
    {
        path: "/agregar",
        name: "agregar",
        component: Agregar
    },
    {
        path: "/editar/:id",  
        name: "editar",       
        component: Editar
    }
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});
