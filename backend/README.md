# Подключение базы данных (PHP + MySQL)

## Что нужно установить

Скачай и установи **OpenServer Panel** (рекомендуется для Windows):
👉 https://ospanel.io/download/

Или **XAMPP**:
👉 https://www.apachefriends.org/ru/download.html

---

## Шаг 1 — Запуск сервера

**OpenServer:**
1. Запусти OpenServer (зелёный флажок в трее)
2. Нажми флажок → «Запустить»

**XAMPP:**
1. Открой XAMPP Control Panel
2. Нажми «Start» рядом с Apache и MySQL

---

## Шаг 2 — Создание базы данных в phpMyAdmin

1. Открой браузер: `http://localhost/phpmyadmin`
2. Слева нажми **«Новая»**
3. Имя базы: `medclinic`
4. Кодировка: `utf8mb4_unicode_ci`
5. Нажми **«Создать»**
6. Перейди на вкладку **«SQL»**
7. Скопируй содержимое файла `backend/database.sql`
8. Вставь в поле и нажми **«Вперёд»**

Все таблицы и тестовые данные создадутся автоматически.

---

## Шаг 3 — Разместить PHP файлы

Скопируй папку `backend/` в папку сервера:

**OpenServer:** `C:\OpenServer\domains\localhost\medclinic\backend\`

**XAMPP:** `C:\xampp\htdocs\medclinic\backend\`

Структура должна быть:
```
localhost/
  medclinic/
    backend/
      api/
        doctors.php
        clinics.php
        appointments.php
        auth.php
        actions.php
        services.php
        settings.php
        reviews.php
        stats.php
      config/
        database.php
      middleware/
        cors.php
```

---

## Шаг 4 — Настроить подключение к БД

Открой файл `backend/config/database.php`:

```php
define('DB_HOST',     'localhost');
define('DB_NAME',     'medclinic');
define('DB_USER',     'root');       // логин (обычно root)
define('DB_PASSWORD', '');           // пароль (обычно пустой)
```

Для OpenServer пароль обычно `root`, для XAMPP — пустой.

---

## Шаг 5 — Проверить API

Открой в браузере:
```
http://localhost/medclinic/backend/api/doctors.php
```

Должен вернуть JSON со списком врачей.

---

## Шаг 6 — Подключить Vue к API

В файле `src/services/api.ts` измени строку:
```ts
export const BASE_URL = 'http://localhost/medclinic/backend/api'
```

---

## Данные для входа

**Личный кабинет (пациент):**
- Зарегистрируйся через форму на сайте

**Панель администратора** (`/admin`):
- Логин: `admin`
- Пароль: `1234`

---

## Эндпоинты API

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/doctors.php` | Список врачей (фильтры: specialty, clinic, name, sort, page) |
| GET | `/doctors.php?id=1` | Один врач |
| POST | `/doctors.php` | Создать врача |
| PUT | `/doctors.php?id=1` | Обновить врача |
| DELETE | `/doctors.php?id=1` | Удалить врача |
| GET | `/clinics.php` | Список клиник |
| POST | `/appointments.php` | Создать запись на приём |
| GET | `/appointments.php` | Список записей |
| PUT | `/appointments.php?id=1` | Изменить статус |
| POST | `/auth.php?action=login` | Вход пациента |
| POST | `/auth.php?action=register` | Регистрация |
| POST | `/auth.php?action=admin_login` | Вход администратора |
| GET | `/actions.php` | Акции |
| GET | `/services.php` | Услуги |
| GET | `/settings.php` | Настройки сайта |
| GET | `/stats.php` | Статистика для админа |
