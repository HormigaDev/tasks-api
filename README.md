<img src="./assets/banner.png">

# Oh My TASK API

Lightweight task management API (TO-DO), designed as a flexible foundation for building more complex TODO applications.

## Languages

- [🇪🇸 Español](./docs/md/README_ES.md)
- [🇧🇷 Português](./docs/md/README_PT.md)

## Table of Contents

- [Main Features](#main-features)
- [Installation](#installation)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Main Features

- User management with defined statuses (Active, Inactive, Blocked, Deleted) and roles with associated permissions.
- Full CRUD for tasks, subtasks, categories, tags, milestones, and comments.
- Status and priority control for tasks and subtasks.
- Many-to-many relationships between tasks/subtasks and tags, comments, and attachments.
- Support for attachments with metadata, linked to tasks and subtasks.
- Scheduled notification system associated with tasks.
- Detailed history log for auditing with JSON data.
- User-specific limits configuration including max tasks, tasks per milestone, tags, categories, subtasks per task, comments, milestones, and attachment storage.

## Installation

### 1. Requirements

- Docker installed
- PostgreSQL database
- Redis service
- r-filestorage service ([Repository](https://github.com/HormigaDev/r-filestorage)) (Optional if you modify `src/modules/attchments` accordingly)

### 2. Copy and configure `.env` and `r-backups.json` files

```bash
cp .env.template .env
cp .docker/.env.template .env
cp r-backups.json.template r-backups.json
```

Configure all environment variables correctly.

### 3. Run the Docker image

```bash
cd .docker/
docker compose up -d
```

### 4. Create the database

- Manually create the database using the files in `src/database/` in the following order:
    - `types.sql`: Contains custom types required.
    - `init.sql`: Contains all tables used by the API.
    - `functions.sql`: Functions required by the database.
    - `triggers.sql`: Contains automatic update triggers for `created_at` and `updated_at` fields.
    - `indexs.sql`: Contains necessary indexes for performance.
- Alternatively, use the provided binary to set up the database automatically:
    - Ensure `r-backups.json` is configured based on `r-backups.json.template`.
    - Enter the active container:

```bash
docker exec -it app-tasks-api bash
```

- Run:

```bash
npm run db:create
```

### 5. Run the project in development mode

```bash
docker exec -it app-tasks-api bash
```

Then run:

```bash
npm ci
npm run dev
```

### 6. Change the default user password

Generate a password hash:

```bash
npm run gen:pass YourStrongPassword@123
```

Update the user in the database:

```sql
update users
set password = '<hash>' -- Replace <hash> with the generated hash
where id = 1;
```

### 7. Verify the API

Visit `localhost` at the port configured in `.docker/.env` (`APP_PORT`), e.g., https://localhost:3000. You will receive a JSON response with API status, name, and version.

### 8. Obtain a user TOKEN (If `AUTH_METHOD=bearer` in `.env`)

Send a `POST` request to `http://localhost/auth/login` with the following JSON body:

```json
{
    "email": "admin@admin.com",
    "password": "YourStrongPassword@123"
}
```

The response will return the token:

```json
{
    "token": "JWT_TOKEN"
}
```

Use this token in the `Authorization` header for all API requests.

## Documentation

Once the project is running in development mode, the documentation is available at `/docs` following the OpenAPI (Swagger) standard.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! You can open issues to report bugs or suggest improvements, and submit pull requests for new features, documentation updates, or fixes. Please follow best practices and maintain code consistency.

## Contact

For questions, suggestions, or any inquiries about this project, contact me at: **hormigadev7@gmail.com**
