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
        <LDrawToolbar
          v-model:drawing="drawing"
          v-model:editElement="editElement"
          position="topright"
          :options="{ polygon: true, rectangle: true, polyline: false, circle: false, marker: false, circlemarker: false }"
          @created="handleDrawCreated"
        />
      </LMap>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

const emit = defineEmits<{
  (e: 'zone-drawn', value: any): void
}>()

const center = ref([46.227638, 2.213749])
const zoom = ref(6)
const drawing = ref(false)
const editElement = ref(null)

const handleDrawCreated = (e: any) => {
  emit('zone-drawn', e.layer.toGeoJSON())
}
</script>
