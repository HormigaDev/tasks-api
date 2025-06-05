<img src="./assets/banner.png">

# Oh My TASK API

API ligera para gestión de tareas (TO-DO), diseñada como base flexible para desarrollar aplicaciones TODO más complejas.

## Índice

- [Dependencias](#dependencias)
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Documentación](#documentación)
- [Licencia](#licencia)
- [Contribuciones](#contribuciones)
- [Contacto](#contacto)

## Dependencias

Este proyecto utiliza dos dependencias desarrolladas en Rust, totalmente auditables:

- [R-BACKUPS – Gestor de bases de datos](https://github.com/HormigaDev/r-backups)
- [R-PERMS – Calculador de permisos simple y rápido](https://github.com/HormigaDev/r-perms)

## Características principales

- Gestión de usuarios con estados definidos (Activo, Inactivo, Bloqueado, Eliminado) y roles con permisos asociados.
- CRUD completo para tareas, subtareas, categorías, etiquetas, hitos (milestones) y comentarios.
- Control de estados y prioridades para tareas y subtareas.
- Relación muchos a muchos entre tareas/subtareas y etiquetas, comentarios y archivos adjuntos.
- Soporte para archivos adjuntos con metadatos, vinculados a tareas y subtareas.
- Sistema de notificaciones programadas asociadas a tareas.
- Registro detallado de historial de acciones para auditoría, con datos JSON.
- Configuración de límites específicos por usuario, incluyendo máximo de tareas, tareas por hito, etiquetas, categorías, subtareas por tarea, comentarios, hitos y almacenamiento para adjuntos.

## Tecnologías Utilizadas

- **Backend:** NestJS, TypeORM, TypeScript
- **Base de datos:** PostgreSQL
- **Cache:** Redis
- **Autenticación:** JWT y bcrypt para el hash de contraseñas
- **Almacenamiento de archivos:** Comunicación gRPC con un servicio en Rust ([r-filestorage](https://github.com/HormigaDev/r-filestorage))
- **Permisos:** Sistema basado en bitmask usando [r-perms](https://github.com/HormigaDev/r-perms) para el cálculo de permisos
- **Validación:** class-validator, class-transformer
- **Tiempo real:** WebSockets mediante socket.io (para comentarios y notificaciones)
- **Infraestructura:** Docker y Docker Compose
- **Servicios auxiliares:** Binarios en Rust ([r-backups](https://github.com/HormigaDev/r-backups) para gestión de base de datos y [r-perms](https://github.com/HormigaDev/r-perms) para permisos)

## Instalación

### 1. Requisitos

- Docker instalado.
- Servicio de base de datos PostgreSQL.
- Servicio de Redis.
- Servicio [r-filestorage](https://github.com/HormigaDev/r-filestorage) (opcional si ajusta el módulo `src/modules/attchments`).

### 2. Configuración de archivos

Copie y renombre los archivos de entorno y configuración:

```bash
cp .env.template .env
cp .docker/.env.template .env
cp r-backups.json.template r-backups.json
```

Edite los archivos `.env` y `r-backups.json` según su entorno.

### 3. Levantar los servicios con Docker

```bash
cd .docker/
docker compose up -d
```

### 4. Crear la base de datos

Puede hacerlo manualmente ejecutando los siguientes archivos en orden desde `src/database/`:

1. `types.sql` - Tipos personalizados.
2. `init.sql` - Tablas principales.
3. `functions.sql` - Funciones SQL (si existen nuevas funciones debe ejecutarlo antes que triggers).
4. `triggers.sql` - Triggers para actualizar columnas `created_at` y `updated_at`.
5. `indexs.sql` - Índices para optimizar las consultas.

O puede usar el binario incluido en el proyecto:

```bash
docker exec -it app-tasks-api bash
npm run db:create
```

Este comando ejecutará los archivos en el orden correcto.

### 5. Ejecutar el proyecto en modo desarrollo

```bash
docker exec -it app-tasks-api bash
npm ci
npm run dev
```

### 6. Cambiar la contraseña del usuario admin

Genere un hash seguro:

```bash
npm run gen:pass SuContraseñaSegura@123
```

Actualice la contraseña en la base de datos:

```sql
update users
set password = '<hash>' -- Reemplace <hash> con el hash generado
where id = 1;
```

### 7. Verificar el funcionamiento

Acceda a la URL configurada en `.docker/.env` en `APP_PORT`, por ejemplo:

```
http://localhost:3000
```

Debería ver un JSON con el estado de la API, nombre y versión.

### 8. Obtener un token de autenticación (si usa Bearer)

Haga una petición POST a:

```
/auth/login
```

Con el siguiente JSON:

```json
{
    "email": "admin@admin.com",
    "password": "ContraseñaSegura@123"
}
```

Respuesta esperada:

```json
{
    "token": "JWT_TOKEN"
}
```

Use este token en la cabecera HTTP `Authorization` para consumir la API.

## Documentación

La documentación está disponible en la URL `/docs` con especificación OpenAPI (Swagger) cuando el proyecto está en ejecución.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más información.

## Contribuciones

Las contribuciones son bienvenidas. Puedes abrir issues para reportar errores o sugerir mejoras, así como enviar pull requests con nuevas funcionalidades, mejoras en la documentación o correcciones. Por favor, asegúrate de seguir las buenas prácticas de desarrollo y mantener la coherencia del código.

## Contacto

Para dudas, sugerencias o cualquier consulta relacionada con este proyecto, puedes contactarme en: **hormigadev7@gmail.com**
