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

- Aca nos importaria separar entre clientes que no se han cerrado y si se han cerrado. Podemos separar los clientes para que se pueda usar data de los que si han cerrado para convencer a los que todavia no son clientes.
- Lo importante es que el usuario no tenga que leer las transcripciones. Con buena categorización deberia ser suficiente.
- Explicar un nuevo cliente y asignar un vendedor segun ventas historicas que ha cerrado. Puede incluir diferentes metricas como industria, etc.
- Metricas de industrias donde mas se vende y canales donde mas se vende. Con esto es facil analizar que areas estan debiles
- Metrica de integraciones que quizas va a requerir el cliente. Muy buena seria ver las integraciones que requiere solo los clientes que no se cerraron, para ver si ese fue un factor (idea)
- Normalizar graficos. Si tenemos 100% en la industra de restaurantes y tenemos 1 cliente, no nos dice nada util. Hbilitar la opcion de ambos graficos.



## Decisiones de software
- Vamos a usar Promise.all para llamadas concurrentes. La idea es evitar el sesgo en la categorización. El precio es el mismo, ya que la api no cobra un minimo por request.
- Respuestas con structured outputs si o si, sino puede retornar data malformada.

## Espacios de mejora tecnica

- Filtramos a los clientes con todos los datos cargados en el front. Muy poco optimo, la idea es que el backend haga los filtros porque eso nos permitiria paginar los datos porque estos pueden ser muchos (filtrados o no filtrados).
- Agregar un linter para front y para backend si se quiere mantener codigo limpio. Lo forzariamos con pipeline o pre-commit.