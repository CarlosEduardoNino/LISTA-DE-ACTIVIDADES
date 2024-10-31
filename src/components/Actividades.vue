<template>
  <div class="q-pa-md">
    <q-card class="activities-container">
     
      <q-card-section class="bg-primary text-white header-section">
        <div class="text-h5">
          <q-icon name="list" class="q-mr-sm" />
          Actividades
          <q-badge color="white" text-color="primary" class="q-ml-sm">
            {{ actividades.length }}
          </q-badge>
        </div>
        <div class="header-buttons">
          <q-btn
            color="negative"
            text-color="white"
            @click="confirmarEliminarTodas"
            label="Borrar Todo"
            icon="delete_sweep"
            class="delete-all-btn q-mr-sm"
            :disable="!actividades.length"
          >
            <q-tooltip>Eliminar todas las actividades</q-tooltip>
          </q-btn>
          <q-btn
            color="white"
            text-color="primary"
            @click="navigateTo('agregar')"
            label="Nueva Actividad"
            icon="add"
            class="new-activity-btn"
          >
            <q-tooltip>Agregar nueva actividad</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

    
      <q-card-section class="filters-section q-px-lg q-py-md">
        <div class="row q-col-gutter-md items-start">
       
          <div class="col-12 col-md-4">
            <q-input
              v-model="search"
              
              dense
              outlined
              label="Buscar actividad"
              class="filter-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          
          <div class="col-12 col-md-4">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              dense
              outlined
              label="Filtrar por estado"
              class="filter-input"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" color="primary" />
              </template>
            </q-select>
          </div>

         
          <div class="col-12 col-md-4">
            <q-input
              v-model="dateFilter"
              dense
              outlined
              label="Filtrar por fecha"
              class="filter-input"
              clearable
            >
              <template v-slot:prepend>
                <q-icon 
                  name="event" 
                  class="cursor-pointer"
                  color="primary"
                >
                  <q-popup-proxy 
                    cover 
                    transition-show="scale" 
                    transition-hide="scale"
                    class="calendar-popup"
                  >
                    <q-date 
                      v-model="dateFilter" 
                      mask="YYYY-MM-DD"
                      class="filter-calendar"
                    >
                      <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                        <q-btn label="Cancelar" color="grey" flat v-close-popup />
                        <q-btn label="OK" color="primary" flat v-close-popup />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      
      <q-card-section class="table-section">
        <q-table
          :rows="filteredActividades"
          :columns="columns"
          row-key="id"
          class="activities-table"
          :rows-per-page-options="[10, 20, 50]"
          :pagination.sync="pagination"
          flat
          bordered
          :loading="loading"
          :filter="search"
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
                class="status-chip"
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
      <q-card class="confirm-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Está seguro de eliminar esta actividad?</span>
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminarActividad" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

   
    <q-dialog v-model="confirmDeleteAllDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Está seguro de eliminar todas las actividades? Esta acción no se puede deshacer.</span>
        </q-card-section>

        <q-card-actions align="right" class="bg-white">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar Todo" color="negative" @click="eliminarTodasActividades" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

   
    <q-dialog v-model="detallesDialog">
      <q-card class="details-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalles de la Actividad</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="actividadSeleccionada">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Actividad</q-item-label>
                <q-item-label>{{ actividadSeleccionada.actividad }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Descripción</q-item-label>
                <q-item-label>{{ actividadSeleccionada.descripcion || 'Sin descripción' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Estado</q-item-label>
                <q-item-label>
                  <q-chip
                    :color="getStatusColor(actividadSeleccionada.estado)"
                    text-color="white"
                    size="sm"
                  >
                    {{ actividadSeleccionada.estado }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Fecha</q-item-label>
                <q-item-label>{{ formatDate(actividadSeleccionada.fecha) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useActividadesStore } from '../stores/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { date } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const store = useActividadesStore()
const { actividades } = storeToRefs(store)
const loading = ref(false)
const search = ref('')
const filterStatus = ref(null)
const dateFilter = ref(null)
const confirmDialog = ref(false)
const confirmDeleteAllDialog = ref(false)
const detallesDialog = ref(false)
const actividadToDelete = ref(null)
const actividadSeleccionada = ref(null)
const pagination = ref({
  sortBy: 'fecha',
  descending: true,
  page: 1,
  rowsPerPage: 10
})

const statusOptions = [
  { label: 'Completado', value: 'Completado' },
  { label: 'Pendiente', value: 'Pendiente' }
]

const filteredActividades = computed(() => {
  let filtered = [...actividades.value]
  
  if (filterStatus.value) {
    filtered = filtered.filter(act => act.estado === filterStatus.value)
  }
  
  if (dateFilter.value) {
    filtered = filtered.filter(act => 
      date.formatDate(act.fecha, 'YYYY-MM-DD') === dateFilter.value
    )
  }

  return filtered
})

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
    format: val => formatDate(val),
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
    align: 'center',
    sortable: false
  }
]

const formatDate = (dateString) => {
  return date.formatDate(dateString, 'DD/MM/YYYY')
}

const verDetalles = (actividad) => {
  actividadSeleccionada.value = actividad
  detallesDialog.value = true
}

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

const confirmarEliminarTodas = () => {
  confirmDeleteAllDialog.value = true
}

const eliminarTodasActividades = () => {
  try {
    store.eliminarTodasActividades()
    $q.notify({
      type: 'positive',
      message: 'Todas las actividades han sido eliminadas',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar las actividades',
      position: 'top'
    })
  }
}

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

const getStatusColor = (estado) => {
  const statusColors = {
    'Completado': 'green',
    'Pendiente': 'red'
  }
  return statusColors[estado] || 'grey'
}
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
  padding: 16px 24px;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-activity-btn,
.delete-all-btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}

.filters-section {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.filter-input {
  width: 100%;
}

.filter-input :deep(.q-field__control) {
  height: 44px;
  background: white;
}

.filter-input :deep(.q-field__label) {
  top: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

.filter-input :deep(.q-field__native) {
  padding-top: 14px;
  font-size: 0.875rem;
}

.filter-input :deep(.q-field__marginal) {
  height: 44px;
}

.calendar-popup {
  max-width: 300px;
}

.filter-calendar {
  width: 300px;
}


@media (max-width: 600px) {
  .filters-section {
    padding: 12px !important;
  }

  .filter-input {
    margin-bottom: 8px;
  }

  .filter-input :deep(.q-field__control) {
    height: 40px;
  }

  .filter-input :deep(.q-field__marginal) {
    height: 40px;
  }
}
</style>