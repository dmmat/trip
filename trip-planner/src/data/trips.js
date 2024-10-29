export const trips = [
  {
    id: "1",
    name: "Подорож до Парижу",
    status: "active",
    dates: {
      start: "2024-07-15",
      end: "2024-07-22",
    },
    locations: [
      {
        id: "1",
        name: "Париж",
        country: "Франція",
        duration: "3 години",
        notes: "",
        photos: [],
      },
      {
        id: "2",
        name: "Версаль",
        country: "Франція",
        duration: "2 години",
        notes: "",
        photos: [],
      },
      {
        id: "3",
        name: "Діснейленд",
        country: "Франція",
        duration: "1 день",
        notes: "",
        photos: [],
      },
    ],
    participants: [
      {
        id: "1",
        name: "Марія Петренко",
        email: "maria@example.com",
        role: "organizer",
        avatar: "https://i.pravatar.cc/300?u=mary",
      },
      {
        id: "2",
        name: "Петро Іванов",
        email: "petro@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=9",
      },
      {
        id: "3",
        name: "Олена Коваленко",
        email: "olena@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=olena",
      },
      {
        id: "4",
        name: "Андрій Шевченко",
        email: "andrii@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=andrii",
      },
      {
        id: "5",
        name: "Софія Мельник",
        email: "sofia@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=sofia",
      },
    ],
    expenses: {
      total: 53000,
      categories: [
        {
          id: "1",
          name: "Транспорт",
          items: [
            {
              id: "1",
              name: "Авіаквитки",
              amount: 15000,
              paidBy: "1",
              splitBetween: ["1", "2"],
            },
          ],
        },
        {
          id: "2",
          name: "Проживання",
          items: [
            {
              id: "2",
              name: "Готель",
              amount: 25000,
              paidBy: "2",
              splitBetween: ["1", "2"],
            },
          ],
        },
        {
          id: "3",
          name: "Інше",
          items: [
            {
              id: "3",
              name: "Харчування",
              amount: 8000,
              paidBy: "1",
              splitBetween: ["1", "2"],
            },
            {
              id: "4",
              name: "Розваги",
              amount: 5000,
              paidBy: "2",
              splitBetween: ["1", "2"],
            },
          ],
        },
      ],
    },
    schedule: {
      days: [
        {
          id: "1",
          date: "2024-07-15",
          location: "Париж",
          events: [
            {
              id: "1",
              time: "09:00",
              title: "Виліт з Києва",
              description: "Термінал D, реєстрація починається о 7:00",
              type: "transport",
              duration: "2 год",
              location: "Аеропорт Бориспіль",
            },
            {
              id: "2",
              time: "12:00",
              title: "Прибуття в Париж",
              description: "Аеропорт Шарль-де-Голль",
              type: "transport",
              duration: "30 хв",
              location: "Аеропорт Шарль-де-Голль",
            },
            {
              id: "3",
              time: "13:00",
              title: "Трансфер до готелю",
              description: "Приватний трансфер від аеропорту до готелю",
              type: "transport",
              duration: "45 хв",
              location: "Париж",
            },
            {
              id: "4",
              time: "14:00",
              title: "Заселення в готель",
              description: "Grand Hotel Paris, реєстрація та відпочинок",
              type: "accommodation",
              duration: "1 год",
              location: "Grand Hotel Paris",
            },
            {
              id: "5",
              time: "16:00",
              title: "Прогулянка Монмартром",
              description: "Відвідування богемного району, базиліки Сакре-Кер",
              type: "sightseeing",
              duration: "3 год",
              location: "Монмартр",
            },
            {
              id: "6",
              time: "19:30",
              title: "Вечеря в ресторані",
              description: "Традиційна французька кухня",
              type: "food",
              duration: "2 год",
              location: "Le Petit Bistrot",
            },
          ],
        },
        {
          id: "2",
          date: "2024-07-16",
          location: "Париж",
          events: [
            {
              id: "7",
              time: "09:00",
              title: "Сніданок у готелі",
              description: "Континентальний сніданок",
              type: "food",
              duration: "1 год",
              location: "Grand Hotel Paris",
            },
            {
              id: "8",
              time: "10:30",
              title: "Відвідування Лувру",
              description: "Екскурсія найбільшим музеєм світу",
              type: "culture",
              duration: "4 год",
              location: "Лувр",
            },
            {
              id: "9",
              time: "15:00",
              title: "Прогулянка садом Тюїльрі",
              description: "Відпочинок у королівському саду",
              type: "leisure",
              duration: "1.5 год",
              location: "Сад Тюїльрі",
            },
            {
              id: "10",
              time: "17:00",
              title: "Круїз по Сені",
              description: "Річкова прогулянка з оглядом визначних пам'яток",
              type: "leisure",
              duration: "1.5 год",
              location: "Річка Сена",
            },
            {
              id: "11",
              time: "20:00",
              title: "Вечеря на Єлисейських полях",
              description: "Вишукана вечеря в престижному районі",
              type: "food",
              duration: "2 год",
              location: "L'Avenue Restaurant",
            },
          ],
        },
        {
          id: "3",
          date: "2024-07-17",
          location: "Версаль",
          events: [
            {
              id: "12",
              time: "08:30",
              title: "Сніданок у готелі",
              description: "Континентальний сніданок",
              type: "food",
              duration: "1 год",
              location: "Grand Hotel Paris",
            },
            {
              id: "13",
              time: "10:00",
              title: "Трансфер до Версалю",
              description: "Поїздка на RER C",
              type: "transport",
              duration: "1 год",
              location: "Версаль",
            },
            {
              id: "14",
              time: "11:00",
              title: "Екскурсія Версальським палацом",
              description: "Відвідування королівської резиденції з гідом",
              type: "culture",
              duration: "3 год",
              location: "Версальський палац",
            },
            {
              id: "15",
              time: "14:30",
              title: "Обід в Le Notre",
              description: "Французька кухня з видом на сади",
              type: "food",
              duration: "1.5 год",
              location: "Версаль",
            },
            {
              id: "16",
              time: "16:00",
              title: "Прогулянка садами Версалю",
              description: "Огляд фонтанів та партерів",
              type: "leisure",
              duration: "2 год",
              location: "Версальські сади",
            },
          ],
        },
        {
          id: "4",
          date: "2024-07-18",
          location: "Париж",
          events: [
            {
              id: "17",
              time: "09:30",
              title: "Сніданок в кафе",
              description: "Круасани та кава в паризькому кафе",
              type: "food",
              duration: "1 год",
              location: "Café de Flore",
            },
            {
              id: "18",
              time: "11:00",
              title: "Відвідування Ейфелевої вежі",
              description: "Підйом на оглядовий майданчик",
              type: "sightseeing",
              duration: "3 год",
              location: "Ейфелева вежа",
            },
            {
              id: "19",
              time: "15:00",
              title: "Відвідування музею Орсе",
              description: "Знайомство з імпресіоністами",
              type: "culture",
              duration: "2.5 год",
              location: "Музей Орсе",
            },
            {
              id: "20",
              time: "18:00",
              title: "Шопінг в Le Marais",
              description: "Відвідування бутиків та магазинів",
              type: "shopping",
              duration: "2 год",
              location: "Le Marais",
            },
            {
              id: "21",
              time: "20:30",
              title: "Вечеря в Le Marais",
              description: "Вечеря в історичному кварталі",
              type: "food",
              duration: "2 год",
              location: "L'As du Fallafel",
            },
          ],
        },
        {
          id: "5",
          date: "2024-07-19",
          location: "Діснейленд",
          events: [
            {
              id: "22",
              time: "08:00",
              title: "Сніданок у готелі",
              description: "Ранній сніданок перед виїздом",
              type: "food",
              duration: "45 хв",
              location: "Grand Hotel Paris",
            },
            {
              id: "23",
              time: "09:00",
              title: "Трансфер до Діснейленду",
              description: "Поїздка на RER A",
              type: "transport",
              duration: "45 хв",
              location: "Діснейленд Париж",
            },
            {
              id: "24",
              time: "10:00",
              title: "День у Діснейленді",
              description: "Відвідування атракціонів та шоу",
              type: "entertainment",
              duration: "10 год",
              location: "Діснейленд Париж",
            },
            {
              id: "25",
              time: "21:30",
              title: "Повернення до готелю",
              description: "Трансфер назад до Парижу",
              type: "transport",
              duration: "45 хв",
              location: "Париж",
            },
          ],
        },
      ],
    },
    documents: [
      {
        id: "1",
        name: "Авіаквитки.pdf",
        category: "transport",
        size: "245 KB",
        addedDate: "2024-07-14",
        url: "",
      },
      {
        id: "2",
        name: "Бронювання готелю.pdf",
        category: "accommodation",
        size: "180 KB",
        addedDate: "2024-07-13",
        url: "",
      },
      {
        id: "3",
        name: "Страховий поліс.pdf",
        category: "insurance",
        size: "156 KB",
        addedDate: "2024-07-12",
        url: "",
      },
      {
        id: "4",
        name: "Список речей.docx",
        category: "other",
        size: "45 KB",
        addedDate: "2024-07-10",
        url: "",
      },
      {
        id: "5",
        name: "Маршрут подорожі.pdf",
        category: "other",
        size: "320 KB",
        addedDate: "2024-07-11",
        url: "",
      },
    ],
    chat: {
      messages: [
        {
          id: "1",
          userId: "1",
          date: "2024-07-15",
          time: "10:30",
          message:
            "Всім привіт! Я знайшла чудовий ресторан біля нашого готелю, рейтинг 4.8 та прийнятні ціни.",
        },
        {
          id: "2",
          userId: "2",
          date: "2024-07-15",
          time: "10:35",
          message: "Чудова ідея! Можеш скинути посилання на ресторан?",
        },
        {
          id: "3",
          userId: "1",
          date: "2024-07-15",
          time: "10:37",
          message:
            "Звичайно! Ось посилання: https://restaurant.fr/menu. Може забронюємо столик на 19:00?",
        },
        {
          id: "4",
          userId: "2",
          date: "2024-07-15",
          time: "10:40",
          message: "Супер! 19:00 мені підходить. Дякую за організацію!",
        },
        {
          id: "5",
          userId: "1",
          date: "2024-07-15",
          time: "10:42",
          message:
            "Чудово, тоді я забронюю. Будемо смакувати французьку кухню! 😋",
        },
      ],
    },
    importantInfo: {
      nextEvent: {
        id: "1",
        title: "Виліт з Києва",
        date: "2024-07-15",
        time: "10:00",
      },
      weather: {
        location: "Париж",
        temperature: 25,
        condition: "sunny",
      },
      alerts: [
        {
          id: "1",
          message: "Не забудьте перевірити термін дії паспорта",
          type: "warning",
        },
      ],
    },
  },
  {
    id: "2",
    name: "Відпочинок в Карпатах",
    status: "active",
    dates: {
      start: "2024-08-10",
      end: "2024-08-15",
    },
    locations: [
      {
        id: "1",
        name: "Буковель",
        country: "Україна",
        duration: "2 дні",
        notes: "",
        photos: [],
      },
      {
        id: "2",
        name: "Яремче",
        country: "Україна",
        duration: "2 дні",
        notes: "",
        photos: [],
      },
      {
        id: "3",
        name: "Ворохта",
        country: "Україна",
        duration: "1 день",
        notes: "",
        photos: [],
      },
    ],
    participants: [
      {
        id: "1",
        name: "Олег Мороз",
        email: "oleg@example.com",
        role: "organizer",
        avatar: "https://i.pravatar.cc/300?u=oleg",
      },
      {
        id: "2",
        name: "Наталія Коваль",
        email: "natalia@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=natalia",
      },
      {
        id: "3",
        name: "Василь Петренко",
        email: "vasyl@example.com",
        role: "participant",
        avatar: "https://i.pravatar.cc/300?u=vasyl",
      },
    ],
    expenses: {
      total: 15000,
      categories: [
        {
          id: "1",
          name: "Транспорт",
          items: [
            {
              id: "1",
              name: "Квитки на потяг",
              amount: 2000,
              paidBy: "1",
              splitBetween: ["1", "2", "3"],
            },
          ],
        },
        {
          id: "2",
          name: "Проживання",
          items: [
            {
              id: "2",
              name: "Готель в Буковелі",
              amount: 8000,
              paidBy: "1",
              splitBetween: ["1", "2", "3"],
            },
          ],
        },
        {
          id: "3",
          name: "Інше",
          items: [
            {
              id: "3",
              name: "Харчування",
              amount: 3000,
              paidBy: "2",
              splitBetween: ["1", "2", "3"],
            },
            {
              id: "4",
              name: "Екскурсії",
              amount: 2000,
              paidBy: "3",
              splitBetween: ["1", "2", "3"],
            },
          ],
        },
      ],
    },
    schedule: {
      days: [
        {
          id: "1",
          date: "2024-08-10",
          location: "Буковель",
          events: [
            {
              id: "1",
              time: "07:00",
              title: "Виїзд з Києва",
              description: "Потяг Київ-Івано-Франківськ",
              type: "transport",
              duration: "8 год",
              location: "Залізничний вокзал",
            },
            {
              id: "2",
              time: "15:00",
              title: "Прибуття в Буковель",
              description: "Трансфер до готелю",
              type: "transport",
              duration: "1 год",
              location: "Буковель",
            },
            {
              id: "3",
              time: "16:00",
              title: "Заселення в готель",
              description: "Готель 'Карпатські зорі'",
              type: "accommodation",
              duration: "1 год",
              location: "Буковель",
            },
            {
              id: "4",
              time: "18:00",
              title: "Вечеря в ресторані",
              description: "Традиційна гуцульська кухня",
              type: "food",
              duration: "2 год",
              location: "Ресторан 'Гуцульщина'",
            },
          ],
        },
        {
          id: "2",
          date: "2024-08-11",
          location: "Буковель",
          events: [
            {
              id: "5",
              time: "09:00",
              title: "Сніданок",
              description: "Сніданок в готелі",
              type: "food",
              duration: "1 год",
              location: "Готель",
            },
            {
              id: "6",
              time: "10:30",
              title: "Підйом на гору Говерла",
              description: "Піший похід з гідом",
              type: "activity",
              duration: "6 год",
              location: "Говерла",
            },
            {
              id: "7",
              time: "17:00",
              title: "Відпочинок в СПА",
              description: "Сауна та басейн",
              type: "leisure",
              duration: "2 год",
              location: "Готель",
            },
          ],
        },
        {
          id: "3",
          date: "2024-08-12",
          location: "Яремче",
          events: [
            {
              id: "8",
              time: "10:00",
              title: "Переїзд в Яремче",
              description: "Трансфер до готелю",
              type: "transport",
              duration: "1 год",
              location: "Яремче",
            },
            {
              id: "9",
              time: "12:00",
              title: "Водоспад Пробій",
              description: "Екскурсія до водоспаду",
              type: "sightseeing",
              duration: "2 год",
              location: "Яремче",
            },
            {
              id: "10",
              time: "15:00",
              title: "Сувенірний ринок",
              description: "Шопінг на місцевому ринку",
              type: "shopping",
              duration: "2 год",
              location: "Яремче",
            },
          ],
        },
      ],
    },
    documents: [
      {
        id: "1",
        name: "Квитки на потяг.pdf",
        category: "transport",
        size: "156 KB",
        addedDate: "2024-08-01",
        url: "",
      },
      {
        id: "2",
        name: "Бронювання готелю.pdf",
        category: "accommodation",
        size: "245 KB",
        addedDate: "2024-08-02",
        url: "",
      },
      {
        id: "3",
        name: "Страховка.pdf",
        category: "insurance",
        size: "180 KB",
        addedDate: "2024-08-03",
        url: "",
      },
    ],
    chat: {
      messages: [
        {
          id: "1",
          userId: "1",
          date: "2024-08-01",
          time: "12:30",
          message:
            "Всім привіт! Не забудьте взяти теплі речі та зручне взуття для походу.",
        },
        {
          id: "2",
          userId: "2",
          date: "2024-08-01",
          time: "12:35",
          message:
            "Дякую за нагадування! А які ще речі потрібні для походу на Говерлу?",
        },
        {
          id: "3",
          userId: "1",
          date: "2024-08-01",
          time: "12:40",
          message:
            "Обов'язково беріть: рюкзак, дощовик, воду, перекус, сонцезахисний крем та головний убір.",
        },
      ],
    },
    importantInfo: {
      nextEvent: {
        id: "1",
        title: "Виїзд з Києва",
        date: "2024-08-10",
        time: "07:00",
      },
      weather: {
        location: "Буковель",
        temperature: 22,
        condition: "partly_cloudy",
      },
      alerts: [
        {
          id: "1",
          message: "Не забудьте взяти теплі речі та спорядження для походу",
          type: "info",
        },
      ],
    },
  },
];
