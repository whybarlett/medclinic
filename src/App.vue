<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import FloatingWidgets from './components/layout/FloatingWidgets.vue'
import AppointmentModal from './components/appointment/AppointmentModal.vue'
import LoginModal from './components/auth/LoginModal.vue'
import AppToast from './components/ui/AppToast.vue'
import { useRegionStore } from './stores/useRegionStore'
import { useAdminStore } from './stores/useAdminStore'

const regionStore = useRegionStore()
const adminStore = useAdminStore()
const route = useRoute()
const isAdminPage = computed(() => route.path.startsWith('/admin'))

onMounted(() => { regionStore.detectRegion() })
</script>

<template>
  <div id="app" class="flex flex-col min-h-screen bg-background">
    <template v-if="!isAdminPage">
      <AppHeader />
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" class="flex-1" />
        </Transition>
      </RouterView>
      <AppFooter />
      <FloatingWidgets />
      <AppointmentModal />
      <LoginModal />
    </template>
    <template v-else>
      <RouterView />
    </template>
    <AppToast :show="adminStore.saveSuccess" message="Изменения сохранены!" type="success" />
  </div>
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; }
</style>
