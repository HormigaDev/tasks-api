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
