<template>
  <div class="q-pa-md">
    <q-card class="activities-container">
      <q-card-section class="bg-primary text-white header-section">
        <div class="text-h5">
          <q-icon name="list" class="q-mr-sm" />
          Actividades
        </div>
        <q-btn
          color="white"
          text-color="primary"
          @click="navigateTo('agregar')"
          label="Nueva Actividad"
          icon="add"
          class="new-activity-btn"
        />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="actividades"
          :columns="columns"
          row-key="id"
          class="activities-table"
          :rows-per-page-options="[10, 20, 50]"
          flat
          bordered
          :loading="loading"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-spinner-dots size="50px" />
            </q-inner-loading>
          </template>
          
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.estado)"
                text-color="white"
                size="sm"
              >
                {{ props.row.estado }}
              </q-chip>
            </q-td>
          </template>
          
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                :to="`/editar/${props.row.id}`"
                @click="editarActividad(props.row)"
                class="action-button"
              >
                <q-tooltip>Editar actividad</q-tooltip>
              </q-btn>
              
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="confirmarEliminacion(props.row)"
                class="action-button"
              >
                <q-tooltip>Eliminar actividad</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-8">
              <q-icon name="inbox" size="2em" class="q-mr-sm" />
              No hay actividades registradas
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Está seguro de eliminar esta actividad?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminarActividad" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useActividadesStore } from '../stores/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const store = useActividadesStore()
const { actividades } = storeToRefs(store)
const loading = ref(false)
const confirmDialog = ref(false)
const actividadToDelete = ref(null)

const editarActividad = (actividad) => {
  router.push(`/editar/${actividad.id}`)
}

const confirmarEliminacion = (actividad) => {
  actividadToDelete.value = actividad
  confirmDialog.value = true
}

const eliminarActividad = () => {
  try {
    store.eliminarActividad(actividadToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Actividad eliminada exitosamente',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar la actividad',
      position: 'top'
    })
  }
  actividadToDelete.value = null
}

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

const getStatusColor = (estado) => {
  const statusColors = {
    'Pendiente': 'orange',
    'En Progreso': 'blue',
    'Completado': 'green',
    'Cancelado': 'red'
  }
  return statusColors[estado] || 'grey'
}

const columns = [
  {
    name: 'actividad',
    required: true,
    label: 'Actividad',
    align: 'left',
    field: row => row.actividad,
    sortable: true
  },
  {
    name: 'fecha',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: row => row.fecha,
    format: (val) => new Date(val).toLocaleDateString(),
    sortable: true
  },
  {
    name: 'estado',
    required: true,
    label: 'Estado',
    align: 'left',
    field: row => row.estado,
    sortable: true
  },
  {
    name: 'acciones',
    required: true,
    label: 'Acciones',
    align: 'center'
  }
]
</script>

<style scoped>
.activities-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-activity-btn {
  border-radius: 8px;
  padding: 8px 16px;
}

.activities-table {
  border-radius: 0 0 12px 12px;
}

.activities-table :deep(.q-table thead) {
  background-color: #f5f5f5;
}

.activities-table :deep(.q-table th) {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 12px 16px;
}

.activities-table :deep(.q-table td) {
  padding: 12px 16px;
}

.activities-table :deep(.q-table tbody tr:hover) {
  background-color: #f8f9fa;
}

.action-button {
  margin: 0 4px;
  transition: transform 0.2s;
}

.action-button:hover {
  transform: scale(1.1);
}

.activities-table :deep(.q-table__bottom) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .new-activity-btn {
    width: 100%;
  }
}
</style>