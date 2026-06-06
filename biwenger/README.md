# Biwenger Liga Manager

App personal para gestionar tu liga de Biwenger con análisis de mercado IA.

## 🚀 Desplegar en GitHub Pages (paso a paso)

### Paso 1 — Crea el repositorio en GitHub
1. Ve a **github.com** e inicia sesión
2. Haz clic en **"New repository"** (botón verde)
3. Nombre: `biwenger-liga`
4. Selecciona **Public**
5. Haz clic en **"Create repository"**

### Paso 2 — Sube el código
En tu ordenador, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/biwenger-liga.git
git push -u origin main
```

### Paso 3 — Instala dependencias y despliega
```bash
npm install
npm run deploy
```

Esto construye la app y la publica automáticamente en GitHub Pages.

### Paso 4 — Activa GitHub Pages
1. Ve a tu repo en GitHub → **Settings** → **Pages**
2. En "Branch" selecciona **gh-pages**
3. Haz clic en **Save**

Tu app estará en: `https://TU_USUARIO.github.io/biwenger-liga`

### Paso 5 — Instalar en iPhone como app
1. Abre Safari en tu iPhone
2. Ve a `https://TU_USUARIO.github.io/biwenger-liga`
3. Toca el botón de **compartir** (□↑)
4. Selecciona **"Añadir a pantalla de inicio"**
5. Ponle el nombre **Biwenger** y toca **Añadir**

¡Listo! Aparece como app nativa en tu iPhone.

## 🔄 Actualizar la app
Cada vez que quieras actualizar:
```bash
git add .
git commit -m "Update"
git push
npm run deploy
```

## 📱 Funcionalidades
- **🏆 Liga** — Clasificación por presupuesto estimado de rivales
- **⚽ Equipo** — Tu plantilla con potencial Mundial por jugador
- **📊 Análisis** — Recomendaciones de ventas, fichajes y entrenador
- **🤖 Scout IA** — Sube capturas del mercado para análisis automático con IA
