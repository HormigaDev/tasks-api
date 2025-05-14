create index if not exists idx_tasks_user_id on tasks (user_id);
create index if not exists idx_tasks_status_id on tasks (status_id);
create index if not exists idx_tasks_category_id on tasks (category_id);
create index if not exists idx_tasks_priority_id on tasks (priority_id);
create index if not exists idx_subtasks_status_id on subtasks (status_id);