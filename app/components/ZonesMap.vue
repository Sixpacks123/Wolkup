<template>
  <div class="h-full w-full">
    <ClientOnly>
      <LMap
        v-model="zoom"
        v-model:center="center"
        :use-global-leaflet="false"
        class="h-full w-full"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        />
        <template v-for="zone in zones" :key="zone.id">
          <LGeoJson
            :geojson="zone.geojson"
            :options="{ style: zoneStyle }"
          />
        </template>
      </LMap>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { MunicipalityZone } from '~/types/municipality-zone'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  zones: MunicipalityZone[]
}>()

const center = ref([46.227638, 2.213749])
const zoom = ref(6)

const zoneStyle = {
  color: '#2563eb',
  weight: 2,
  opacity: 0.6,
  fillOpacity: 0.1
}
</script>
