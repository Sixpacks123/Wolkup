<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar>
        <template #left>
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            @click="router.push('/dashboard/reports')"
          />
          <h1 class="text-xl font-semibold">
            Signalement #{{ route.params.id }}
          </h1>
        </template>

        <template #right>
          <UDropdown :items="menuItems">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

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

        <div
          v-else
          class="space-y-6"
        >
          <!-- Status Banner -->
          <UBanner
            v-if="report.status === 'en_attente'"
            icon="i-heroicons-exclamation-triangle"
            color="warning"
          >
            <p>Ce signalement est en attente de traitement</p>
            <template #action>
              <UButton
                color="white"
                label="Marquer comme traité"
                :loading="updating"
                @click="handleStatusChange"
              />
            </template>
          </UBanner>

          <!-- Main Content -->
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Détails -->
            <div class="md:col-span-2 space-y-6">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-heroicons-information-circle" />
                      <h2 class="font-medium">
                        Informations
                      </h2>
                    </div>
                    <UBadge
                      :color="report.status === 'en_attente' ? 'warning' : 'success'"
                      :variant="report.status === 'en_attente' ? 'soft' : 'solid'"
                    >
                      {{ report.status }}
                    </UBadge>
                  </div>
                </template>

                <UDivider label="Description" />
                <p class="py-2">
                  {{ report.description }}
                </p>

                <UDivider label="Détails" />
                <div class="space-y-4 py-2">
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-calendar"
                      class="text-gray-500"
                    />
                    <span>{{ formatDate(report.timestamp) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-map-pin"
                      class="text-gray-500"
                    />
                    <span>{{ report.latitude }}, {{ report.longitude }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-user"
                      class="text-gray-500"
                    />
                    <span>ID Utilisateur: {{ report.user_id }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-tag"
                      class="text-gray-500"
                    />
                    <span>Catégorie: {{ report.category_id }}</span>
                  </div>
                </div>
              </UCard>

              <!-- Timeline des actions -->
              <UCard>
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-clock" />
                    <h2 class="font-medium">
                      Historique
                    </h2>
                  </div>
                </template>
                <UTimeline :items="timelineItems" />
              </UCard>
            </div>

            <!-- Carte -->
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-map" />
                  <h2 class="font-medium">
                    Localisation
                  </h2>
                </div>
              </template>
              <div class="w-full h-[400px]">
                <ClientOnly>
                  <ReportsMap 
                    v-if="report && report.latitude && report.longitude"
                    :reports="[report]"
                    :center="[report.latitude, report.longitude]"
                  />
                </ClientOnly>
              </div>
            </UCard>
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from '#app'
import { useReports } from '@/composables/useReports'

const router = useRouter()
const route = useRoute()
const report = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const updating = ref(false)

definePageMeta({
  layout: 'dash',
})
const menuItems = computed(() => [
  [{
    label: 'Marquer comme traité',
    icon: 'i-heroicons-check-circle',
    click: handleStatusChange,
    disabled: report.value?.status === 'traite' || updating.value
  }],
  [{
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    color: 'red',
    click: handleDelete
  }]
])

const timelineItems = computed(() => {
  if (!report.value) return []
  return [
    {
      tag: 'Création',
      date: formatDate(report.value.timestamp),
      icon: 'i-heroicons-flag'
    },
    report.value.status === 'traite'
      ? {
          tag: 'Traité',
          date: 'Date de traitement',
          icon: 'i-heroicons-check-circle'
        }
      : null
  ].filter(Boolean)
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

const handleStatusChange = async () => {
  updating.value = true
  try {
    // Implement status update logic here
    report.value.status = 'traite'
  } catch (err) {
    console.error(err)
  } finally {
    updating.value = false
  }
}

const handleDelete = async () => {
  // Implement delete logic here
  router.push('/dashboard/reports')
}

onMounted(async () => {
  try {
    const reports = await useReports()
    report.value = reports.find(r => r.id === route.params.id)
    if (!report.value) throw new Error('Signalement non trouvé')
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du chargement du signalement.'
  } finally {
    loading.value = false
  }
})
</script>
