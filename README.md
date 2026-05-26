
# Gameplay

Juego educativo multiplataforma para niños y docentes, enfocado en la adquisición de vocabulario en inglés mediante actividades lúdicas, refuerzo positivo y seguimiento de progreso. Incluye backend en TypeScript (Hono) y frontend en React Native (Expo).

---

## Tabla de Contenidos

- [Motivación y Objetivo](#motivación-y-objetivo)
- [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Niveles y Mecánicas del Juego](#niveles-y-mecánicas-del-juego)
- [Instalación y Configuración](#instalación-y-configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts y Automatización](#scripts-y-automatización)
- [Buenas Prácticas y Testing](#buenas-prácticas-y-testing)
- [Contribuir](#contribuir)
- [Créditos y Licencia](#créditos-y-licencia)

---

## Motivación y Objetivo

El propósito de este proyecto es facilitar el aprendizaje de vocabulario en inglés para niños de nivel inicial y primaria, integrando mecánicas de juego, refuerzos visuales y seguimiento docente. Permite a los docentes monitorear el avance y adaptar actividades.

## Arquitectura y Tecnologías

gameplay/
├── backend/      # Backend API REST ⚡
│   ├── src/      # Código fuente 📝
│   │   └── index.ts
│   ├── scripts/  # Automatización 🤖
│   │   ├── setup-ngrok-env.js
│   │   ├── start-ngrok-cli.js
│   ├── build.js  # Build backend 🏗️
│   ├── nodemon.json # Hot reload ♻️
│   ├── eslint.config.js # Linting 🧹
│   ├── tsconfig.json # TypeScript ⚙️
│   ├── package.json # Dependencias 📦
│   └── ...
├── frontend/     # App móvil/web Expo/React Native 📱
│   ├── app/      # Pantallas principales 🖼️
│   │   ├── _layout.tsx
│   │   ├── +html.tsx
│   │   ├── +not-found.tsx
│   │   ├── error-boundary.tsx
│   │   ├── index.tsx
│   │   └── game/ # Niveles y pantallas de juego 🎮
│   │       ├── CategorySelect.tsx
│   │       ├── CelebrationScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── Level1Screen.tsx
│   │       ├── Level2Screen.tsx
│   │       ├── Level3Screen.tsx
│   │       ├── Level4Screen.tsx
│   │       ├── Level5Screen.tsx
│   │       ├── LevelIntroScreen.tsx
│   │       ├── SplashScreen.tsx
│   │       └── TeacherPanelScreen.tsx
│   ├── components/ # Componentes UI reutilizables 🧩
│   │   └── game/
│   │       ├── GameHUD.tsx
│   │       ├── GuideAvatar.tsx
│   │       ├── ProgressBar.tsx
│   │       └── VocabCard.tsx
│   ├── store/ # Estado global Zustand 🗄️
│   │   └── gameStore.ts
│   ├── lib/   # Utilidades y API 🔧
│   │   ├── api.ts
│   │   ├── theme.ts
│   │   └── utils.ts
│   ├── assets/ # Imágenes y recursos 🖼️
│   │   └── images/
│   │       ├── adaptive-icon.png
│   │       ├── favicon.png
│   │       ├── icon.png
│   │       ├── react-native-reusables-dark.png
│   │       ├── react-native-reusables-light.png
│   │       └── splash.png
│   ├── global.css # Estilos globales 🎨
│   ├── tailwind.config.js # Tailwind ⚡
│   ├── nativewind-env.d.ts # NativeWind 🌬️
│   ├── eslint.config.js # Linting 🧹
│   ├── tsconfig.json # TypeScript ⚙️
│   ├── package.json # Dependencias 📦
│   └── ...
├── package.json  # Scripts raíz para desarrollo 🛠️
└── README.md  # Documentación 📖
```

**Backend:**
- TypeScript, Hono, Supabase, Nodemon, Ngrok
- Linting: ESLint, Prettier

**Frontend:**
- React Native, Expo, Zustand, NativeWind, TailwindCSS
- Linting: ESLint, Prettier

## Estructura del Proyecto

```
gameplay/
├── backend/      # API REST (Hono)
│   ├── src/      # Código fuente
│   ├── scripts/  # Automatización (ngrok, env)
│   ├── ...
├── frontend/     # App Expo/React Native
│   ├── app/      # Pantallas
│   ├── components/ # UI reutilizable
│   ├── store/    # Estado global (Zustand)
│   ├── lib/      # Utilidades y API
│   ├── ...
├── package.json  # Scripts raíz
└── README.md
```

## Niveles y Mecánicas del Juego

El juego está estructurado en 5 niveles progresivos:

1. **Recognize & Point:** Escucha y selecciona la imagen correcta.
2. **Repeat & Speak:** Repite la palabra y recibe feedback de pronunciación.
3. **Match It!:** Une imágenes con palabras en inglés.
4. **Build a Sentence:** Completa frases arrastrando palabras.
5. **Mission:** Resuelve mini-historias aplicando vocabulario aprendido.

Incluye sistema de puntos, rachas, insignias y panel docente para seguimiento.

## Instalación y Configuración

1. Clona el repositorio:
	 ```bash
	 git clone <repo-url>
	 cd gameplay
	 ```
2. Instala dependencias:
	 ```bash
	 cd backend && bun install
	 cd ../frontend && bun install
	 cd ..
	 ```
	 > Requiere [Bun](https://bun.sh/) y [Node.js](https://nodejs.org/)

## Variables de Entorno

- **frontend/.env.local**
	- `EXPO_PUBLIC_BACKEND_URL` – URL del backend (se autogenera con ngrok en desarrollo)
- **backend**
	- Configura variables de Supabase y otros servicios según sea necesario.

## Scripts y Automatización

Desde la raíz:

- `npm run dev`         – Inicia backend y frontend en paralelo
- `npm run backend`     – Solo backend
- `npm run app`         – Solo frontend
- `npm run dev:tunnel`  – Backend con ngrok (exponer API pública)

### Backend
- `bun run dev`         – API con nodemon
- `bun run dev:tunnel`  – API + ngrok + autoconfig frontend
- `bun run build`       – Compila backend
- `bun run lint`        – Lint + prettier
- `bun run typecheck`   – TypeScript check

### Frontend
- `bun run dev`         – Expo start (modo túnel)
- `bun run android`     – Expo en Android
- `bun run ios`         – Expo en iOS
- `bun run web`         – Expo en web
- `bun run lint`        – Lint + prettier
- `bun run typecheck`   – TypeScript check

## Buenas Prácticas y Testing

- Código tipado y validado con TypeScript.
- Linting y formateo automático (ESLint, Prettier).
- Separación de lógica, UI y estado global.
- Scripts para automatizar entorno de desarrollo.
- Testing manual en dispositivos y emuladores (se recomienda agregar pruebas unitarias y E2E).

## Contribuir

1. Haz fork y crea una rama `feature/<nombre>`
2. Sigue las convenciones de código y realiza PRs descriptivos.
3. Sugiere mejoras, reporta bugs o documenta nuevas funcionalidades.

## Créditos y Licencia

- Autor principal: José Díaz
- Licencia: MIT ([ver archivo LICENSE](LICENSE))
- Inspirado por docentes y estudiantes de educación inicial.

---

¿Dudas o sugerencias? Contacta a [tu-email@ejemplo.com].