<template>
  <div class="relative">
    <div class="bg-background rounded-xl p-4">
      <img src="/iPhone_15_Pro.svg" alt="Image" class="fixed-size" />
    </div>
  </div>
</template>

<style scoped>
.fixed-size {
  width: 100%; /* Full width of the parent container */
  max-width: 800px; /* Set a maximum width for the image */
  height: auto; /* Maintain the aspect ratio of the image */
  display: block; /* Ensure it's centered if necessary */
  margin: 0 auto; /* Center the image horizontally */
}

.border-gradient:after {
  --angle: 0deg;
  --border-color: rgb(var(--color-gray-300));
  --highlight-color: rgb(var(--color-primary-500));

  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: -1px;
  opacity: 0.5;
  border-radius: 0.8rem;
  z-index: -1;
  background: var(--border-color);

  @supports (background: paint(houdini)) {
    background: linear-gradient(var(--angle), var(--border-color), var(--border-color), var(--border-color), var(--border-color), var(--highlight-color));
    animation: 10s rotate linear infinite;
  }
}

.dark .border-gradient:after {
  --border-color: rgb(var(--color-gray-700));
  --highlight-color: rgb(var(--color-gray-400));
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
</style>
<script setup lang="ts">
</script>
