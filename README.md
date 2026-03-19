# МедЦентр — Веб-сайт сети медицинских клиник

Полнофункциональная веб-система для сети медицинских клиник: онлайн-запись к врачу, личный кабинет пациента и административная панель управления.

## 🛠 Технологический стек

### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| Vue 3 | 3.x | Основной фреймворк (Composition API + `<script setup>`) |
| TypeScript | 5.x | Строгая типизация |
| Vite | 8.x | Сборщик |
| Pinia | 2.x | Управление состоянием |
| Vue Router 4 | 4.x | Маршрутизация (History API) |
| Tailwind CSS | 3.x | Утилитарный CSS с кастомной темой |
| Swiper.js | 11.x | Слайдеры и карусели |
| Leaflet | 1.9.x | Интерактивные карты (OpenStreetMap) |
| VueUse | 10.x | Composables (useScroll, useIntersectionObserver) |
| Axios | 1.x | HTTP-клиент |
| date-fns | 3.x | Работа с датами |
| VeeValidate + Zod | 4.x | Валидация форм |

### Backend
| Технология | Назначение |
|------------|------------|
| PHP 8 + PDO | Серверная логика и REST API |
| MySQL 8.0 | База данных (12 таблиц) |
| OpenServer Panel | Локальная разработка |
| bcrypt | Хэширование паролей |

---

## 🚀 Быстрый старт

### Frontend

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера (http://localhost:5173)
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

### Backend

1. Установить [OpenServer Panel](https://ospanel.io/) или XAMPP
2. Скопировать папку `backend/` в корень домена
3. В phpMyAdmin создать БД `medclinic` (кодировка `utf8mb4_unicode_ci`)
4. Импортировать `backend/database.sql`
5. Настроить `backend/config/database.php`:

```php
define('DB_HOST',     'localhost');
define('DB_NAME',     'medclinic');
define('DB_USER',     'root');
define('DB_PASSWORD', ''); // пусто для XAMPP, 'root' для OpenServer
```

> **Без backend** — сайт работает на моковых данных из `src/mocks/`. Все функции доступны в демо-режиме.

---

## 📁 Структура проекта

```
medclinic/
├── backend/                    # PHP-бэкенд
│   ├── api/                    # REST API-эндпоинты
│   │   ├── auth.php            # Авторизация и регистрация
│   │   ├── doctors.php         # CRUD врачей
│   │   ├── clinics.php         # CRUD клиник
│   │   ├── appointments.php    # Записи на приём
│   │   ├── actions.php         # Акции и скидки
│   │   ├── services.php        # Услуги и категории
│   │   ├── settings.php        # Настройки сайта
│   │   ├── reviews.php         # Отзывы
│   │   └── stats.php           # Статистика для дашборда
│   ├── config/
│   │   └── database.php        # Подключение к БД
│   └── database.sql            # Схема и начальные данные
│
└── src/                        # Vue 3 frontend
    ├── assets/styles/          # Tailwind + CSS-переменные бренда
    ├── components/
    │   ├── appointment/        # Форма записи на приём (3 шага)
    │   ├── auth/               # Модал авторизации и регистрации
    │   ├── doctors/            # Карточка врача, фильтры, расписание
    │   ├── home/               # Секции главной страницы
    │   ├── layout/             # AppHeader, AppFooter, MobileMenu
    │   └── ui/                 # UI-примитивы (AppButton, AppModal и др.)
    ├── composables/            # useAnimations, useScrollReveal
    ├── mocks/                  # Моковые данные (демо-режим)
    ├── pages/                  # Страницы (lazy-loaded)
    ├── router/                 # Конфигурация маршрутов
    ├── services/               # api.ts — Axios HTTP-клиент
    ├── stores/                 # Pinia-хранилища
    ├── types/                  # TypeScript-интерфейсы
    └── utils/                  # Утилиты (maskPhone, formatDate)
```

---

## 📄 Страницы

| Маршрут | Страница |
|---------|----------|
| `/` | Главная (слайдер, поиск, врачи, карта клиник, отзывы) |
| `/doctors` | Каталог врачей с фильтрами и поиском |
| `/doctors/:id` | Профиль врача (о враче, расписание, отзывы, цены) |
| `/services` | Каталог услуг по категориям |
| `/services/:slug` | Детальная страница услуги |
| `/clinics` | Список клиник |
| `/clinics/:id` | Детальная страница клиники |
| `/actions` | Акции и скидки |
| `/actions/:id` | Детальная страница акции |
| `/articles` | Статьи о здоровье |
| `/articles/:slug` | Детальная страница статьи |
| `/cabinet` | Личный кабинет пациента |
| `/about` | О компании |
| `/contacts` | Контакты |
| `/admin` | Административная панель |

---

## 🔐 Доступы (демо-режим)

| Роль | Логин | Пароль |
|------|-------|--------|
| Пациент | Любой телефон | Любые 6+ символов |
| Администратор | `admin` | `1234` |

---

## 🗄 База данных

12 таблиц:

| Таблица | Назначение |
|---------|------------|
| `regions` | Регионы присутствия |
| `clinics` | Клиники (адрес, координаты, расписание) |
| `doctors` | Врачи (специальность, опыт, рейтинг, цена) |
| `service_categories` | Категории услуг |
| `services` | Медицинские услуги с ценами |
| `users` | Пациенты (пароль — bcrypt-хэш) |
| `admins` | Администраторы системы |
| `appointments` | Записи на приём |
| `actions` | Акции и скидки |
| `articles` | Статьи о здоровье |
| `reviews` | Отзывы пациентов |
| `settings` | Настройки сайта (key-value) |

---

## 🔌 REST API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET/POST/PUT/DELETE | `/api/doctors.php` | Врачи (фильтрация, пагинация) |
| GET/POST/PUT/DELETE | `/api/clinics.php` | Клиники |
| GET/POST/PUT | `/api/appointments.php` | Записи (с защитой от двойного бронирования) |
| POST | `/api/auth.php?action=login` | Вход пациента |
| POST | `/api/auth.php?action=register` | Регистрация пациента |
| POST | `/api/auth.php?action=admin_login` | Вход администратора |
| GET/POST/PUT/DELETE | `/api/actions.php` | Акции |
| GET | `/api/services.php` | Услуги и категории |
| GET/PUT | `/api/settings.php` | Настройки сайта |
| GET | `/api/stats.php` | Статистика для дашборда |
| GET/POST | `/api/reviews.php` | Отзывы |

---

## 🎨 Дизайн-система

- **Шрифт:** Golos Text (Google Fonts)
- **Основной цвет:** `#003D9C` (primary)
- **Вторичный цвет:** `#00AEEF` (secondary)
- **Border-radius:** btn=8px, card=16px, input=8px, modal=20px
- **Компоненты** с префиксом `App` (AppButton, AppModal, AppRating и др.)

---

## ✅ Тестирование

Проведено 39 тестов:
- **19** функциональных (браузер)
- **10** backend (Postman)
- **10** UX/UI (адаптивность от 375px)

Все тесты пройдены успешно.
