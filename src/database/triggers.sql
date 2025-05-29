create or replace function update_updated_at_column()
returns trigger as $$
begin
    if old.* is distinct from new.* and old.updated_at is not distinct from new.updated_at then
        new.updated_at = now();
    end if;
    return new;
end;
$$ language plpgsql;


create trigger trigger_update_users_updated_at
before update on users
for each row
execute function update_updated_at_column();

create trigger trigger_update_tasks_updated_at
before update on tasks
for each row
execute function update_updated_at_column();

create trigger trigger_update_subtasks_updated_at
before update on subtasks
for each row
execute function update_updated_at_column();

create trigger trigger_update_roles_updated_at
before update on subtasks
for each row
execute function update_updated_at_column();

create trigger trigger_update_categories_updated_at
before update on categories
for each row
execute function update_updated_at_column();

create trigger trigger_update_tags_updated_at
before update on tags
for each row
execute function update_updated_at_column();

create trigger trigger_update_milestones_updated_at
before update on milestones
for each row
execute function update_updated_at_column();

create trigger trigger_update_comments_updated_at
before update on comments
for each row
execute function update_updated_at_column();