import type { Locale } from "locales/types";

/**
 * Copy of the /download page, kept out of locales/*.ts on purpose.
 *
 * The locale object has reached the type-instantiation budget of next-international 1.3.1 under TypeScript 5.8:
 * adding a single key anywhere in locales/en.ts makes `t()` lose its typing in unrelated files
 * (28 "Expected 2 arguments, but got 1" errors, caused by a TS2589 inside next-international's .d.ts that
 * skipLibCheck hides). Measured on 2026-11-02, see tasks/todo.md. Until the locale typing is fixed, this page
 * carries its own strings.
 */
export type DownloadCopy = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  appStore: string;
  googlePlay: string;
  qrTitle: string;
  qrHint: string;
  webHint: string;
  webLink: string;
};

export const downloadCopy: Record<Locale, DownloadCopy> = {
  en: {
    metaTitle: "Download Workout.cool for iPhone and Android",
    metaDescription:
      "Get the free, open-source workout app on the App Store or Google Play. Pick your equipment and target muscles, get a session, track every set.",
    title: "Get Workout.cool on your phone",
    subtitle: "Pick your equipment, pick your muscles, train. Free to download, open source.",
    appStore: "Download on the App Store",
    googlePlay: "Get it on Google Play",
    qrTitle: "On a computer?",
    qrHint: "Point your phone's camera at the code: it opens the right store.",
    webHint: "Or train right here, in your browser:",
    webLink: "open the web version",
  },
  fr: {
    metaTitle: "Télécharger Workout.cool sur iPhone et Android",
    metaDescription:
      "L'app d'entraînement gratuite et open source sur l'App Store et Google Play. Choisis ton matériel et tes muscles, reçois ta séance, note chaque série.",
    title: "Workout.cool dans ta poche",
    subtitle: "Choisis ton matériel, choisis tes muscles, entraîne-toi. Gratuit au téléchargement, open source.",
    appStore: "Télécharger dans l'App Store",
    googlePlay: "Disponible sur Google Play",
    qrTitle: "Sur un ordinateur ?",
    qrHint: "Vise le code avec l'appareil photo de ton téléphone : il ouvre le bon store.",
    webHint: "Ou entraîne-toi ici, dans ton navigateur :",
    webLink: "ouvrir la version web",
  },
  es: {
    metaTitle: "Descarga Workout.cool para iPhone y Android",
    metaDescription:
      "La app de entrenamiento gratuita y de código abierto en App Store y Google Play. Elige tu equipo y tus músculos, recibe tu sesión, registra cada serie.",
    title: "Workout.cool en tu móvil",
    subtitle: "Elige tu equipo, elige tus músculos, entrena. Descarga gratuita, código abierto.",
    appStore: "Descargar en App Store",
    googlePlay: "Disponible en Google Play",
    qrTitle: "¿Estás en un ordenador?",
    qrHint: "Apunta la cámara de tu móvil al código: abre la tienda correcta.",
    webHint: "O entrena aquí mismo, en tu navegador:",
    webLink: "abrir la versión web",
  },
  pt: {
    metaTitle: "Baixe o Workout.cool para iPhone e Android",
    metaDescription:
      "O app de treino gratuito e de código aberto na App Store e no Google Play. Escolha seu equipamento e seus músculos, receba seu treino, registre cada série.",
    title: "Workout.cool no seu celular",
    subtitle: "Escolha seu equipamento, escolha seus músculos, treine. Download gratuito, código aberto.",
    appStore: "Baixar na App Store",
    googlePlay: "Disponível no Google Play",
    qrTitle: "Está no computador?",
    qrHint: "Aponte a câmera do celular para o código: ele abre a loja certa.",
    webHint: "Ou treine aqui mesmo, no navegador:",
    webLink: "abrir a versão web",
  },
  ru: {
    metaTitle: "Скачать Workout.cool для iPhone и Android",
    metaDescription:
      "Бесплатное приложение для тренировок с открытым исходным кодом в App Store и Google Play. Выберите инвентарь и мышцы, получите тренировку, записывайте каждый подход.",
    title: "Workout.cool в вашем телефоне",
    subtitle: "Выберите инвентарь, выберите мышцы, тренируйтесь. Бесплатная загрузка, открытый исходный код.",
    appStore: "Загрузить в App Store",
    googlePlay: "Доступно в Google Play",
    qrTitle: "Вы за компьютером?",
    qrHint: "Наведите камеру телефона на код: откроется нужный магазин.",
    webHint: "Или тренируйтесь прямо здесь, в браузере:",
    webLink: "открыть веб-версию",
  },
  "zh-CN": {
    metaTitle: "下载 Workout.cool（iPhone 和 Android）",
    metaDescription: "免费开源的健身训练应用，已上架 App Store 和 Google Play。选择器材和目标肌群，生成训练课程，记录每一组。",
    title: "把 Workout.cool 装进手机",
    subtitle: "选器材，选肌群，开练。免费下载，开源。",
    appStore: "在 App Store 下载",
    googlePlay: "在 Google Play 获取",
    qrTitle: "正在用电脑？",
    qrHint: "用手机相机对准二维码，会自动打开对应的应用商店。",
    webHint: "或者直接在浏览器里训练：",
    webLink: "打开网页版",
  },
};

export const getDownloadCopy = (locale: string): DownloadCopy => downloadCopy[locale as Locale] ?? downloadCopy.en;
