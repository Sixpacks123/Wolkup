<template>
  <div class="w-full h-full rounded-lg overflow-hidden border border-gray-200">
    <LMap
      ref="map"
      :zoom="13"
      :center="[48.117266, -1.6777926]"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      
      <!-- Contrôles -->
      <LControlZoom position="topright" />
      <LControlScale position="bottomright" />
      
      <!-- Groupe de markers -->
      <LFeatureGroup>
        <LMarker
          v-for="report in props.reports"
          :key="report.id"
          :lat-lng="[report.latitude, report.longitude]"
        >
          <LTooltip>
            {{ report.description }}
          </LTooltip>
          <LPopup>
            <div class="p-2 space-y-2">
              <p class="font-medium">{{ report.description }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(report.timestamp) }}</p>
              <UBadge
                :color="report.status === 'en_attente' ? 'warning' : 'success'"
                :variant="report.status === 'en_attente' ? 'soft' : 'solid'"
              >
                {{ report.status }}
              </UBadge>
            </div>
          </LPopup>
        </LMarker>
      </LFeatureGroup>

      <!-- Contrôle des couches -->
      <LControlLayers position="topright" />
    </LMap>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'
interface Report {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
}

const props = defineProps<{
  reports: Array<Report>
}>()

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
