export interface CampaignLevel {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare' | 'hell';
  unlocked: boolean;
  completed: boolean;
  objectives: string[];
  radioCalls: RadioCall[];
  visitorChecks: VisitorCheck[];
  rewards: {
    experience: number;
    unlocks: string[];
  };
}

export interface RadioCall {
  id: string;
  caller: string;
  situation: string;
  description: string;
  choices: {
    text: string;
    correct: boolean;
    result: string;
  }[];
  timeLimit: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface VisitorCheck {
  id: string;
  name: string;
  reason: string;
  isHuman: boolean;
  appearance: {
    eyeColor: 'normal' | 'red' | 'glowing';
    movement: 'natural' | 'robotic' | 'jerky';
    speech: 'normal' | 'monotone' | 'glitchy';
    skin: 'normal' | 'pale' | 'synthetic';
  };
  dialogue: string[];
  checkMethods: {
    type: 'question' | 'physical' | 'observation';
    action: string;
    response: string;
    revealsIdentity: boolean;
  }[];
  timeLimit: number;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    title: "Первая смена: Знакомство",
    description: "Добро пожаловать в службу экстренного реагирования. Твоя первая ночь в охранном пункте. Нужно отвечать на вызовы по рации и проверять посетителей. Пока что все выглядит спокойно...",
    difficulty: 'easy',
    unlocked: true,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 2 вызова по рации",
      "Проверить 3 посетителей",
      "Не пропустить аниматроника"
    ],
    radioCalls: [
      {
        id: "lost_tourist",
        caller: "Турист Алексей",
        situation: "Заблудился в лесу",
        description: "Помогите! Я заблудился в темном лесу. Вижу две тропы - одна идет налево к свету фонарей, другая направо в глубь леса. Слышу странные звуки...",
        choices: [
          {
            text: "Иди к свету фонарей (налево)",
            correct: true,
            result: "Алексей добрался до дороги в безопасности! +1 спасен"
          },
          {
            text: "Иди в глубь леса (направо)", 
            correct: false,
            result: "Алексей углубился в лес и исчез... +1 потерян"
          }
        ],
        timeLimit: 30,
        urgency: 'medium'
      }
    ],
    visitorChecks: [
      {
        id: "visitor_anna",
        name: "Анна Петрова",
        reason: "Забрать документы",
        isHuman: true,
        appearance: {
          eyeColor: 'normal',
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Добрый вечер! Я пришла забрать документы.",
          "Мой муж работал здесь и забыл важные бумаги.",
          "Можно я пройду?"
        ],
        checkMethods: [
          {
            type: 'question',
            action: 'Как зовут вашего мужа?',
            response: 'Сергей Петров, он работает в отделе кадров.',
            revealsIdentity: false
          },
          {
            type: 'observation',
            action: 'Проверить глаза',
            response: 'Обычные карие глаза, естественное мигание.',
            revealsIdentity: false
          }
        ],
        timeLimit: 45
      },
      {
        id: "visitor_robot1",
        name: "Михаил Громов",
        reason: "Техническое обслуживание",
        isHuman: false,
        appearance: {
          eyeColor: 'red',
          movement: 'robotic',
          speech: 'monotone',
          skin: 'synthetic'
        },
        dialogue: [
          "Здравствуйте. Я. Пришел. Для. Технического. Обслуживания.",
          "Необходимо. Проверить. Системы.",
          "Разрешите. Пройти."
        ],
        checkMethods: [
          {
            type: 'observation',
            action: 'Посмотреть в глаза',
            response: 'Глаза светятся красным светом! Это аниматроник!',
            revealsIdentity: true
          },
          {
            type: 'question',
            action: 'Что вы будете проверять?',
            response: 'Системы. Электронные. Устройства. Компьютеры.',
            revealsIdentity: false
          }
        ],
        timeLimit: 30
      }
    ],
    rewards: {
      experience: 100,
      unlocks: ["Уровень 2"]
    }
  },
  {
    id: 2,
    title: "Ночная смена: Первые подозрения",
    description: "Вторая ночь, но уже не так спокойно. Странные посетители начинают появляться чаще. Некоторые ведут себя... неестественно. Будь начеку - не все, кто приходит, являются людьми.",
    difficulty: 'easy',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 3 вызова по рации",
      "Проверить 4 посетителей",
      "Выявить всех аниматроников"
    ],
    radioCalls: [
      {
        id: "house_fire",
        caller: "Мать семейства Анна",
        situation: "Пожар в доме",
        description: "У нас пожар! Дым везде! Есть два выхода - главный через прихожую, но там много дыма, или через окно. Что делать?!",
        choices: [
          {
            text: "Прикройте нос и идите через прихожую",
            correct: false,
            result: "Семья отравилась дымом... +2 потеряно"
          },
          {
            text: "Выбирайтесь через окно",
            correct: true,
            result: "Семья спаслась через окно! +3 спасено"
          }
        ],
        timeLimit: 25,
        urgency: 'critical'
      }
    ],
    visitorChecks: [
      {
        id: "visitor_elena",
        name: "Елена Смирнова",
        reason: "Уборщица, забыла ключи",
        isHuman: true,
        appearance: {
          eyeColor: 'normal',
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Ой, здравствуйте! Я уборщица, забыла ключи от кладовки.",
          "Работаю здесь уже 5 лет, вы можете проверить.",
          "Можно мне пройти за ключами?"
        ],
        checkMethods: [
          {
            type: 'question',
            action: 'На каком этаже кладовка?',
            response: 'На втором этаже, рядом с кабинетом директора.',
            revealsIdentity: false
          }
        ],
        timeLimit: 40
      },
      {
        id: "visitor_robot2",
        name: "Дмитрий Козлов",
        reason: "Программист, работает ночью",
        isHuman: false,
        appearance: {
          eyeColor: 'red',
          movement: 'jerky',
          speech: 'glitchy',
          skin: 'pale'
        },
        dialogue: [
          "При-и-ивет... Я про-ог-раммист...",
          "Мне нужно... *статические помехи* ...в сервер-р-рную...",
          "Разреши-и-ите войти-и-и..."
        ],
        checkMethods: [
          {
            type: 'observation',
            action: 'Проверить движения',
            response: 'Движется дергано, как робот! Явно аниматроник!',
            revealsIdentity: true
          },
          {
            type: 'physical',
            action: 'Попросить показать документы',
            response: 'Документы выглядят подделанными, фото не похоже.',
            revealsIdentity: true
          }
        ],
        timeLimit: 35
      }
    ],
    rewards: {
      experience: 150,
      unlocks: ["Уровень 3", "Детектор аниматроников"]
    }
  },
  {
    id: 3,
    title: "Красная тревога: Вторжение",
    description: "Ситуация обостряется! Аниматроники становятся более продвинутыми, их труднее распознать. Они научились лучше имитировать человеческое поведение. Один ошибочно пропущенный робот может означать катастрофу.",
    difficulty: 'medium',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 4 вызова по рации", 
      "Проверить 5 посетителей",
      "Не пропустить ни одного аниматроника",
      "Сохранить электроэнергию выше 20%"
    ],
    radioCalls: [
      {
        id: "subway_accident",
        caller: "Машинист метро Павел",
        situation: "Авария в метро",
        description: "Поезд сошел с рельсов! Люди заблокированы в туннеле. Пытаться эвакуировать через служебный ход или ждать спасателей?",
        choices: [
          {
            text: "Эвакуировать через служебный ход",
            correct: false,
            result: "Служебный ход оказался заблокирован... +8 потеряно"
          },
          {
            text: "Ждать спасательную команду",
            correct: true,
            result: "Спасатели прибыли вовремя! +12 спасено"
          }
        ],
        timeLimit: 20,
        urgency: 'critical'
      }
    ],
    visitorChecks: [
      {
        id: "visitor_advanced_robot",
        name: "Игорь Волков",
        reason: "Доставка еды",
        isHuman: false,
        appearance: {
          eyeColor: 'normal', // Замаскированный!
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Добрый вечер! Доставка пиццы для ночной смены.",
          "Заказ оплачен, вот чек. Где принимающий?",
          "Можно пройти на кухню?"
        ],
        checkMethods: [
          {
            type: 'question',
            action: 'Кто заказывал пиццу?',
            response: 'Э-э-э... не помню точно... кто-то из охраны.',
            revealsIdentity: false
          },
          {
            type: 'physical',
            action: 'Пощупать руку при передаче чека',
            response: 'Рука холодная как металл! Это робот в маскировке!',
            revealsIdentity: true
          },
          {
            type: 'observation',
            action: 'Присмотреться к коже',
            response: 'При ближайшем рассмотрении кожа выглядит искусственно.',
            revealsIdentity: true
          }
        ],
        timeLimit: 45
      }
    ],
    rewards: {
      experience: 250,
      unlocks: ["Уровень 4", "Сканер подлинности"]
    }
  },
  {
    id: 4,
    title: "Код красный: Массовая инфильтрация",
    description: "Аниматроники активизировались! Они приходят группами и стали почти неотличимы от людей. Некоторые даже научились проходить базовые проверки. Используй все методы обнаружения!",
    difficulty: 'medium',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 5 вызовов по рации",
      "Проверить 6 посетителей",
      "Выявить всех замаскированных роботов",
      "Время проверки не более 30 секунд"
    ],
    radioCalls: [],
    visitorChecks: [
      {
        id: "visitor_perfect_robot",
        name: "Наталья Кузнецова",
        reason: "Врач скорой помощи",
        isHuman: false,
        appearance: {
          eyeColor: 'normal',
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Здравствуйте! Я врач, вызвали к больному сотруднику.",
          "У меня справка и все документы в порядке.",
          "Проведите меня к пациенту, пожалуйста."
        ],
        checkMethods: [
          {
            type: 'question',
            action: 'Какие симптомы у больного?',
            response: 'Боль в груди, затрудненное дыхание, высокое давление.',
            revealsIdentity: false
          },
          {
            type: 'question',
            action: 'Какое лекарство вы дадите?',
            response: 'Нитроглицерин и... э... антибиотик-4000?',
            revealsIdentity: true
          },
          {
            type: 'physical',
            action: 'Проверить пульс на руке',
            response: 'Пульса нет! Это определенно робот!',
            revealsIdentity: true
          }
        ],
        timeLimit: 30
      }
    ],
    rewards: {
      experience: 300,
      unlocks: ["Уровень 5", "Термосканер"]
    }
  },
  {
    id: 5,
    title: "Апокалипсис: Последний рубеж",
    description: "Город охвачен хаосом! Аниматроники повсюду, они научились имитировать даже сердцебиение и дыхание. Выживших людей почти не осталось. Ты - последняя линия обороны человечества!",
    difficulty: 'hard',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 6 вызовов по рации",
      "Проверить 8 посетителей",
      "Не пропустить ни одного робота",
      "Спасти минимум 15 человек",
      "Максимальное время проверки 25 секунд"
    ],
    radioCalls: [],
    visitorChecks: [
      {
        id: "visitor_human_survivor",
        name: "Максим Орлов",
        reason: "Выживший, ищет убежище",
        isHuman: true,
        appearance: {
          eyeColor: 'normal',
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Пожалуйста, впустите меня! Они повсюду!",
          "Я настоящий человек, проверьте как хотите!",
          "У меня есть информация о их слабостях!"
        ],
        checkMethods: [
          {
            type: 'physical',
            action: 'Проверить пульс',
            response: 'Пульс есть, учащенный от страха. Человек.',
            revealsIdentity: false
          },
          {
            type: 'question',
            action: 'Расскажите о роботах',
            response: 'Они выглядят как люди, но глаза иногда мерцают. Боятся воды!',
            revealsIdentity: false
          }
        ],
        timeLimit: 25
      },
      {
        id: "visitor_ultimate_robot",
        name: "Александр Новиков",
        reason: "Спасатель МЧС",
        isHuman: false,
        appearance: {
          eyeColor: 'normal',
          movement: 'natural',
          speech: 'normal',
          skin: 'normal'
        },
        dialogue: [
          "Спасательная операция! Нужно эвакуировать персонал!",
          "У меня приказ на немедленную эвакуацию здания!",
          "Времени мало, откройте немедленно!"
        ],
        checkMethods: [
          {
            type: 'question',
            action: 'Покажите документы МЧС',
            response: 'Вот удостоверение. Время не терпит!',
            revealsIdentity: false
          },
          {
            type: 'physical',
            action: 'Брызнуть водой в лицо',
            response: 'Искры! Короткое замыкание! Робот выключился!',
            revealsIdentity: true
          },
          {
            type: 'observation',
            action: 'Проверить дыхание на стекле',
            response: 'Стекло не запотевает! Не дышит!',
            revealsIdentity: true
          }
        ],
        timeLimit: 20
      }
    ],
    rewards: {
      experience: 500,
      unlocks: ["Уровень 6", "Мастер детекции"]
    }
  },
  {
    id: 6,
    title: "Nightmare Mode: Идеальные копии",
    description: "Роботы достигли совершенства! Они полностью имитируют людей: дышат, у них есть пульс, они потеют. Единственный способ их обнаружить - тонкие детали поведения и очень продвинутые методы проверки.",
    difficulty: 'nightmare',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на 8 вызовов по рации",
      "Проверить 10 посетителей",
      "100% точность определения роботов",
      "Время проверки не более 20 секунд",
      "Спасти минимум 20 человек"
    ],
    radioCalls: [],
    visitorChecks: [],
    rewards: {
      experience: 1000,
      unlocks: ["Hell Mode", "Легенда охраны"]
    }
  },
  {
    id: 7,
    title: "Hell Mode: Невозможное",
    description: "Секретный уровень для истинных мастеров. Роботы неотличимы от людей даже при самой тщательной проверке. Твоя интуиция - единственное оружие. Один неверный шаг означает конец человечества.",
    difficulty: 'hell',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра в режиме ада",
      "Ответить на 10 вызовов по рации",
      "Проверить 15 посетителей",
      "Абсолютная точность - ошибки недопустимы",
      "Время проверки 15 секунд",
      "Спасти минимум 30 человек",
      "Электричество не тратить вообще"
    ],
    radioCalls: [],
    visitorChecks: [],
    rewards: {
      experience: 2000,
      unlocks: ["Спаситель человечества", "Бог детекции"]
    }
  }
];