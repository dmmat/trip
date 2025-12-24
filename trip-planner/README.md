# Trip Planner

Веб-сервіс для планування спільних подорожей з друзями.

## Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності:
```bash
cd trip-planner
npm install
```

3. Налаштуйте PocketBase:
```bash
cd ../pocketbase
./pocketbase serve
```

При першому запуску відкрийте http://127.0.0.1:8090/_/ та створіть адміністративний акаунт.
Потім налаштуйте колекції згідно з інструкцією в `pocketbase/SETUP_COLLECTIONS.md`.

4. Налаштуйте змінні середовища:
```bash
cd ../trip-planner
cp .env.example .env
```

Переконайтеся, що `VITE_POCKETBASE_URL` вказує на ваш PocketBase сервер (за замовчуванням: http://127.0.0.1:8090).

5. Запустіть проект:
```bash
npm run dev
```

## Технології

- React
- Vite
- Tailwind CSS
- ShadcnUI
- Lucide Icons
- PocketBase (Backend & Database)
- React Router

## Основні функції

- **Автентифікація**: Реєстрація та вхід користувачів через PocketBase
- **Створення та управління подорожами**: Організовуйте ваші майбутні пригоди
- **Планування маршруту**: Додавайте локації та визначайте маршрут
- **Управління учасниками**: Запрошуйте друзів до подорожі
- **Розподіл витрат**: Відстежуйте витрати та автоматично розраховуйте баланс
- **Чат для обговорення**: Спілкуйтесь з учасниками подорожі в реальному часі
- **Розклад подій**: Плануйте кожен день подорожі
- **Документи**: Зберігайте всі важливі документи в одному місці

## Структура проекту

```
trip-planner/
├── src/
│   ├── components/     # React компоненти
│   ├── pages/          # Сторінки додатку
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── lib/            # Утиліти та сервіси
│   │   ├── pocketbase.js      # PocketBase клієнт
│   │   └── tripsService.js    # API для роботи з подорожами
│   └── data/           # Тестові дані (deprecated)
└── pocketbase/         # PocketBase сервер
    ├── pocketbase      # PocketBase executable
    ├── pb_data/        # База даних (gitignored)
    └── SETUP_COLLECTIONS.md  # Інструкція з налаштування

```

## Розробка

### Запуск у режимі розробки

Вам потрібно запустити два сервери:

1. PocketBase (Backend):
```bash
cd pocketbase
./pocketbase serve
```

2. React (Frontend):
```bash
cd trip-planner
npm run dev
```

### Білд для продакшену

```bash
npm run build
```

### Лінтинг

```bash
npm run lint
```

## API та База даних

Проект використовує PocketBase як backend та базу даних. PocketBase надає:
- Автентифікацію користувачів
- RESTful API
- Real-time subscriptions (WebSocket)
- Файловий storage
- Admin UI для управління даними

Детальніше про налаштування колекцій дивіться в `pocketbase/SETUP_COLLECTIONS.md`.

## Ліцензія

MIT
