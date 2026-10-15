<template>
  <div class="skeleton" :style="{ height, width, borderRadius }"></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  height?: string
  width?: string
  borderRadius?: string
}>(), {
  height: '1rem',
  width: '100%',
  borderRadius: '0.75rem'
})
</script>
