do $$
    begin
        if not exists (
            select 1 from pg_type where typname = 'history_logs_action'
        ) then
            create type history_logs_action as enum ('insert', 'update', 'delete');
        end if;
    end
$$;