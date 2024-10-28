<template>
  <div class="q-pa-md">
    <form @submit.prevent="onSubmit" class="q-gutter-md">
      <div class="form-card">
        <div class="bg-primary text-white">
          <div class="text-h6">
            <i class="q-icon q-mr-sm" aria-hidden="true" data-icon="edit"></i>
            Editar Actividad
          </div>
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="q-input input-field">
              <textarea
                v-model="formData.actividad"
                class="q-input-target"
                required
              ></textarea>
              <div class="q-input-append">
                <i class="q-input-icon" aria-hidden="true" data-icon="assignment"></i>
              </div>
              <label class="q-input-label">
                Actividad
                <span class="q-input-required">*</span>
              </label>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="q-input input-field">
              <input
                v-model="formData.fecha"
                type="date"
                class="q-input-target"
                required
              >
              <div class="q-input-append">
                <i class="q-input-icon" aria-hidden="true" data-icon="event"></i>
              </div>
              <label class="q-input-label">
                Fecha
                <span class="q-input-required">*</span>
              </label>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="q-select input-field">
              <select
                v-model="formData.estado"
                class="q-input-target"
                required
              >
                <option v-for="option in estadoOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <div class="q-select-append">
                <i class="q-select-icon" aria-hidden="true" data-icon="flag"></i>
              </div>
              <label class="q-select-label">
                Estado
                <span class="q-select-required">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="q-pa-mdw">
        <div class="q-btn-group">
          <button
            type="button"
            class="q-btn q-btn-flat q-btn-negative"
            @click="$router.push('/')"
          >
            <i class="q-icon q-btn-icon" aria-hidden="true" data-icon="close"></i>
            Cancelar
          </button>
          <button
            type="submit"
            class="q-btn q-btn-flat q-btn-primary"
          >
            <i class="q-icon q-btn-icon" aria-hidden="true" data-icon="save"></i>
            Actualizar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useActividadesStore } from '../stores/stores'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const store = useActividadesStore()

const actividadId = Number(route.params.id)

const formData = ref({
  actividad: '',
  fecha: '',
  estado: ''
})

const estadoOptions = ['Completado', 'Pendiente', 'En Progreso', 'Cancelado']

const getStatusColor = (estado) => {
  const statusColors = {
    'Pendiente': 'orange',
    'En Progreso': 'blue',
    'Completado': 'green',
    'Cancelado': 'red'
  }
  return statusColors[estado] || 'grey'
}

onMounted(() => {
  const actividad = store.obtenerActividad(actividadId)
  
  if (actividad) {
    formData.value = {
      actividad: actividad.actividad,
      fecha: actividad.fecha,
      estado: actividad.estado
    }
  } else {
    $q.notify({
      type: 'negative',
      message: 'Actividad no encontrada',
      position: 'top'
    })
    router.push('/')
  }
})

const onSubmit = () => {
  try {
    store.editarActividad(actividadId, {
      ...formData.value,
      id: actividadId
    })
    
    $q.notify({
      type: 'positive',
      message: 'Actividad actualizada exitosamente',
      position: 'top'
    })
    
    router.push('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar la actividad',
      position: 'top'
    })
    console.error('Error al actualizar actividad:', error)
  }
}
</script>

<style scoped>
.form-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.bg-primary {
  background-color: #027be3;
  color: #fff;
  padding: 10px;
  border-radius: 5px 5px 0 0;
}

.bg-primary .text-h6 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.q-icon {
  font-size: 24px;
  margin-right: 10px;
}

.input-field {
  margin-bottom: 20px;
}

.q-input, .q-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.q-input-target, .q-select-target {
  width: 100%;
  height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.q-input-append, .q-select-append {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}

.q-input-icon, .q-select-icon {
  font-size: 24px;
}

.q-input-label, .q-select-label {
  
  padding: 10px;
  font-size: 16px;
  color: #666;
}

.q-input-required, .q-select-required {
  color: #f00;
}

.q-btn-group {
  display: flex;
  justify-content: flex-end;
}

.q-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.q-btn-flat {
  background-color: transparent;
  border: 1px solid #ccc;
}

.q-btn-negative {
  background-color: #f00;
  color: #fff;
}

.q-btn-primary {
  background-color: #027be3;
  color: #fff;
}

.q-btn-icon {
  font-size: 24px;
  margin-right: 10px;
}
 
.q-pa-md   {
  padding: 20px;
}





</style>