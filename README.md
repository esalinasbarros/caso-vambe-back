# Decisiones Importantes

## Variables de categorización

- Categorizar clientes por rubro
- Tamaño
- Dolor exacto
- De donde se descubrio
- Urgencia
- Presupuesto
- Volumen estimado de clientes
- Nicho: importante para generalizar la industria y poder filtrar de mejor manera.
- Por volumen: importante saber los volumenes de clientes que se cierran
- Que solucion probablemente utilizo.
- metricas de addons para ver como calzan con lso clientes en base a sus necesidades

### Decisiones sobre funcionalidades

Aca las metricas deben revelar insights valiosos que cualquier empleado pueda ver e identificar problemas o trabas en el sistema de captura de clientes. Las metricas se diseñaron para captar todas las areas en donde puede que no se estan cerrando clientes o en donde hay vendedores cuyo rendimiento no es el esperado. A continuación se muestran una serie de desiciones las cuales permiten observar y analizar los datos correctamente.


- Aca nos importaria separar entre clientes que no se han cerrado y si se han cerrado. Podemos separar los clientes para que se pueda usar data de los que si han cerrado para convencer a los que todavia no son clientes.
- Lo importante es que el usuario no tenga que leer las transcripciones. Con buena categorización deberia ser suficiente.
- Explicar un nuevo cliente y asignar un vendedor segun ventas historicas que ha cerrado. Puede incluir diferentes metricas como industria, etc.
- Metricas de industrias donde mas se vende y canales donde mas se vende. Con esto es facil analizar que areas estan debiles
- Metrica de integraciones que quizas va a requerir el cliente. Muy buena seria ver las integraciones que requiere solo los clientes que no se cerraron, para ver si ese fue un factor de no cierre.
- Incluir metricas por vendedor por industria, volumen de clientes, tamaño del cliente y problema principal de este mismo.
- Muy util es tener una idea de que producto podrian estar usando los clientes y que addons calzan bien con el giro de la empresa. Esto es una estimación nada mas porque en las transcripciones no se dice mucho mas.
- Agregar filtro por mes. Debe lograr filtrar todos los graficos.
- Se agregaron 2 graficos al inicio que muestran la evolucion en terminos de cantidad y conversión de clientes. Aplica el filtro en el insciso anterior.


## Decisiones de software
- Vamos a usar Promise.all para llamadas concurrentes. La idea es evitar el sesgo en la categorización. El precio es el mismo, ya que la api no cobra un minimo por request.
- Respuestas con structured outputs si o si, sino puede retornar data malformada.
- Codigo bien modularizado separando entre servicios, controladores y rutas. Las funciones utilizadas transversalmente las dejamos en `utils`
- Por simplicidad, dejemos los filtros actuando sobre los datos cargados en el estado. Sin embargo, para las fechas, hacemos una nueva query.
- Dejar un boton que te permita renderizar los datos a cargarlos desde cache. Aca usamos una Base de datos livianita com sqlite. Ideal seria postgres pero es pesado para lo que se requiere ahora.

## Espacios de mejora tecnica

- Filtramos a los clientes con todos los datos cargados en el front. Muy poco optimo, la idea es que el backend haga los filtros porque eso nos permitiria paginar los datos porque estos pueden ser muchos (filtrados o no filtrados).
- Agregar un linter para front y para backend si se quiere mantener codigo limpio. Lo forzariamos con pipeline o pre-commit.
- Se esta cargando todo a memoria, lo que es muy poco optimo para un dashboard
- Si el archivo es demasiado grande, ideal dejarlo en un bucket s3 y abrirlo con una funcion generadora como yield para no sobrepasar el limite de RAM.


# Comandos para ejecutar programa

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


