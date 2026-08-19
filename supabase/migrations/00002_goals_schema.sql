-- ==============================================================================
-- LIFEWEFT — GOALS SYSTEM SCHEMA MIGRATION
-- Table, Constraints, Indexes, Foreign Keys, and Row Level Security (RLS)
-- ==============================================================================

-- 1. CREATE GOALS TABLE
create table if not exists public.goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    parent_goal_id uuid references public.goals(id) on delete cascade,
    title text not null,
    description text,
    goal_type text not null default 'yearly' check (goal_type in ('yearly', 'quarterly', 'monthly', 'weekly', 'daily', 'custom')),
    period text, -- e.g. "2026", "Q1 2026", "January 2026", "Week 32", "2026-08-19"
    status text not null default 'active' check (status in ('active', 'completed', 'paused', 'archived')),
    start_date date,
    target_date date,
    progress integer default 0 check (progress >= 0 and progress <= 100),
    life_area_id uuid references public.life_areas(id) on delete set null,
    measurable_target text,
    notes text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,

    -- Prevent self-referencing hierarchy
    constraint goals_no_self_parent check (id <> parent_goal_id)
);

-- 2. LINK EXISTING TABLES TO GOALS
do $$
begin
    -- Link Tasks to Goals
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'tasks' and column_name = 'goal_id') then
        alter table public.tasks add column goal_id uuid references public.goals(id) on delete set null;
    end if;

    -- Link Deadlines to Goals
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'deadlines' and column_name = 'goal_id') then
        alter table public.deadlines add column goal_id uuid references public.goals(id) on delete set null;
    end if;

    -- Link Planner Items to Goals
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'planner_items' and column_name = 'goal_id') then
        alter table public.planner_items add column goal_id uuid references public.goals(id) on delete set null;
    end if;

    -- Link Ledger Entries to Goals
    if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'ledger_entries' and column_name = 'related_goal_id') then
        alter table public.ledger_entries add column related_goal_id uuid references public.goals(id) on delete set null;
    end if;
end $$;

-- 3. CREATE INDEXES FOR FAST FILTERING & HIERARCHY TRAVERSAL
create index if not exists idx_goals_user_id on public.goals(user_id);
create index if not exists idx_goals_parent_id on public.goals(parent_goal_id);
create index if not exists idx_goals_type on public.goals(goal_type);
create index if not exists idx_goals_status on public.goals(status);
create index if not exists idx_goals_target_date on public.goals(target_date);
create index if not exists idx_goals_life_area_id on public.goals(life_area_id);
create index if not exists idx_tasks_goal_id on public.tasks(goal_id);
create index if not exists idx_deadlines_goal_id on public.deadlines(goal_id);
create index if not exists idx_planner_goal_id on public.planner_items(goal_id);
create index if not exists idx_ledger_entries_goal_id on public.ledger_entries(related_goal_id);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.goals enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view own goals" on public.goals;
drop policy if exists "Users can insert own goals" on public.goals;
drop policy if exists "Users can update own goals" on public.goals;
drop policy if exists "Users can delete own goals" on public.goals;

-- 5. DEFINE STRICT RLS POLICIES
create policy "Users can view own goals"
    on public.goals for select
    using (auth.uid() = user_id);

create policy "Users can insert own goals"
    on public.goals for insert
    with check (
        auth.uid() = user_id
        and (
            parent_goal_id is null
            or exists (
                select 1 from public.goals g
                where g.id = parent_goal_id
                and g.user_id = auth.uid()
            )
        )
    );

create policy "Users can update own goals"
    on public.goals for update
    using (auth.uid() = user_id)
    with check (
        auth.uid() = user_id
        and (
            parent_goal_id is null
            or exists (
                select 1 from public.goals g
                where g.id = parent_goal_id
                and g.user_id = auth.uid()
            )
        )
    );

create policy "Users can delete own goals"
    on public.goals for delete
    using (auth.uid() = user_id);

-- 6. UPDATED_AT TRIGGER
create or replace function public.set_goals_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_set_goals_updated_at on public.goals;
create trigger trigger_set_goals_updated_at
    before update on public.goals
    for each row
    execute function public.set_goals_updated_at();
