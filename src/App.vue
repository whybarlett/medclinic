<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import FloatingWidgets from './components/layout/FloatingWidgets.vue'
import AppointmentModal from './components/appointment/AppointmentModal.vue'
import { useRegionStore } from './stores/useRegionStore'

const regionStore = useRegionStore()
onMounted(() => { regionStore.detectRegion() })
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen bg-background">
    <AppHeader />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" class="flex-1" />
      </Transition>
    </RouterView>
    <AppFooter />
    <FloatingWidgets />
    <AppointmentModal />
  </div>
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; }
</style>
