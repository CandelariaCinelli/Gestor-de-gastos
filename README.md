# Informe del proyecto: Aplicación de administración de gastos e ingresos

**Estudiante:** Candelaria Cinelli  
**Carrera:** Tecnicatura en Desarrollo de Software
**Proyecto:** Aplicación de administración de gastos e ingresos  
**Tecnologías:** React Native, Expo, TypeScript y SQLite  


---

## 1. Introducción

El presente proyecto consiste en el desarrollo de una aplicación para administrar los ingresos y gastos personales. Su objetivo es permitir que el usuario registre sus movimientos de dinero, consulte las operaciones realizadas y conozca el saldo disponible a partir de un saldo inicial y de los movimientos registrados.

La aplicación fue desarrollada utilizando React Native y Expo, con TypeScript como lenguaje de programación. Para almacenar y consultar la información se utiliza una base de datos SQLite, contemplando también la ejecución de la aplicación desde un navegador web.

El sistema busca ofrecer una interfaz sencilla e intuitiva que permita registrar y consultar información de manera organizada.

## 2. Objetivos

### 2.1. Objetivo general

Desarrollar una aplicación multiplataforma que permita administrar ingresos y gastos personales mediante el registro de movimientos y el cálculo del saldo disponible.

### 2.2. Objetivos específicos

- Registrar ingresos y gastos.
- Consultar los movimientos realizados.
- Modificar y eliminar movimientos.
- Organizar los movimientos mediante categorías.
- Establecer un saldo inicial.
- Calcular el saldo actual considerando los ingresos y gastos registrados.
- Almacenar y consultar información mediante una base de datos.
- Desarrollar una interfaz que pueda ejecutarse en dispositivos móviles y en la web.
- Informar al usuario sobre el resultado de las operaciones realizadas.

## 3. Tecnologías utilizadas

### React Native

Permite desarrollar interfaces de usuario para aplicaciones móviles mediante componentes reutilizables.

### Expo

Facilita la configuración, el desarrollo y la ejecución del proyecto React Native.

### TypeScript

Permite incorporar tipos de datos al código, definir estructuras e interfaces y detectar determinados errores durante el desarrollo.

### SQLite

Es un sistema de base de datos relacional utilizado para almacenar y consultar la información de la aplicación.

### SQL.js

Se utiliza para permitir la ejecución de consultas SQLite desde JavaScript en el navegador web. En la implementación en memoria, los datos no se conservan automáticamente después de recargar o cerrar la página, salvo que se implemente un mecanismo adicional de persistencia.

## 4. Descripción general de la aplicación

La aplicación está orientada al control de las finanzas personales. Permite registrar operaciones económicas y consultar los movimientos para conocer cómo evoluciona el saldo.

Las funcionalidades principales son:

- Registro de ingresos.
- Registro de gastos.
- Consulta de movimientos.
- Edición y eliminación de movimientos.
- Administración de categorías.
- Configuración del saldo inicial.
- Cálculo del saldo actual.

### 4.1. Pantalla principal

La pantalla principal permite acceder a las funcionalidades de la aplicación y consultar la información general del saldo.

**Figura 1. Pantalla principal de la aplicación.**

![Figura 1: Pantalla principal](capturas/01-pantalla-principal.png)

*Fuente: captura de pantalla propia.*

## 5. Funcionalidades implementadas

### 5.1. Registro de movimientos

El sistema permite registrar movimientos económicos indicando los datos solicitados por el formulario, como el tipo de movimiento, el importe, la categoría y la descripción, si corresponde.

Los movimientos pueden ser de dos tipos:

- **Ingreso:** representa dinero que se incorpora al saldo.
- **Gasto:** representa dinero que se descuenta del saldo.

Una vez completado el formulario, la información se envía a la función encargada de guardar los datos en la base de datos.

**Figura 2. Formulario para registrar un movimiento.**

![Figura 2: Formulario de movimiento](capturas/02-nuevo-movimiento.png)

*Fuente: captura de pantalla propia.*

### 5.2. Consulta de movimientos

La aplicación permite visualizar los movimientos registrados para consultar las operaciones realizadas.

El listado facilita la revisión de los ingresos y gastos almacenados.

**Figura 3. Listado de movimientos registrados.**

![Figura 3: Listado de movimientos](capturas/03-listado-movimientos.png)

*Fuente: captura de pantalla propia.*

### 5.3. Edición de movimientos

La aplicación permite modificar los datos de un movimiento previamente registrado. Para ello, se obtiene la información del movimiento seleccionado y se utiliza para completar el formulario de edición.

Después de realizar los cambios, se actualiza el registro correspondiente.

### 5.4. Eliminación de movimientos

El usuario puede eliminar movimientos que ya no necesita conservar. Esta operación elimina el registro seleccionado de la base de datos.

La eliminación debe reflejarse en el listado y en el cálculo del saldo, ya que los movimientos registrados se utilizan para determinar el saldo actual.

### 5.5. Administración de categorías

Las categorías permiten clasificar los movimientos y facilitar su organización.

La aplicación permite consultar las categorías existentes y contempla la creación y eliminación de categorías de acuerdo con las funcionalidades implementadas.

**Figura 4. Administración de categorías.**

![Figura 4: Categorías](capturas/04-categorias.png)

*Fuente: captura de pantalla propia.*

### 5.6. Configuración del saldo inicial

El saldo inicial representa el dinero disponible al comenzar a utilizar la aplicación.

El sistema permite establecer o actualizar este valor, que se utiliza como punto de partida para calcular el saldo actual.

**Figura 5. Configuración del saldo inicial.**

![Figura 5: Saldo inicial](capturas/05-saldo-inicial.png)

*Fuente: captura de pantalla propia.*

### 5.7. Cálculo del saldo actual

El saldo actual se obtiene considerando el saldo inicial, los ingresos registrados y los gastos realizados.

La fórmula utilizada es:

**Saldo actual = Saldo inicial + Total de ingresos − Total de gastos**

Por ejemplo, si el saldo inicial es de $100.000, los ingresos suman $30.000 y los gastos alcanzan los $20.000, el saldo actual será de $110.000.

Este cálculo permite conocer el resultado de los movimientos económicos registrados.

### 5.8. Mensajes de confirmación

Los mensajes de confirmación permiten informar al usuario sobre el resultado de una operación.

Por ejemplo, después de registrar un movimiento, la aplicación puede mostrar un mensaje como “Gasto añadido con éxito” o “Ingreso añadido con éxito”. También pueden mostrarse mensajes para confirmar la actualización del saldo inicial o informar que ocurrió un error.

Estos mensajes deben aparecer después de que la operación haya finalizado correctamente.

**Figura 6. Mensaje de confirmación después de una operación.**

![Figura 6: Mensaje de confirmación](capturas/06-mensaje-confirmacion.png)

*Fuente: captura de pantalla propia.*

## 6. Organización del proyecto

El proyecto se organiza en carpetas para separar las pantallas, el acceso a los datos, los servicios y los tipos utilizados por la aplicación.

- **`app/`**: contiene las pantallas y la configuración de navegación.
- **`database/`**: contiene la configuración y las funciones relacionadas con la base de datos.
- **`services/`**: contiene las funciones para consultar, registrar, modificar y eliminar información.
- **`types/`**: contiene definiciones de tipos e interfaces de TypeScript.
- **`utils/`**: puede contener funciones auxiliares reutilizables.

Entre los archivos de la aplicación se encuentran:

- `app/_layout.tsx`: configura la navegación.
- `app/index.tsx`: corresponde a la pantalla principal.
- `app/movimientos.tsx`: muestra los movimientos registrados.
- `app/nuevo-movimiento.tsx`: contiene el formulario para registrar o editar movimientos.
- `app/categorias.tsx`: permite administrar categorías y configurar el saldo inicial.

La separación de responsabilidades facilita el mantenimiento del código y evita concentrar toda la lógica dentro de las pantallas.

## 7. Base de datos

La aplicación utiliza una base de datos relacional para organizar la información.

### 7.1. Tabla de movimientos

La tabla de movimientos almacena las operaciones económicas registradas.

Entre los datos que puede contener se encuentran el identificador del movimiento, el tipo, el importe, la categoría asociada y la descripción, de acuerdo con la estructura implementada.

### 7.2. Tabla de categorías

La tabla de categorías almacena las categorías utilizadas para clasificar los movimientos.

Cada categoría posee un identificador y los datos descriptivos correspondientes.

### 7.3. Inicialización de la base de datos

La inicialización se realiza desde los archivos del directorio `database/`, donde se define la estructura necesaria para trabajar con la información.

Los servicios utilizan funciones de acceso a datos para ejecutar consultas SQL y obtener los registros que necesitan las pantallas.

### 7.4. Diferencias entre móvil y web

La aplicación contempla distintas implementaciones para acceder a los datos según la plataforma.

En el entorno móvil se utiliza la implementación compatible con React Native. En la web se utiliza SQL.js para ejecutar consultas en el navegador.

La implementación web en memoria no conserva automáticamente los cambios después de recargar o cerrar la página. Para mantener los datos entre sesiones sería necesario incorporar un mecanismo de persistencia adicional.

## 8. Funcionamiento técnico

### 8.1. Interfaz de usuario

Las pantallas permiten ingresar información, consultar movimientos y realizar acciones sobre los registros. Los estados de React permiten actualizar la información presentada cuando se producen cambios.

### 8.2. Servicios

Los servicios agrupan las operaciones relacionadas con cada entidad. Por ejemplo, los servicios de movimientos pueden encargarse de crear, consultar, modificar y eliminar registros, además de calcular el saldo actual.

Los servicios de categorías se encargan de las operaciones correspondientes a las categorías y al saldo inicial.

### 8.3. Acceso a datos

Las funciones de acceso a datos ejecutan las consultas necesarias para guardar y recuperar la información.

Esta organización permite que las pantallas utilicen los servicios sin tener que implementar directamente toda la lógica SQL en cada componente.

## 9. Navegación

La navegación se configura mediante el archivo `_layout.tsx`, utilizando Expo Router.

Esta organización permite separar las funcionalidades en diferentes pantallas y acceder a ellas de forma sencilla.

## 10. Validaciones y manejo de errores

Para mejorar la confiabilidad de la aplicación, es importante validar los datos antes de guardarlos.

Entre las validaciones que se deben contemplar se encuentran:

- Verificar que el importe sea válido.
- Evitar guardar movimientos sin los datos obligatorios.
- Comprobar que se haya seleccionado una categoría cuando sea requerida.
- Informar al usuario cuando una operación no pueda completarse.
- Evitar mostrar mensajes de éxito antes de confirmar que los datos se guardaron correctamente.

Las operaciones asíncronas pueden controlarse mediante `async`, `await` y bloques `try/catch`. Esto permite esperar los resultados y manejar posibles errores.


## 11. Conclusión

El desarrollo de esta aplicación permitió aplicar conocimientos de React Native, Expo y TypeScript para construir una interfaz organizada en diferentes pantallas y utilizar una base de datos relacional para almacenar y consultar información.

El proyecto integra operaciones de registro, consulta, modificación y eliminación de movimientos, administración de categorías y cálculo del saldo actual.

También permite aplicar conceptos importantes de programación, como la separación de responsabilidades, el uso de funciones reutilizables, las operaciones asíncronas y el manejo de errores.

La adaptación para la web permite comprender las diferencias entre plataformas y la necesidad de utilizar soluciones compatibles con cada entorno.

En conclusión, el proyecto constituye una aplicación práctica para aplicar los conocimientos adquiridos durante la carrera y ofrece una base para incorporar nuevas funcionalidades en el futuro.



