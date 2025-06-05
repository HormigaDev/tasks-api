<img src="./assets/banner.png">

# Oh My TASK API

API leve para gerenciamento de tarefas (TO-DO), projetada como uma base flexível para desenvolver aplicações de tarefas mais complexas.

## Índice

- [Dependências](#dependências)
- [Características principais](#características-principais)
- [Instalação](#instalação)
- [Documentação](#documentação)
- [Licença](#licença)
- [Contribuições](#contribuições)
- [Contato](#contato)

## Dependências

Este projeto utiliza duas dependências desenvolvidas em Rust, totalmente auditáveis:

- [R-BACKUPS – Gerenciador de banco de dados](https://github.com/HormigaDev/r-backups)
- [R-PERMS – Calculadora de permissões simples e rápida](https://github.com/HormigaDev/r-perms)

## Características principais

- Gerenciamento de usuários com estados definidos (Ativo, Inativo, Bloqueado, Excluído) e funções com permissões associadas.
- CRUD completo para tarefas, subtarefas, categorias, tags, marcos (milestones) e comentários.
- Controle de estados e prioridades para tarefas e subtarefas.
- Relações muitos-para-muitos entre tarefas/subtarefas e tags, comentários e arquivos anexados.
- Suporte para arquivos anexados com metadados, vinculados a tarefas e subtarefas.
- Sistema de notificações agendadas associadas às tarefas.
- Registro detalhado de histórico de ações para auditoria, com dados em JSON.
- Configuração de limites específicos por usuário, incluindo máximo de tarefas, tarefas por marco, tags, categorias, subtarefas por tarefa, comentários, marcos e armazenamento para anexos.

## Tecnologias Utilizadas

- **Backend:** NestJS, TypeORM, TypeScript
- **Banco de dados:** PostgreSQL
- **Cache:** Redis
- **Autenticação:** JWT e bcrypt para hash de senhas
- **Armazenamento de arquivos:** Comunicação via gRPC com um serviço em Rust ([r-filestorage](https://github.com/HormigaDev/r-filestorage))
- **Permissões:** Sistema baseado em bitmask usando [r-perms](https://github.com/HormigaDev/r-perms) para o cálculo de permissões
- **Validação:** class-validator, class-transformer
- **Tempo real:** WebSockets usando socket.io (para comentários e notificações)
- **Infraestrutura:** Docker e Docker Compose
- **Serviços auxiliares:** Binários em Rust ([r-backups](https://github.com/HormigaDev/r-backups) para gerenciamento do banco de dados e [r-perms](https://github.com/HormigaDev/r-perms) para permissões)

## Instalação

### 1. Requisitos

- Docker instalado
- Banco de dados PostgreSQL
- Redis
- Serviço r-filestorage ([Repositório](https://github.com/HormigaDev/r-filestorage)) (Opcional, pode ajustar o módulo `src/modules/attchments` se desejar)

### 2. Copiar e configurar os arquivos `.env` e `r-backups.json`

```bash
cp .env.template .env
cp .docker/.env.template .env
cp r-backups.json.template r-backups.json
```

Configure corretamente as variáveis de ambiente.

### 3. Executar o Docker

```bash
cd .docker/
docker compose up -d
```

### 4. Criar o banco de dados

- Crie o banco manualmente usando os arquivos em `src/database/` na seguinte ordem:
    - `types.sql`
    - `init.sql`
    - `functions.sql`
    - `triggers.sql`
    - `indexs.sql`
- Ou use o binário incluso para criar o banco automaticamente:
    ```bash
    docker exec -it app-tasks-api bash
    npm run db:create
    ```

### 5. Executar em modo desenvolvimento

```bash
docker exec -it app-tasks-api bash
npm ci
npm run dev
```

### 6. Alterar o usuário

- Gere um hash de senha:

```bash
npm run gen:pass SuaSenhaSegura@123
```

- Atualize no banco:

```sql
update users
set password = '<hash>'
where id = 1;
```

### 7. Verificar se a API está funcionando

- Acesse `localhost` na porta configurada no `.docker/.env` (ex.: http://localhost:3000)

### 8. Obter um token (se configurado como 'bearer' no `.env`)

```json
{
    "email": "admin@admin.com",
    "password": "SuaSenhaSegura@123"
}
```

Resposta:

```json
{
    "token": "JWT_TOKEN"
}
```

Use este token no header `Authorization` para testar os endpoints.

## Documentação

- Acesse `/docs` para visualizar a documentação (Swagger/OpenAPI).

## Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais informações.

## Contribuições

Contribuições são bem-vindas! Relate bugs, sugira melhorias ou envie pull requests.

## Contato

Email: **hormigadev7@gmail.com**
