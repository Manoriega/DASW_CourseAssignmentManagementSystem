# DASW_CourseAssignmentManagementSystem

Este repositorio contiene el código fuente de una aplicación web de gestión de asignaciones de cursos. Permite a los profesores crear cursos y asignaciones, y a los estudiantes subir tareas en formato PDF para ser evaluadas según las rúbricas proporcionadas por el profesor. Incluye tanto el backend como el frontend.
## Tecnologías utilizadas

- Node.js
- Express.js
- HTML
- Javascript
- CSS

## Características y funcionalidades

- Creación y gestión de cursos y asignaciones por parte del profesorado.
- Subida de tareas por parte de los estudiantes en formato PDF.
- Evaluación de las tareas por parte de los compañeros según las rúbricas establecidasor el profesorado.
- Funciones de búsqueda y filtrado para cursos y asignaciones.

## Instalación

1. Clonar este repositorio:
```bash
  git clone https://github.com/Manoriega/DASW_CourseAssignmentManagementSystem.git
```

2. Acceder a la carpeta:

```bash
    cd DASW_CourseAssignmentManagementSystem
```

3. Instalar las dependencias del servidor:

```bash
    npm i
```

4. Clonar .env.example

```bash
    cp .env.example .env
```

5. Modificar en archivo .env el usuario y la contraseña
```bash
    DB_USER = "****"
    DB_PASSWORD = "****"
```

6. Correr el sistema
```bash
    npm start
```
