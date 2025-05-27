create table if not exists user_status (
    id serial primary key,
    name varchar(100) unique not null
);

insert into user_status (id, name)
values
    (1, 'Activo'),
    (2, 'Inactivo'),
    (3, 'Bloqueado'),
    (4, 'Eliminado');

create table if not exists users (
    id serial primary key,
    email varchar(255) not null unique,
    name varchar(255) not null,
    password varchar(255) not null,
    status_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp,
    foreign key (status_id) references user_status (id)
);

create table if not exists roles (
    id serial primary key,
    name varchar(100) unique not null,
    permissions integer
);

create table if not exists user_roles (
    user_id integer not null,
    role_id integer not null,
    primary key (user_id, role_id),
    foreign key (user_id) references users (id),
    foreign key (role_id) references roles (id) on delete cascade    
);

create table if not exists categories (
    id serial primary key,
    name varchar(100) not null,
    icon varchar(50) not null,
    color varchar(7) not null default '#000000',
    user_id integer not null,
    foreign key (user_id) references users (id)
);

create table if not exists tags (
    id serial primary key,
    name varchar(100) not null,
    color varchar(7) not null default '#000000',
    user_id integer not null,
    foreign key (user_id) references users (id)
);

create table if not exists milestones (
    id serial primary key,
    title varchar(255) not null,
    description text,
    completed boolean default false,
    user_id integer not null,
    expected_date timestamp default CURRENT_TIMESTAMP,
    foreign key (user_id) references users (id)
);

create table if not exists task_status (
    id serial primary key,
    name varchar(100) unique not null
);

insert into task_status (id, name)
values
    (1, 'Pendiente'),
    (2, 'Completada'),
    (3, 'Cancelada');

create table if not exists priorities (
    id serial primary key,
    name varchar(100) unique not null
);

insert into priorities (id, name)
values
    (1, 'Baja'),
    (2, 'Normal'),
    (3, 'Alta'),
    (4, 'Urgente');

create table if not exists tasks (
    id serial primary key,
    title varchar(255) not null,
    description text,
    user_id integer not null,
    status_id integer not null,
    priority_id integer not null,
    category_id integer not null,
    milestone_id integer,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    foreign key (user_id) references users (id),
    foreign key (status_id) references task_status (id),
    foreign key (priority_id) references priorities (id),
    foreign key (category_id) references categories (id),
    foreign key (milestone_id) references milestones (id)
);

create table if not exists task_tags (
    task_id integer not null,
    tag_id integer not null,
    primary key (task_id, tag_id),
    foreign key (task_id) references tasks (id) on delete cascade,
    foreign key (tag_id) references tags (id)
);

create table if not exists subtasks (
    id serial primary key,
    task_id integer not null,
    title varchar(255) not null,
    description text,
    status_id integer not null,
    priority_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    foreign key (task_id) references tasks (id) on delete cascade,
    foreign key (status_id) references task_status (id),
    foreign key (priority_id) references priorities (id)
);

create table if not exists subtask_tags (
    subtask_id integer not null,
    tag_id integer not null,
    primary key (subtask_id, tag_id),
    foreign key (subtask_id) references subtasks (id) on delete cascade,
    foreign key (tag_id) references tags (id)
);

create table if not exists comments (
    id serial primary key,
    content text not null,
    edited boolean default false,
    user_id integer not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

create table if not exists task_comments (
    task_id integer not null,
    comment_id integer not null,
    primary key (task_id, comment_id),
    foreign key (task_id) references tasks (id) on delete cascade,
    foreign key (comment_id) references comments (id)
);

create table if not exists subtask_comments (
    subtask_id integer not null,
    comment_id integer not null,
    primary key (subtask_id, comment_id),
    foreign key (subtask_id) references subtasks (id) on delete cascade,
    foreign key (comment_id) references comments (id)
);

create table if not exists attachments (
    id serial primary key,
    name varchar(255) not null,
    type varchar(50) not null,
    attachment_size integer not null,
    file_url text not null,
    user_id integer not null,
    uploaded_at timestamp default CURRENT_TIMESTAMP,
    foreign key (user_id) references users (id)
);

create table if not exists task_attachments (
    task_id integer not null,
    attachment_id integer not null,
    primary key (task_id, attachment_id),
    foreign key (task_id) references tasks (id),
    foreign key (attachment_id) references attachments (id)
);

create table if not exists subtask_attachments (
    subtask_id integer not null,
    attachment_id integer not null,
    primary key (subtask_id, attachment_id),
    foreign key (subtask_id) references subtasks (id),
    foreign key (attachment_id) references attachments (id)
);

create table if not exists notifications (
    id serial primary key,
    title varchar(255) not null,
    task_id integer not null,
    scheduled_for timestamp not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    foreign key (task_id) references tasks (id) on delete cascade
);

create table if not exists history_logs (
    id serial primary key,
    history_action history_logs_action not null,
    details jsonb not null,
    user_id integer not null,
    foreign key (user_id) references users (id)
);

create table if not exists user_limits (
    id serial primary key,
    user_id integer not null,
    max_tasks integer default 1000,
    max_tasks_per_milestone integer default 30,
    max_tags integer default 30,
    max_categories integer default 10,
    max_task_comments integer default 100, -- TODO: Implementar
    max_subtask_comments integer default 100, -- TODO: Implementar
    max_comments integer default 5000,
    max_milestones_per_task integer default 50, -- TODO: Implementar
    max_milestones integer default 500,
    max_attachments_storage bigint default 104857600, -- 100MB
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    foreign key (user_id) references users (id)
);
