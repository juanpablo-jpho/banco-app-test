
# Aplicación de Productos Financieros

## Descripción

Esta aplicación permite gestionar productos financieros ofertados por el Banco. Incluye funcionalidades como listado, búsqueda, filtrado, paginación, creación, edición y eliminación de productos. Está diseñada con Angular y consume datos de un backend que debe estar corriendo por separado.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

---

## Requisitos

### Frontend
- Node.js y npm instalados.
- Angular CLI.

### Backend
- Un servidor backend corriendo en el puerto **3002**. Este no está incluido en el repositorio.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Asegúrate de que el backend esté corriendo en el puerto **3002** antes de iniciar el frontend.

---

## Ejecución

### Servidor de desarrollo
Para iniciar el servidor de desarrollo, ejecuta:
```bash
ng serve
```
El servidor estará disponible en: [http://localhost:4200](http://localhost:4200)

### Pruebas unitarias
Para ejecutar las pruebas unitarias, ejecuta:
```bash
ng test
```

---

## Funcionalidades

### Listado de productos financieros
- Visualiza los productos financieros cargados desde una API.

### Búsqueda de productos financieros
- Permite buscar productos mediante un campo de texto.

### Cantidad de registros
- Muestra la cantidad de resultados en el listado.
- Incluye un selector con opciones para mostrar 5, 10 o 20 registros.
- Compatible con paginación simple en caso de gran cantidad de datos.

### Agregar producto
- Formulario para crear un producto con validaciones específicas:
  - **Id:** Requerido, 3-10 caracteres, debe ser único.
  - **Nombre:** Requerido, 5-100 caracteres.
  - **Descripción:** Requerido, 10-200 caracteres.
  - **Logo:** Requerido.
  - **Fecha de liberación:** Requerida, igual o mayor a la fecha actual.
  - **Fecha de revisión:** Requerida, exactamente un año después de la fecha de liberación.

### Editar producto
- Formulario para editar productos:
  - El campo **Id** está deshabilitado.
  - Validaciones idénticas al formulario de agregar.

### Eliminar producto
- Opción para eliminar productos desde un menú contextual.
- Modal de confirmación con opciones de **Cancelar** y **Eliminar**.

---

## Notas
- La aplicación no requiere autenticación.

---
