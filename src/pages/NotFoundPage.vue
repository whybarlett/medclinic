<script setup lang="ts">
</script>
<template>
  <main class="py-24">
    <div class="container-custom text-center max-w-lg mx-auto">
      <div class="text-8xl font-black text-primary/10 mb-4">404</div>
      <h1 class="text-3xl font-bold text-textPrimary mb-3">Страница не найдена</h1>
      <p class="text-textSecondary mb-8">Возможно, страница была удалена или вы перешли по неверной ссылке.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <RouterLink to="/" class="btn-primary">На главную</RouterLink>
        <RouterLink to="/doctors" class="btn-outline">Найти врача</RouterLink>
      </div>
      <div class="mt-10 flex flex-wrap gap-3 justify-center">
        <RouterLink to="/services" class="text-primary text-sm hover:underline">Услуги</RouterLink>
        <RouterLink to="/clinics" class="text-primary text-sm hover:underline">Клиники</RouterLink>
        <RouterLink to="/actions" class="text-primary text-sm hover:underline">Акции</RouterLink>
        <RouterLink to="/contacts" class="text-primary text-sm hover:underline">Контакты</RouterLink>
      </div>
    </div>
  </main>
</template>
