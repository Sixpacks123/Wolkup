<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Signalements">
        <template #right>
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Rechercher..."
            class="w-64"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
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

        <div v-else>
          <UTable
            :rows="filteredReports"
            :columns="columns"
            :sort="sort"
            hover
            @update:sort="sort = $event"
            @select="navigateToReport"
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
          </UTable>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReports } from '@/composables/useReports'
import { useRouter } from '#app'

definePageMeta({
  layout: 'dash',
})
const router = useRouter()
const reports = ref([])
const loading = ref(true)
const error = ref<string | null>(null)
const search = ref('')
const currentStatus = ref('all')
const sort = ref({ column: 'timestamp', direction: 'desc' })

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Traités', value: 'traite' }
]

const columns = [
  { key: 'description', label: 'Description', sortable: true },
  { key: 'status', label: 'Statut', sortable: true },
  { key: 'timestamp', label: 'Date', sortable: true }
]

const filteredReports = computed(() => {
  let filtered = reports.value

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.description.toLowerCase().includes(searchLower)
    )
  }

  if (currentStatus.value !== 'all') {
    filtered = filtered.filter(report => report.status === currentStatus.value)
  }

  return filtered
})

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const navigateToReport = (report: any) => {
  router.push(`/dashboard/reports/${report.id}`)
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
