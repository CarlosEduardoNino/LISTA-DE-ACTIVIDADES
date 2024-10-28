import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActividadesStore = defineStore('actividades', () => {
  const actividades = ref([])
  
  const agregarActividad = (actividad) => {
    actividades.value.push({
      id: Date.now(),
      ...actividad,
      createdAt: new Date().toISOString()
    })
  }
  
  const editarActividad = (id, actividadActualizada) => {
    const index = actividades.value.findIndex(act => act.id === id)
    if (index !== -1) {
      actividades.value[index] = {
        ...actividades.value[index],
        ...actividadActualizada,
        updatedAt: new Date().toISOString()
      }
    }
  }

  const eliminarActividad = (id) => {
    const index = actividades.value.findIndex(act => act.id === id)
    if (index !== -1) {
      actividades.value.splice(index, 1)
    }
  }
  
  const obtenerActividad = (id) => {
    return actividades.value.find(act => act.id === id)
  }
  
  return {
    actividades,
    agregarActividad,
    editarActividad,
    eliminarActividad,
    obtenerActividad
  }
}, {
  persist: true
})