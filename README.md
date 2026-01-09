# El Tiempo

Aplicacion web mobile-first que consume la API publica Open-Meteo para mostrar el tiempo actual, las proximas 12 horas y un resumen de los proximos dias. El diseno esta pensado para movil: cartas tipo glass, gradientes y tipografia marcada.

- Ubicacion predeterminada: 08186 Lli\u00e7\u00e0 d'Amunt (Barcelona) sin pedir permisos.
- Boton opcional "Usar mi ubicacion" para quien quiera geolocalizarse.
- Pronostico por horas y por dias con iconos y probabilidad de lluvia.

---

## Tecnologias

- HTML5 para la estructura.
- CSS3 para el diseno responsive y los gradientes.
- JavaScript (ES6) para la logica y el consumo de la API.
- Open-Meteo como proveedor de datos meteorologicos (sin API key).

---

## Como usar el proyecto

1) Clona el repositorio  
```bash
git clone https://github.com/AlbaGG95/El-Tiempo-Api.git
cd El-Tiempo-Api
```

2) Abre `index.html` en tu navegador (o usa la extension Live Server en VS Code).

3) Al cargar, veras el tiempo de Lli\u00e7\u00e0 d'Amunt.  
   - Pulsa "Ver Lli\u00e7\u00e0 d'Amunt" para refrescar el pronostico predeterminado.  
   - Pulsa "Usar mi ubicacion" si quieres activar la geolocalizacion y ver tus propios datos.

---

## API Open-Meteo

Endpoint: `https://api.open-meteo.com/v1/forecast`

Parametros principales:
- `latitude`, `longitude` - Coordenadas a consultar.
- `current_weather=true` - Datos en tiempo real (temperatura, viento, codigo meteorologico).
- `hourly=temperature_2m,precipitation_probability,weathercode` - Serie por horas.
- `daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` - Resumen diario.
- `timezone=auto` - Ajuste automatico de la zona horaria.

Coordenadas usadas por defecto: 41.61667, 2.23333 (Lli\u00e7\u00e0 d'Amunt, Barcelona).

---

## Estructura del proyecto

```
index.html       # Maquetacion y layout principal
index.css        # Estilos, gradientes y comportamiento responsive
js/app.js        # Logica, fetch a Open-Meteo y renderizado dinamico
```

---

## Flujo de la app

1. Carga inicial: se piden los datos de Lli\u00e7\u00e0 d'Amunt sin permisos de geolocalizacion.  
2. Geolocalizacion opcional: el boton "Usar mi ubicacion" solicita permiso y actualiza el pronostico si se concede.  
3. Renderizado: se pintan el bloque "Ahora", el carrusel de 12 horas y el resumen de 7 dias.  
4. Gestion de errores: mensajes claros si falla la conexion o si no se puede obtener la ubicacion.

---

## Despliegue

El proyecto esta publicado en GitHub Pages:  
https://AlbaGG95.github.io/El-Tiempo-Api/

---

## Uso de IA

Se ha utilizado IA generativa para acelerar la maquetacion, refinar el estilo visual y revisar textos. Todo el codigo final ha sido comprendido, probado y ajustado manualmente.
