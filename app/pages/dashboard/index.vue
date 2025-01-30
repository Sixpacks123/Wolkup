<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Tableau de bord des signalements">
        <template #right>
          <UDropdown 
            :items="[
              [{
                label: 'Nouveau signalement',
                icon: 'i-heroicons-flag',
                to: '/reports/new'
              }]
            ]"
          >
            <UButton
              icon="i-heroicons-plus"
              size="md"
              class="ml-1.5 rounded-full"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar v-if="!loading && !error">
        <template #left>
          <USelect
            v-model="currentStatus"
            :options="statusOptions"
            placeholder="Filtrer par statut"
            class="w-48"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <div v-if="loading">
          <ULoadingBlock class="h-96" />
        </div>
        
        <div v-else-if="error">
          <UAlert
            type="danger"
            :title="error"
            icon="i-heroicons-exclamation-triangle"
          />
        </div>
        
        <div v-else class="space-y-6">
          <!-- Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-flag" class="text-primary" />
                <div>
                  <p class="text-sm text-gray-500">Total des signalements</p>
                  <p class="text-2xl font-semibold">{{ filteredReports.length }}</p>
                </div>
              </div>
            </UCard>
            
            <UCard>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="text-warning-500" />
                <div>
                  <p class="text-sm text-gray-500">En attente</p>
                  <p class="text-2xl font-semibold">{{ getReportsByStatus('en_attente').length }}</p>
                </div>
              </div>
            </UCard>
            
            <UCard>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-success-500" />
                <div>
                  <p class="text-sm text-gray-500">Traités</p>
                  <p class="text-2xl font-semibold">{{ getReportsByStatus('traite').length }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Map and Table section -->
          <div class="grid lg:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-map" />
                  <h2>Carte des signalements</h2>
                </div>
              </template>
              <div class="h-[600px]">
                <ReportsMap :reports="filteredReports" />
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-list-bullet" />
                  <h2>Liste des signalements</h2>
                </div>
              </template>
              <UTable
                :rows="filteredReports"
                :columns="tableColumns"
              >
                <template #status-data="{ row }">
                  <UBadge
                    :color="row.status === 'en_attente' ? 'warning' : 'success'"
                    :variant="row.status === 'en_attente' ? 'soft' : 'solid'"
                  >
                    {{ row.status }}
                  </UBadge>
                </template>
                <template #timestamp-data="{ row }">
                  {{ formatDate(row.timestamp) }}
                </template>
                <template #position-data="{ row }">
                  ({{ row.latitude }}, {{ row.longitude }})
                </template>
              </UTable>
            </UCard>
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useReports } from '@/composables/useReports'

definePageMeta({
  layout: 'dash',
})

const reports = ref([])
const loading = ref(true)
const error = ref<string | null>(null)

const currentStatus = ref('all')
const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Traités', value: 'traite' }
]

const tableColumns = [
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Statut' },
  { key: 'timestamp', label: 'Date' },
  { key: 'position', label: 'Position' }
]

const filteredReports = computed(() => {
  if (currentStatus.value === 'all') return reports.value
  return reports.value.filter(report => report.status === currentStatus.value)
})

const getReportsByStatus = (status: string) => {
  return reports.value.filter(report => report.status === status)
}

const getStatusClass = (status: string) => {
  return {
    'en_attente': 'text-yellow-600',
    'traite': 'text-green-600',
  }[status] || 'text-gray-600'
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    reports.value = await useReports()
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du chargement des signalements.'
  } finally {
    loading.value = false
  }
})
</script>
