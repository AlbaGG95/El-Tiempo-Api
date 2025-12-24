# El Tiempo

Aplicación web **mobile-first** desarrollada con **HTML, CSS y JavaScript ** que consume la API pública **Open-Meteo** para mostrar la **previsión meteorológica local** del usuario, incluyendo el **tiempo actual**, la **previsión por horas** y la **previsión para los próximos días**.

Este proyecto ha sido realizado como **ejercicio individual** para el módulo **Frontend: JavaScript & APIs** del bootcamp **Factoría F5**.

---

## Objetivo del proyecto

El objetivo principal del proyecto es poner en práctica los conocimientos adquiridos sobre:

- Consumo de **APIs externas** desde JavaScript
- Gestión de asincronía mediante `fetch` y `async / await`
- Manipulación dinámica del **DOM**
- Diseño **responsive** con enfoque mobile-first
- Uso de **Git y GitHub** con ramas y commits estructurados
- Despliegue de una aplicación frontend con **GitHub Pages**

---

## Descripción general

**El Tiempo** es una aplicación frontend que obtiene la ubicación del usuario utilizando la **API de Geolocalización del navegador**.  
A partir de estas coordenadas, se realiza una consulta a la API **Open-Meteo**, que devuelve datos meteorológicos en formato JSON.

La información recibida se procesa y se muestra de forma clara en una única página, organizada en tres secciones principales:

- Tiempo actual
- Previsión para las próximas horas
- Previsión para los próximos días

Además, la aplicación interpreta el campo `weathercode` proporcionado por la API para mostrar un **estado del cielo** comprensible para el usuario mediante texto e iconos.

---

## Tecnologías utilizadas

- **HTML5** – Estructura semántica del contenido
- **CSS3** – Estilos, layout responsive y diseño mobile-first
- **JavaScript (ES6)** – Lógica de la aplicación, consumo de API y renderizado dinámico
- **Git & GitHub** – Control de versiones y trabajo con ramas
- **GitHub Pages** – Despliegue de la aplicación

---

## API utilizada

Los datos meteorológicos se obtienen a través de la API pública **Open-Meteo**:

https://open-meteo.com/

Características principales:
- API abierta y gratuita
- No requiere autenticación ni API key
- Diseñada para ser consumida directamente desde frontend

---

## Endpoints y parámetros utilizados

Se utiliza el endpoint base:

https://api.open-meteo.com/v1/forecast

markdown
Copiar código

Parámetros principales empleados en la consulta:

- `latitude` y `longitude` – Coordenadas del usuario
- `current_weather=true` – Datos meteorológicos actuales
- `hourly=temperature_2m,precipitation_probability,weathercode` – Previsión por horas
- `daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` – Previsión diaria
- `timezone=auto` – Ajuste automático de la zona horaria

---

## Flujo de funcionamiento de la aplicación

1. **Carga inicial**
   - Se ejecuta la función principal de inicialización.

2. **Obtención de la ubicación**
   - Se solicita permiso al usuario para acceder a su ubicación.
   - Si el permiso es concedido, se obtienen las coordenadas.
   - Si el permiso es denegado o no está disponible, se informa al usuario.

3. **Consulta a la API**
   - Se construye dinámicamente la URL con las coordenadas.
   - Se realiza una petición `fetch` a Open-Meteo.
   - Se procesa la respuesta en formato JSON.

4. **Renderizado de datos**
   - Tiempo actual: temperatura y estado del cielo.
   - Próximas horas: hora, temperatura, icono y probabilidad de precipitación.
   - Próximos días: día de la semana, temperatura mínima y máxima y probabilidad de precipitación.

5. **Interpretación del estado meteorológico**
   - El campo `weathercode` se traduce a texto e iconos mediante una función de mapeo.

---

## Funcionalidades principales

- Obtención automática de la ubicación del usuario
- Visualización del tiempo actual en tiempo real
- Previsión meteorológica por horas en formato carrusel
- Previsión diaria con temperaturas mínimas y máximas
- Representación visual del estado del cielo mediante iconos
- Diseño responsive adaptado a dispositivos móviles y escritorio

---

## Estructura del proyecto

El-Tiempo-Api/
│
├── index.html
├── index.css
├── js/
│ └── app.js
└── README.md

yaml
Copiar código

---

## Estructura del DOM

La aplicación se organiza en una única página con las siguientes secciones:

- **Tiempo actual**
  - Contenedor con temperatura y descripción
- **Próximas horas**
  - Contenedor dinámico donde se inyectan las horas desde JavaScript
- **Próximos días**
  - Contenedor dinámico con la previsión diaria

Todo el contenido se encuentra dentro de un contenedor principal que permite un centrado correcto en pantallas grandes.

---

## Gestión de errores y casos límite

La aplicación contempla los siguientes escenarios:

- Navegadores sin soporte de geolocalización
- Permiso de ubicación denegado por el usuario
- Errores de red o fallo en la respuesta de la API
- Datos incompletos o no disponibles

En estos casos, se muestra un mensaje informativo al usuario y se registran los errores en consola para facilitar la depuración.

---

## Diseño responsive

El diseño se ha desarrollado siguiendo un enfoque **mobile-first**:

- En dispositivos móviles:
  - Layout en una sola columna
  - Navegación cómoda y legible
- En dispositivos de escritorio:
  - Contenedor centrado para mejorar la experiencia de lectura
  - Espaciado y tipografía ajustados a pantallas grandes

---

## Instalación y ejecución

### Opción 1: ejecución directa
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AlbaGG95/El-Tiempo-Api.git
Abrir el archivo index.html en el navegador.

Opción 2: Live Server (recomendada)
Abrir el proyecto en Visual Studio Code.

Instalar la extensión Live Server.

Ejecutar el proyecto desde index.html.

Git y ramas
Se ha utilizado un flujo de trabajo inspirado en Gitflow simplificado:

dev: rama de desarrollo

main: rama estable y utilizada para el despliegue

El desarrollo se ha realizado en dev mediante commits progresivos y descriptivos, y posteriormente se ha realizado un merge final a main para la publicación.

Despliegue en GitHub Pages
La aplicación está desplegada mediante GitHub Pages y es accesible desde el siguiente enlace:

👉 https://AlbaGG95.github.io/El-Tiempo-Api/

Uso de Inteligencia Artificial
Durante el desarrollo del proyecto se ha utilizado IA generativa como herramienta de apoyo para:

Resolución de dudas técnicas

Mejora de la estructura del código

Ajustes de diseño y layout responsive

El código final ha sido revisado, comprendido y adaptado manualmente.

Autoría
Proyecto desarrollado por Alba Ganduxé Garcia
Bootcamp Factoría F5