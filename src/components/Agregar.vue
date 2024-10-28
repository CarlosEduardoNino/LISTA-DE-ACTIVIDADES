<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nueva Actividad</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="formData.actividad"
            type="textarea"
            label="Actividad"
            :rules="[val => !!val || 'La actividad es requerida']"
          />

          <q-input
            v-model="formData.fecha"
            type="date"
            label="Fecha"
            class="q-mt-md"
            :rules="[val => !!val || 'La fecha es requerida']"
          />

          <q-select
            v-model="formData.estado"
            :options="estadoOptions"
            label="Estado"
            class="q-mt-md"
            :rules="[val => !!val || 'El estado es requerido']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            type="button"
            flat
            color="negative"
            :to="{ name: 'actividades' }"
          />
          <q-btn
            label="Guardar"
            type="submit"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useActividadesStore } from '../stores/stores'

const router = useRouter()
const store = useActividadesStore()

const formData = ref({
  actividad: '',
  fecha: '',
  estado: ''
})

const estadoOptions = ['Completado', 'Pendiente']

const onSubmit = () => {
  store.agregarActividad(formData.value)
  router.push({ name: 'actividades' })
}
</script>