<script setup lang="ts">
import { useRegionStore } from '../../stores/useRegionStore'
const regionStore = useRegionStore()
</script>

<template>
  <footer class="bg-[#0a1628] text-white mt-20">
    <!-- Main footer -->
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z"/></svg>
            </div>
            <span class="font-bold text-xl">МедЦентр</span>
          </div>
          <p class="text-white/60 text-sm leading-relaxed mb-4">
            Сеть современных медицинских клиник в Томске. 5 клиник, 20+ врачей, тысячи пациентов.
          </p>
          <a :href="`tel:${regionStore.currentRegion.phone}`" class="text-secondary font-semibold text-lg hover:text-secondary-light transition-colors">
            {{ regionStore.currentRegion.phone }}
          </a>
          <p class="text-white/50 text-xs mt-1">Горячая линия, 24/7</p>
        </div>

        <!-- Services -->
        <div>
          <h4 class="font-semibold mb-4">Услуги</h4>
          <ul class="space-y-2">
            <li v-for="item in ['Диагностика', 'УЗИ', 'МРТ / КТ', 'Анализы', 'Педиатрия', 'Стоматология', 'Кардиология']" :key="item">
              <RouterLink :to="`/services`" class="text-white/60 text-sm hover:text-white transition-colors">{{ item }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Clinic info -->
        <div>
          <h4 class="font-semibold mb-4">О клинике</h4>
          <ul class="space-y-2">
            <li v-for="item in [['О компании', '/about'], ['Врачи', '/doctors'], ['Клиники', '/clinics'], ['Акции', '/actions'], ['Статьи', '/articles'], ['Контакты', '/contacts'], ['Вакансии', '/about']]" :key="item[0]">
              <RouterLink :to="item[1]" class="text-white/60 text-sm hover:text-white transition-colors">{{ item[0] }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contacts -->
        <div>
          <h4 class="font-semibold mb-4">Контакты</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex gap-2 text-white/60">
              <svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              {{ regionStore.currentRegion.name }}, Головной офис
            </li>
            <li class="flex gap-2 text-white/60">
              <svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              info@medclinic.ru
            </li>
            <li class="flex gap-2 text-white/60">
              <svg class="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Пн–Пт: 8:00–22:00<br>Сб–Вс: 9:00–20:00
            </li>
          </ul>
          <!-- Social -->
          <div class="flex items-center gap-3 mt-5">
            <a href="#" class="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors" aria-label="ВКонтакте">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.6-.19 1.37 1.26 2.185 1.815.617.42 1.086.328 1.086.328l2.182-.03s1.14-.071.599-1.144c-.044-.083-.314-.661-1.618-1.869-1.365-1.261-1.183-1.057.462-3.237.999-1.33 1.399-2.142 1.274-2.489-.12-.331-.852-.244-.852-.244l-2.455.015s-.182-.025-.317.056c-.132.078-.217.261-.217.261s-.388 1.034-.906 1.913c-1.092 1.854-1.528 1.952-1.706 1.837-.414-.267-.311-1.073-.311-1.645 0-1.789.271-2.534-.528-2.726-.266-.064-.461-.107-1.141-.114-.872-.009-1.609.003-2.025.207-.278.136-.492.439-.361.456.161.021.526.099.72.362.25.341.242 1.107.242 1.107s.144 2.105-.336 2.365c-.329.176-.781-.183-1.752-1.822-.498-.861-.874-1.814-.874-1.814s-.072-.177-.202-.272c-.157-.115-.376-.151-.376-.151l-2.33.015s-.35.01-.479.163c-.113.136-.009.417-.009.417s1.826 4.271 3.891 6.423c1.895 1.974 4.047 1.843 4.047 1.843h.975z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors" aria-label="Telegram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
        <p>© {{ new Date().getFullYear() }} МедЦентр. Все права защищены.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white/70 transition-colors">Политика конфиденциальности</a>
          <a href="#" class="hover:text-white/70 transition-colors">Пользовательское соглашение</a>
          <a href="#" class="hover:text-white/70 transition-colors">Лицензии</a>
        </div>
      </div>
    </div>
  </footer>
</template>
