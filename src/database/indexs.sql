create index if not exists idx_tasks_user_id on tasks (user_id);
create index if not exists idx_tasks_status_id on tasks (status_id);
create index if not exists idx_tasks_category_id on tasks (category_id);
create index if not exists idx_tasks_priority_id on tasks (priority_id);
create index if not exists idx_subtasks_status_id on subtasks (status_id);
create index if not exists idx_attachment_name on attachments (name);
create unique index if not exists idx_attachment_user_name_unique on attachments (name, user_id);

create index if not exists idx_users_status_id on users (status_id);

create index if not exists idx_user_roles_user_id on user_roles (user_id);
create index if not exists idx_user_roles_role_id on user_roles (role_id);

create index if not exists idx_categories_user_id on categories (user_id);

create index if not exists idx_tags_user_id on tags (user_id);

create index if not exists idx_task_tags_task_id on task_tags (task_id);
create index if not exists idx_task_tags_tag_id on task_tags (tag_id);

create index if not exists idx_task_milestones_task_id on task_milestones (task_id);
create index if not exists idx_task_milestones_milestone_id on task_milestones (milestone_id);

create index if not exists idx_subtasks_task_id on subtasks (task_id);
create index if not exists idx_subtasks_priority_id on subtasks (priority_id);

create index if not exists idx_subtask_tags_subtask_id on subtask_tags (subtask_id);
create index if not exists idx_subtask_tags_tag_id on subtask_tags (tag_id);

create index if not exists idx_subtask_milestones_subtask_id on subtask_milestones (subtask_id);
create index if not exists idx_subtask_milestones_milestone_id on subtask_milestones (milestone_id);

create index if not exists idx_comments_user_id on comments (user_id);

create index if not exists idx_task_comments_task_id on task_comments (task_id);
create index if not exists idx_task_comments_comment_id on task_comments (comment_id);

create index if not exists idx_subtask_comments_subtask_id on subtask_comments (subtask_id);
create index if not exists idx_subtask_comments_comment_id on subtask_comments (comment_id);

create index if not exists idx_attachments_user_id on attachments (user_id);

create index if not exists idx_task_attachments_task_id on task_attachments (task_id);
create index if not exists idx_task_attachments_attachment_id on task_attachments (attachment_id);

create index if not exists idx_subtask_attachments_subtask_id on subtask_attachments (subtask_id);
create index if not exists idx_subtask_attachments_attachment_id on subtask_attachments (attachment_id);

create index if not exists idx_notifications_task_id on notifications (task_id);

create index if not exists idx_history_logs_user_id on history_logs (user_id);
