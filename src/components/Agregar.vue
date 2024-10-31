<template>
  <div class="form-container">
    <form @submit.prevent="onSubmit" class="activity-form">
      <div class="form-header">
        <h2>Nueva Actividad</h2>
      </div>
      
      <div class="form-body">
        <div class="form-group">
          <label for="actividad">Actividad</label>
          <textarea
            id="actividad"
            v-model="formData.actividad"
            class="form-textarea"
            :class="{ 'error': errors.actividad }"
            placeholder="Describe la actividad..."
            @blur="validateField('actividad')"
          ></textarea>
          <span v-if="errors.actividad" class="error-message">
            {{ errors.actividad }}
          </span>
        </div>

        <div class="form-group">
          <label for="fecha">Fecha</label>
          <input
            id="fecha"
            type="date"
            v-model="formData.fecha"
            class="form-input"
            :class="{ 'error': errors.fecha }"
            @blur="validateField('fecha')"
          >
          <span v-if="errors.fecha" class="error-message">
            {{ errors.fecha }}
          </span>
        </div>

        <div class="form-group">
          <label for="estado">Estado</label>
          <select
            id="estado"
            v-model="formData.estado"
            class="form-select"
            :class="{ 'error': errors.estado }"
            @blur="validateField('estado')"
          >
            <option value="" disabled>Selecciona un estado</option>
            <option value="Completado">Completado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
          <span v-if="errors.estado" class="error-message">
            {{ errors.estado }}
          </span>
        </div>
      </div>

      <div class="form-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="onCancel"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!isFormValid"
        >
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useActividadesStore } from '../stores/stores'
import Swal from 'sweetalert2'

const router = useRouter()
const store = useActividadesStore()

const formData = ref({
  actividad: '',
  fecha: '',
  estado: ''
})

const errors = ref({
  actividad: '',
  fecha: '',
  estado: ''
})

const validateField = (field) => {
  errors.value[field] = ''
  
  switch (field) {
    case 'actividad':
      if (!formData.value.actividad.trim()) {
        errors.value.actividad = 'La actividad es requerida'
      }
      break
    case 'fecha':
      if (!formData.value.fecha) {
        errors.value.fecha = 'La fecha es requerida'
      }
      break
    case 'estado':
      if (!formData.value.estado) {
        errors.value.estado = 'El estado es requerido'
      }
      break
  }
}

const validateForm = () => {
  validateField('actividad')
  validateField('fecha')
  validateField('estado')
}

const isFormValid = computed(() => {
  return formData.value.actividad.trim() && 
         formData.value.fecha && 
         formData.value.estado &&
         !errors.value.actividad &&
         !errors.value.fecha &&
         !errors.value.estado
})

const onSubmit = async () => {
  validateForm()
  if (isFormValid.value) {
    try {
      await store.agregarActividad({
        actividad: formData.value.actividad,
        fecha: formData.value.fecha,
        estado: formData.value.estado,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Actividad guardada exitosamente',
        timer: 3000,
        timerProgressBar: true,
        position: 'top',
      });
      router.push({ name: 'actividades' }); 
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al guardar la actividad',
        position: 'top',
      });
    }
  }
}

const onCancel = () => {
  router.push({ name: 'actividades' })
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.activity-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.form-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.error {
  border-color: #dc2626;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.form-footer {
  padding: 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

@media (max-width: 640px) {
  .form-container {
    margin: 1rem auto;
  }
  
  .form-header,
  .form-body,
  .form-footer {
    padding: 1rem;
  }
}
</style>