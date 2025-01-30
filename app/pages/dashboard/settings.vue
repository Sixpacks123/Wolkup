<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Paramètres">
        <template #right>
          <UButton
            icon="i-heroicons-plus"
            label="Nouvelle zone"
            size="md"
            @click="isCreateZoneModalOpen = true"
          />
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
        
        <div v-else class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-map" />
                <h2>Zones de la commune</h2>
              </div>
            </template>
            <div class="h-[600px]">
              <ZonesMap :zones="zones" />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-list-bullet" />
                <h2>Liste des zones</h2>
              </div>
            </template>
            <UTable
              :rows="zones"
              :columns="[
                { key: 'id', label: 'ID' },
                { key: 'created_at', label: 'Date de création' },
                { key: 'actions', label: 'Actions' }
              ]"
            >
              <template #created_at-data="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
              <template #actions-data="{ row }">
                <UButton
                  color="danger"
                  variant="soft"
                  icon="i-heroicons-trash"
                  size="xs"
                  @click="deleteZone(row.id)"
                />
              </template>
            </UTable>
          </UCard>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>

    <!-- Create Zone Modal -->
    <UModal v-model="isCreateZoneModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            Créer une nouvelle zone
          </h3>
        </template>

        <div class="h-[400px]">
          <ZoneDrawMap @zone-drawn="handleZoneDrawn" />
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="isCreateZoneModalOpen = false"
            >
              Annuler
            </UButton>
            <UButton
              color="primary"
              :loading="creating"
              :disabled="!drawnZone"
              @click="createNewZone"
            >
              Créer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseUser } from '#imports'
import { useMunicipalityZones } from '~/composables/useMunicipalityZones'
import type { MunicipalityZone } from '~/types/municipality-zone'

definePageMeta({
  layout: 'dash',
})

const user = useSupabaseUser()
const { getMunicipalityZones, createMunicipalityZone } = useMunicipalityZones()

const zones = ref<MunicipalityZone[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isCreateZoneModalOpen = ref(false)
const creating = ref(false)
const drawnZone = ref(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleZoneDrawn = (zone: any) => {
  drawnZone.value = zone
}

const loadZones = async () => {
  try {
    const municipalityZones = await getMunicipalityZones(user.value?.municipality_id)
    zones.value = municipalityZones
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du chargement des zones.'
  } finally {
    loading.value = false
  }
}

const createNewZone = async () => {
  if (!drawnZone.value) return

  creating.value = true
  try {
    await createMunicipalityZone({
      municipality_id: user.value?.municipality_id,
      geojson: drawnZone.value,
      geom: drawnZone.value
    })
    
    await loadZones()
    isCreateZoneModalOpen.value = false
    drawnZone.value = null
  } catch (err) {
    console.error(err)
  } finally {
    creating.value = false
  }
}

const deleteZone = async (zoneId: string) => {
  // Implementation for delete zone
}

onMounted(() => {
  loadZones()
})
</script>
