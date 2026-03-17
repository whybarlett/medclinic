# MedClinic

Веб-сайт сети медицинских клиник «МедЦентр» — одностраничное приложение (SPA) на Vue 3 с русскоязычным интерфейсом.

## Технологии

- **Vue 3** + TypeScript + Vite 8
- **Pinia** — управление состоянием
- **Vue Router 4** — маршрутизация (HTML5 History)
- **TailwindCSS 3** — стилизация с кастомной темой
- **VeeValidate + Zod** — валидация форм
- **Leaflet** — интерактивные карты
- **Swiper** — карусели и слайдеры
- **date-fns** — форматирование дат
- **VueUse** — набор composables

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена (type-check + build)
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

## Структура проекта

```
src/
├── components/
│   ├── appointment/    # Модалка записи на приём
│   ├── doctors/        # Карточка врача, фильтры, расписание
│   ├── home/           # Секции главной страницы
│   ├── layout/         # Шапка, подвал, мобильное меню, виджеты
│   └── ui/             # UI-примитивы (AppButton, AppModal, AppBadge и др.)
├── composables/        # Переиспользуемые composables
├── mocks/              # Моковые данные (заглушки вместо API)
├── pages/              # Страницы (lazy-loaded)
├── router/             # Конфигурация маршрутов
├── stores/             # Pinia-хранилища
├── types/              # TypeScript-интерфейсы
└── utils/              # Утилиты
```

## Страницы

| Маршрут | Страница |
|---------|----------|
| `/` | Главная |
| `/services` | Услуги |
| `/services/:slug` | Детальная страница услуги |
| `/doctors` | Врачи |
| `/doctors/:id` | Профиль врача |
| `/clinics` | Клиники |
| `/clinics/:id` | Детальная страница клиники |
| `/actions` | Акции и скидки |
| `/actions/:id` | Детальная страница акции |
| `/articles` | Статьи о здоровье |
| `/articles/:slug` | Детальная страница статьи |
| `/about` | О компании |
| `/contacts` | Контакты |

## Данные

Бэкенд пока отсутствует. Все данные загружаются из моковых файлов в `src/mocks/`. Хранилища (stores) имитируют асинхронную загрузку через `setTimeout`. При подключении реального API достаточно заменить импорты моков в stores на HTTP-запросы.

## Дизайн-система

- **Шрифт:** Golos Text (fallback: Inter, system-ui)
- **Основные цвета:** `primary` (#003D9C), `secondary` (#00AEEF), `success`, `warning`, `error`
- **UI-компоненты** имеют префикс `App` (AppButton, AppModal и т.д.)
- Кастомные токены border-radius: `btn`, `card`, `input`, `modal`
- Кастомные тени: `card`, `header`, `card-hover`
