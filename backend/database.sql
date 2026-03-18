-- ============================================================
-- МедЦентр — База данных
-- Версия: 1.0
-- Создать в phpMyAdmin: Новая БД → имя "medclinic" → кодировка utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `medclinic`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `medclinic`;

-- ──────────────────────────────────────────────
-- Регионы
-- ──────────────────────────────────────────────
CREATE TABLE `regions` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100) NOT NULL,
  `phone`      VARCHAR(30)  NOT NULL,
  `domain`     VARCHAR(50)  NOT NULL,
  `is_default` TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `regions` (`name`, `phone`, `domain`, `is_default`) VALUES
('Томск',              '+7 (3822) 00-00-00', 'tomsk',  1),
('Москва',             '+7 (495) 000-00-00',  'moscow', 0),
('Санкт-Петербург',    '+7 (812) 000-00-00',  'spb',    0),
('Новосибирск',        '+7 (383) 000-00-00',  'nsk',    0),
('Екатеринбург',       '+7 (343) 000-00-00',  'ekb',    0),
('Казань',             '+7 (843) 000-00-00',  'kazan',  0);

-- ──────────────────────────────────────────────
-- Клиники
-- ──────────────────────────────────────────────
CREATE TABLE `clinics` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `region_id`     INT UNSIGNED NOT NULL DEFAULT 1,
  `name`          VARCHAR(200) NOT NULL,
  `address`       VARCHAR(300) NOT NULL,
  `city`          VARCHAR(100) NOT NULL,
  `phone`         VARCHAR(30)  NOT NULL,
  `email`         VARCHAR(150) NOT NULL DEFAULT '',
  `metro`         VARCHAR(100) NOT NULL DEFAULT '',
  `lat`           DECIMAL(10,7) NOT NULL DEFAULT 56.4884,
  `lng`           DECIMAL(10,7) NOT NULL DEFAULT 84.9525,
  `photo`         TEXT,
  `rating`        DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `working_hours` JSON,
  `is_active`     TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `clinics` (`region_id`,`name`,`address`,`city`,`phone`,`email`,`metro`,`lat`,`lng`,`rating`,`reviews_count`,`working_hours`) VALUES
(1,'МедЦентр на Ленина',   'ул. Ленина, 36, Томск',     'Томск','+7 (3822) 11-22-33','lenina@medclinic.ru',  'Центр',         56.4884,84.9525, 4.8,456,'{"Пн–Пт":"8:00–22:00","Сб–Вс":"9:00–20:00"}'),
(1,'МедЦентр на Кирова',   'ул. Кирова, 24, Томск',     'Томск','+7 (3822) 22-33-44','kirova@medclinic.ru',  'Кировский р-н', 56.4927,84.9643, 4.7,312,'{"Пн–Пт":"8:00–21:00","Сб":"9:00–18:00","Вс":"выходной"}'),
(1,'МедЦентр на Фрунзе',   'пр. Фрунзе, 10, Томск',     'Томск','+7 (3822) 33-44-55','frunze@medclinic.ru',  'Советский р-н', 56.4745,84.9502, 4.9,523,'{"Пн–Пт":"7:00–22:00","Сб–Вс":"8:00–21:00"}'),
(1,'МедЦентр Южный',       'ул. Елизаровых, 60, Томск', 'Томск','+7 (3822) 44-55-66','yuzhniy@medclinic.ru', 'Южный р-н',     56.4612,84.9781, 4.6,198,'{"Пн–Пт":"8:00–21:00","Сб":"9:00–18:00","Вс":"выходной"}'),
(1,'МедЦентр на Мира',     'пр. Мира, 45, Томск',       'Томск','+7 (3822) 55-66-77','mira@medclinic.ru',    'Октябрьский р-н',56.4830,84.9620,4.8,367,'{"Пн–Пт":"8:00–22:00","Сб–Вс":"9:00–20:00"}');

-- ──────────────────────────────────────────────
-- Категории услуг
-- ──────────────────────────────────────────────
CREATE TABLE `service_categories` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`           VARCHAR(100) NOT NULL,
  `slug`           VARCHAR(100) NOT NULL UNIQUE,
  `icon`           VARCHAR(10)  NOT NULL DEFAULT '⚕️',
  `color`          VARCHAR(10)  NOT NULL DEFAULT '#003D9C',
  `services_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `sort_order`     INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

INSERT INTO `service_categories` (`name`,`slug`,`icon`,`color`,`services_count`,`sort_order`) VALUES
('Диагностика',  'diagnostics',    '🔬','#00AEEF',24,1),
('УЗИ',          'ultrasound',     '📡','#27AE60',18,2),
('МРТ / КТ',     'mrt-ct',         '🧲','#9B51E0',15,3),
('Анализы',      'analyses',       '🧪','#F2994A',120,4),
('Педиатрия',    'pediatrics',     '👶','#EB5757',32,5),
('Стоматология', 'stomatology',    '🦷','#6FCF97',28,6),
('Кардиология',  'cardiology',     '❤️','#EB5757',21,7),
('Хирургия',     'surgery',        '⚕️','#003D9C',35,8),
('Онкология',    'oncology',       '🎗️','#6B7280',19,9),
('Реабилитация', 'rehabilitation', '💪','#F2C94C',22,10);

-- ──────────────────────────────────────────────
-- Услуги
-- ──────────────────────────────────────────────
CREATE TABLE `services` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `name`        VARCHAR(255) NOT NULL,
  `slug`        VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `price`       DECIMAL(10,2) NOT NULL DEFAULT 0,
  `duration`    INT UNSIGNED  NOT NULL DEFAULT 30 COMMENT 'минут',
  `is_popular`  TINYINT(1)    NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `services` (`category_id`,`name`,`slug`,`price`,`duration`,`is_popular`) VALUES
(1,'ЭКГ (электрокардиография)',            'ekg',               900,  20, 1),
(1,'Суточное холтеровское мониторирование','holter',            3500,  0,  0),
(2,'УЗИ органов брюшной полости',          'uzi-abdomen',       2200, 40, 1),
(2,'УЗИ щитовидной железы',               'uzi-thyroid',       1800, 30, 0),
(2,'УЗИ малого таза (женское)',            'uzi-pelvis',        2000, 30, 1),
(3,'МРТ головного мозга',                 'mrt-brain',         3500, 45, 1),
(3,'МРТ позвоночника',                    'mrt-spine',         3800, 50, 1),
(3,'КТ органов грудной клетки',           'ct-chest',          4500, 20, 0),
(4,'Общий анализ крови',                  'blood-general',      500, 0,  1),
(4,'Биохимический анализ крови',          'blood-biochem',     1200, 0,  1),
(4,'Анализ на гормоны щитовидной железы','hormones-thyroid',   1800, 0,  0),
(5,'Первичный приём педиатра',            'pediatr-primary',   2800, 30, 1),
(5,'Профосмотр для детского сада',        'pediatr-kindergarten',3900,60,1),
(7,'Консультация кардиолога',             'cardio-consult',    3200, 30, 1),
(7,'ЭХОКГ (УЗИ сердца)',                 'echocg',            3500, 40, 1);

-- ──────────────────────────────────────────────
-- Врачи
-- ──────────────────────────────────────────────
CREATE TABLE `doctors` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `clinic_id`      INT UNSIGNED NOT NULL,
  `name`           VARCHAR(200) NOT NULL,
  `specialty`      VARCHAR(100) NOT NULL,
  `specialties`    JSON,
  `experience`     INT UNSIGNED NOT NULL DEFAULT 0,
  `rating`         DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `reviews_count`  INT UNSIGNED NOT NULL DEFAULT 0,
  `price`          DECIMAL(10,2) NOT NULL DEFAULT 0,
  `photo`          TEXT,
  `bio`            TEXT,
  `education`      JSON,
  `awards`         JSON,
  `is_available`   TINYINT(1)   NOT NULL DEFAULT 1,
  `next_available` DATE,
  `is_active`      TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `doctors` (`clinic_id`,`name`,`specialty`,`specialties`,`experience`,`rating`,`reviews_count`,`price`,`photo`,`bio`,`education`,`awards`,`is_available`,`next_available`) VALUES
(1,'Иванова Елена Сергеевна',   'Кардиолог',  '["Кардиолог","Терапевт"]',       18,4.9,234,3200,'https://randomuser.me/api/portraits/women/1.jpg', 'Врач-кардиолог высшей категории, кандидат медицинских наук.',  '["РНИМУ им. Пирогова, 2005","Кардиология, ординатура НМХЦ, 2007"]','["Лучший врач 2022","Кандидат медицинских наук"]',1,'2026-03-25'),
(2,'Петров Алексей Михайлович', 'Хирург',     '["Хирург","Онколог"]',           22,4.8,189,4500,'https://randomuser.me/api/portraits/men/2.jpg',   'Хирург высшей категории, доктор медицинских наук.',           '["Первый МГМУ им. Сеченова, 2002","Хирургия, ординатура, 2004"]','["Доктор медицинских наук","Заслуженный врач РФ"]',1,'2026-03-26'),
(1,'Смирнова Анна Викторовна',  'Педиатр',    '["Педиатр","Неонатолог"]',       15,4.9,312,2800,'https://randomuser.me/api/portraits/women/3.jpg', 'Педиатр высшей категории.',                                   '["РНИМУ им. Пирогова, 2009","Педиатрия, ординатура, 2011"]',     '["Лучший педиатр 2023"]',                                    1,'2026-03-25'),
(3,'Козлов Дмитрий Александрович','Невролог','["Невролог"]',                    20,4.7,156,3800,'https://randomuser.me/api/portraits/men/4.jpg',   'Невролог высшей категории.',                                  '["МГМУ им. Сеченова, 2004","Неврология, ординатура, 2006"]',     '["Кандидат медицинских наук"]',                               1,'2026-03-27'),
(2,'Волкова Мария Дмитриевна',  'Гинеколог',  '["Гинеколог","Репродуктолог"]',  14,4.8,278,3500,'https://randomuser.me/api/portraits/women/5.jpg', 'Акушер-гинеколог первой категории.',                          '["Первый МГМУ им. Сеченова, 2010"]',                             '["Член РОАГ"]',                                               1,'2026-03-25'),
(4,'Морозов Игорь Петрович',    'Ортопед',    '["Ортопед","Травматолог"]',       25,4.9,203,4200,'https://randomuser.me/api/portraits/men/6.jpg',   'Травматолог-ортопед высшей категории, доктор наук.',           '["РНИМУ им. Пирогова, 2000"]',                                   '["Доктор медицинских наук","Профессор"]',                     0,'2026-04-01');

-- ──────────────────────────────────────────────
-- Пользователи (пациенты)
-- ──────────────────────────────────────────────
CREATE TABLE `users` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`         VARCHAR(200) NOT NULL,
  `phone`        VARCHAR(20)  NOT NULL UNIQUE,
  `email`        VARCHAR(150) NOT NULL DEFAULT '',
  `birth_date`   DATE,
  `password`     VARCHAR(255) NOT NULL,
  `bonus_points` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ──────────────────────────────────────────────
-- Администраторы
-- ──────────────────────────────────────────────
CREATE TABLE `admins` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username`   VARCHAR(100) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `name`       VARCHAR(200) NOT NULL DEFAULT 'Администратор',
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Пароль: 1234
-- Для генерации хэша выполни в PHP: echo password_hash('1234', PASSWORD_BCRYPT);
-- Или используй следующий pre-generated bcrypt hash для '1234':
INSERT INTO `admins` (`username`,`password`,`name`) VALUES
('admin', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWu', 'Главный администратор');

-- ──────────────────────────────────────────────
-- Записи на приём
-- ──────────────────────────────────────────────
CREATE TABLE `appointments` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`     INT UNSIGNED,
  `doctor_id`   INT UNSIGNED NOT NULL,
  `service_id`  INT UNSIGNED,
  `clinic_id`   INT UNSIGNED NOT NULL,
  `date`        DATE         NOT NULL,
  `time`        TIME         NOT NULL,
  `status`      ENUM('upcoming','completed','cancelled','no_show') NOT NULL DEFAULT 'upcoming',
  `price`       DECIMAL(10,2) NOT NULL DEFAULT 0,
  `patient_name`  VARCHAR(200) NOT NULL,
  `patient_phone` VARCHAR(20)  NOT NULL,
  `patient_email` VARCHAR(150) NOT NULL DEFAULT '',
  `comment`     TEXT,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE SET NULL,
  FOREIGN KEY (`doctor_id`)  REFERENCES `doctors`(`id`)  ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`clinic_id`)  REFERENCES `clinics`(`id`)  ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `appointments` (`doctor_id`,`clinic_id`,`date`,`time`,`status`,`price`,`patient_name`,`patient_phone`,`comment`) VALUES
(1,1,'2026-03-25','10:30','upcoming', 3200,'Иванов Алексей',  '+79221112233',''),
(3,1,'2026-03-25','14:00','upcoming', 2800,'Смирнова Ольга',  '+79133334455','Первичный приём'),
(2,2,'2026-03-24','11:00','completed',4500,'Козлов Дмитрий',  '+79235556677','Консультация'),
(4,3,'2026-03-24','09:00','completed',3800,'Петрова Мария',   '+79047778899',''),
(5,2,'2026-03-23','15:30','cancelled',3500,'Волков Сергей',   '+79088889900','Отменил пациент');

-- ──────────────────────────────────────────────
-- Акции
-- ──────────────────────────────────────────────
CREATE TABLE `actions` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`          VARCHAR(255)  NOT NULL,
  `description`    TEXT,
  `image`          TEXT,
  `original_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount_percent` INT UNSIGNED NOT NULL DEFAULT 0,
  `valid_until`    DATE          NOT NULL,
  `category_name`  VARCHAR(100)  NOT NULL,
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `actions` (`title`,`description`,`image`,`original_price`,`discount_price`,`discount_percent`,`valid_until`,`category_name`) VALUES
('Комплексное обследование «Здоровое сердце»', 'Консультация кардиолога + ЭКГ + ЭХОКГ + анализы крови', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600', 8500,4900,42,'2026-04-30','Кардиология'),
('МРТ головного мозга — специальная цена',     'МРТ головного мозга на томографе 3 Тесла с описанием',  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',  6000,3500,42,'2026-03-31','МРТ / КТ'),
('Чек-ап для женщин «Женское здоровье»',       'Консультация гинеколога, УЗИ малого таза, онкоцитология','https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600',9800,5800,41,'2026-05-31','Гинекология'),
('Педиатрический профосмотр для детского сада','Осмотр 10 специалистов + анализы + справка',             'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', 7200,3900,46,'2026-08-31','Педиатрия'),
('УЗИ органов брюшной полости — акция',         'Комплексное УЗИ: печень, желчный, поджелудочная, почки', 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600',4200,2200,48,'2026-03-25','УЗИ');

-- ──────────────────────────────────────────────
-- Статьи
-- ──────────────────────────────────────────────
CREATE TABLE `articles` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug`         VARCHAR(255) NOT NULL UNIQUE,
  `title`        VARCHAR(255) NOT NULL,
  `excerpt`      TEXT,
  `content`      LONGTEXT,
  `image`        TEXT,
  `author`       VARCHAR(200) NOT NULL DEFAULT '',
  `category`     VARCHAR(100) NOT NULL DEFAULT '',
  `read_time`    INT UNSIGNED NOT NULL DEFAULT 5,
  `is_published` TINYINT(1)   NOT NULL DEFAULT 1,
  `published_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `articles` (`slug`,`title`,`excerpt`,`image`,`author`,`category`,`read_time`) VALUES
('kak-ukrepit-immunitet',          'Как укрепить иммунитет: советы врача',              'Иммунная система защищает организм от вирусов, бактерий...', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600', 'Иванова Е.С.','Здоровый образ жизни',5),
('profilaktika-serdechnososudistykh','Профилактика сердечно-сосудистых заболеваний',    'Сердечно-сосудистые заболевания — основная причина смертности...','https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600','Петров А.М.', 'Кардиология',7),
('vse-o-mrt',                       'Всё о МРТ: что нужно знать перед процедурой',      'МРТ — один из самых информативных методов диагностики...',   'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600', 'Козлов Д.А.', 'Диагностика',6);

-- ──────────────────────────────────────────────
-- Отзывы
-- ──────────────────────────────────────────────
CREATE TABLE `reviews` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(200) NOT NULL,
  `doctor_id`   INT UNSIGNED,
  `clinic_id`   INT UNSIGNED,
  `rating`      TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `text`        TEXT NOT NULL,
  `is_published`TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`clinic_id`) REFERENCES `clinics`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `reviews` (`author_name`,`clinic_id`,`rating`,`text`) VALUES
('Наталья К.',1,5,'Отличная клиника! Записалась онлайн за 5 минут, врач принял вовремя.'),
('Сергей В.', 2,5,'Давно ищу хорошего хирурга. Попал к Петрову А.М. — профессионал.'),
('Анна М.',   3,5,'Сделала МРТ — результат готов в тот же день. Персонал вежливый.'),
('Михаил Р.', 2,4,'Хорошее место, удобное расположение. Доктор профессиональный.'),
('Елена Г.',  1,5,'Ребёнка наблюдает Смирнова А.В. Прекрасный педиатр!');

-- ──────────────────────────────────────────────
-- Настройки сайта
-- ──────────────────────────────────────────────
CREATE TABLE `settings` (
  `key`        VARCHAR(100) NOT NULL PRIMARY KEY,
  `value`      TEXT,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `settings` (`key`,`value`) VALUES
('site_name',       'МедЦентр'),
('site_tagline',    'Сеть клиник'),
('site_phone',      '+7 (3822) 00-00-00'),
('site_email',      'info@medclinic.ru'),
('site_address',    'Томск, ул. Ленина, 1'),
('working_hours',   'Пн–Пт: 8:00–22:00, Сб–Вс: 9:00–20:00'),
('banner_enabled',  '1'),
('banner_text',     'Акция! Комплексное обследование со скидкой 40%'),
('hero_title_1',    'Ваше здоровье — наш приоритет'),
('hero_subtitle_1', '60+ клиник, 1500+ врачей — запишитесь онлайн за 2 минуты'),
('primary_color',   '#003D9C'),
('secondary_color', '#00AEEF');

-- ──────────────────────────────────────────────
-- Слоты расписания врачей
-- ──────────────────────────────────────────────
CREATE TABLE `doctor_schedules` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `doctor_id`  INT UNSIGNED NOT NULL,
  `date`       DATE         NOT NULL,
  `time`       TIME         NOT NULL,
  `is_booked`  TINYINT(1)   NOT NULL DEFAULT 0,
  UNIQUE KEY `unique_slot` (`doctor_id`,`date`,`time`),
  FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ──────────────────────────────────────────────
-- Индексы для производительности
-- ──────────────────────────────────────────────
ALTER TABLE `appointments` ADD INDEX `idx_date`      (`date`);
ALTER TABLE `appointments` ADD INDEX `idx_status`    (`status`);
ALTER TABLE `appointments` ADD INDEX `idx_doctor`    (`doctor_id`);
ALTER TABLE `doctors`      ADD INDEX `idx_clinic`    (`clinic_id`);
ALTER TABLE `doctors`      ADD INDEX `idx_specialty` (`specialty`(50));
ALTER TABLE `services`     ADD INDEX `idx_category`  (`category_id`);
ALTER TABLE `articles`     ADD INDEX `idx_published` (`is_published`,`published_at`);
