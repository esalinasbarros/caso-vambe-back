# Backend Vambe

Backend con SQLite como base de datos liviana.

## Requisitos

- Node.js 22+
- npm

## Instalación

```bash
npm install
```

## Configuración de la Base de Datos

La aplicación usa SQLite como base de datos. **Los datos deben cargarse manualmente** desde el archivo `vambe_clients.csv`.

### Carga Manual de Datos

Para cargar los datos del CSV a la base de datos SQLite:

```bash
npm run load-data
```

Esto:
- Creará la base de datos si no existe
- Cargará todos los datos del CSV a `data/vambe.db`
- Los datos permanecerán guardados permanentemente
- Si ya existen datos, los reemplazará con los del CSV

**Nota:** Los datos se guardan permanentemente en `data/vambe.db` y solo se actualizan cuando ejecutas este comando manualmente.

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
npm start
```

## Estructura de la Base de Datos

La tabla `clients` contiene los siguientes campos:
- `id` (INTEGER PRIMARY KEY)
- `nombre` (TEXT)
- `correo` (TEXT)
- `telefono` (TEXT)
- `fecha` (TEXT)
- `vendedor` (TEXT)
- `closed` (INTEGER)
- `transcripcion` (TEXT)


