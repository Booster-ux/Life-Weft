-- ==============================================================================
-- LIFEWEFT — INITIAL DATABASE SCHEMA MIGRATION
-- Tables, Constraints, Indexes, Triggers, RLS Policies, and Storage Setup
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- PROFILES (Maps 1:1 with auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    timezone text default 'UTC',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- LIFE AREAS (Personal, Work, Business, School, Family, Projects, Custom)
create table if not exists public.life_areas (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    icon text,
    color text default '#3B82F6',
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- LEDGERS (Personal, Work, Business, School, Startup Journey, Custom)
create table if not exists public.ledgers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    color text default '#3B82F6',
    icon text,
    is_default boolean default false not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- LEDGER ENTRIES (Chronological timeline entries)
create table if not exists public.ledger_entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    ledger_id uuid not null references public.ledgers(id) on delete cascade,
    life_area_id uuid references public.life_areas(id) on delete set null,
    title text not null,
    content text,
    entry_date timestamptz default now() not null,
    category text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- TASKS (Action items)
create table if not exists public.tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    status text default 'pending' not null,
    priority text default 'normal' not null,
    due_date timestamptz,
    completed_at timestamptz,
    life_area_id uuid references public.life_areas(id) on delete set null,
    time_window text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- DEADLINES (Milestones and target dates)
create table if not exists public.deadlines (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    due_at timestamptz not null,
    priority text default 'normal' not null,
    status text default 'pending' not null,
    life_area_id uuid references public.life_areas(id) on delete set null,
    related_task_id uuid references public.tasks(id) on delete set null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- PLANNER ITEMS (Structured focus sessions & schedule blocks)
create table if not exists public.planner_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    day_of_week text,
    start_at timestamptz,
    end_at timestamptz,
    time_window text,
    item_type text default 'work' not null,
    task_id uuid references public.tasks(id) on delete set null,
    life_area_id uuid references public.life_areas(id) on delete set null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- DECISIONS (Decision journal records)
create table if not exists public.decisions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    life_area_id uuid references public.life_areas(id) on delete set null,
    title text not null,
    situation text not null,
    options jsonb default '[]'::jsonb not null,
    chosen_option text,
    reason text,
    expected_outcome text,
    actual_outcome text,
    status text default 'Under Consideration' not null,
    decision_date timestamptz default now() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- KNOWLEDGE ITEMS (Notes, references, saved items)
create table if not exists public.knowledge_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    life_area_id uuid references public.life_areas(id) on delete set null,
    title text not null,
    content text not null,
    source_url text,
    category text default 'Notes' not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- TAGS
create table if not exists public.tags (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    created_at timestamptz default now() not null,
    unique(user_id, name)
);

-- TASK_TAGS (Join table)
create table if not exists public.task_tags (
    task_id uuid not null references public.tasks(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    primary key (task_id, tag_id)
);

-- LEDGER_ENTRY_TAGS (Join table)
create table if not exists public.ledger_entry_tags (
    ledger_entry_id uuid not null references public.ledger_entries(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    primary key (ledger_entry_id, tag_id)
);

-- AI CONVERSATIONS
create table if not exists public.ai_conversations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- AI MESSAGES
create table if not exists public.ai_messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null,
    content text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================

create index if not exists idx_profiles_id on public.profiles(id);
create index if not exists idx_life_areas_user on public.life_areas(user_id);
create index if not exists idx_ledgers_user on public.ledgers(user_id);
create index if not exists idx_ledger_entries_user on public.ledger_entries(user_id);
create index if not exists idx_ledger_entries_ledger on public.ledger_entries(ledger_id);
create index if not exists idx_ledger_entries_entry_date on public.ledger_entries(entry_date desc);
create index if not exists idx_ledger_entries_life_area on public.ledger_entries(life_area_id);
create index if not exists idx_tasks_user on public.tasks(user_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_tasks_life_area on public.tasks(life_area_id);
create index if not exists idx_deadlines_user on public.deadlines(user_id);
create index if not exists idx_deadlines_due_at on public.deadlines(due_at);
create index if not exists idx_deadlines_life_area on public.deadlines(life_area_id);
create index if not exists idx_planner_items_user on public.planner_items(user_id);
create index if not exists idx_planner_items_day on public.planner_items(day_of_week);
create index if not exists idx_decisions_user on public.decisions(user_id);
create index if not exists idx_decisions_life_area on public.decisions(life_area_id);
create index if not exists idx_knowledge_items_user on public.knowledge_items(user_id);
create index if not exists idx_knowledge_items_category on public.knowledge_items(category);
create index if not exists idx_knowledge_items_life_area on public.knowledge_items(life_area_id);
create index if not exists idx_tags_user on public.tags(user_id);
create index if not exists idx_ai_conversations_user on public.ai_conversations(user_id);
create index if not exists idx_ai_messages_conversation on public.ai_messages(conversation_id);

-- ==============================================================================
-- 4. AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- ==============================================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger tr_life_areas_updated_at before update on public.life_areas for each row execute function public.handle_updated_at();
create trigger tr_ledgers_updated_at before update on public.ledgers for each row execute function public.handle_updated_at();
create trigger tr_ledger_entries_updated_at before update on public.ledger_entries for each row execute function public.handle_updated_at();
create trigger tr_tasks_updated_at before update on public.tasks for each row execute function public.handle_updated_at();
create trigger tr_deadlines_updated_at before update on public.deadlines for each row execute function public.handle_updated_at();
create trigger tr_planner_items_updated_at before update on public.planner_items for each row execute function public.handle_updated_at();
create trigger tr_decisions_updated_at before update on public.decisions for each row execute function public.handle_updated_at();
create trigger tr_knowledge_items_updated_at before update on public.knowledge_items for each row execute function public.handle_updated_at();
create trigger tr_ai_conversations_updated_at before update on public.ai_conversations for each row execute function public.handle_updated_at();

-- ==============================================================================
-- 5. NEW USER SIGNUP TRIGGER (Profile & Default Life Areas/Ledgers)
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
    v_full_name text;
begin
    -- Derive display name from metadata or email
    v_full_name := coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    -- 1. Create Profile
    insert into public.profiles (id, full_name, avatar_url, timezone)
    values (new.id, v_full_name, new.raw_user_meta_data->>'avatar_url', 'UTC')
    on conflict (id) do nothing;

    -- 2. Create Default Life Areas
    insert into public.life_areas (user_id, name, description, color, icon)
    values
        (new.id, 'Personal', 'Personal life, wellbeing, and habits', '#3B82F6', 'User'),
        (new.id, 'Work', 'Professional responsibilities and deliverables', '#2563EB', 'Briefcase'),
        (new.id, 'Business', 'Ventures, strategy, and investments', '#D4A72C', 'Building'),
        (new.id, 'School', 'Courses, learning, and academic milestones', '#10B981', 'GraduationCap')
    on conflict do nothing;

    -- 3. Create Default Ledgers
    insert into public.ledgers (user_id, name, description, color, is_default, icon)
    values
        (new.id, 'Personal', 'General life diary and personal chronicle', '#3B82F6', true, 'BookOpen'),
        (new.id, 'Work', 'Work log, team updates, and key wins', '#2563EB', false, 'Briefcase'),
        (new.id, 'Business', 'Startup milestones, client meetings, and strategy', '#D4A72C', false, 'Building'),
        (new.id, 'School', 'Academic sessions, research notes, and lectures', '#10B981', false, 'GraduationCap')
    on conflict do nothing;

    return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all user-owned tables
alter table public.profiles enable row level security;
alter table public.life_areas enable row level security;
alter table public.ledgers enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.tasks enable row level security;
alter table public.deadlines enable row level security;
alter table public.planner_items enable row level security;
alter table public.decisions enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.tags enable row level security;
alter table public.task_tags enable row level security;
alter table public.ledger_entry_tags enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

-- PROFILES Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- LIFE AREAS Policies
create policy "life_areas_select_own" on public.life_areas for select using (auth.uid() = user_id);
create policy "life_areas_insert_own" on public.life_areas for insert with check (auth.uid() = user_id);
create policy "life_areas_update_own" on public.life_areas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "life_areas_delete_own" on public.life_areas for delete using (auth.uid() = user_id);

-- LEDGERS Policies
create policy "ledgers_select_own" on public.ledgers for select using (auth.uid() = user_id);
create policy "ledgers_insert_own" on public.ledgers for insert with check (auth.uid() = user_id);
create policy "ledgers_update_own" on public.ledgers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ledgers_delete_own" on public.ledgers for delete using (auth.uid() = user_id);

-- LEDGER ENTRIES Policies
create policy "ledger_entries_select_own" on public.ledger_entries for select using (auth.uid() = user_id);
create policy "ledger_entries_insert_own" on public.ledger_entries for insert with check (auth.uid() = user_id);
create policy "ledger_entries_update_own" on public.ledger_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ledger_entries_delete_own" on public.ledger_entries for delete using (auth.uid() = user_id);

-- TASKS Policies
create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

-- DEADLINES Policies
create policy "deadlines_select_own" on public.deadlines for select using (auth.uid() = user_id);
create policy "deadlines_insert_own" on public.deadlines for insert with check (auth.uid() = user_id);
create policy "deadlines_update_own" on public.deadlines for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "deadlines_delete_own" on public.deadlines for delete using (auth.uid() = user_id);

-- PLANNER ITEMS Policies
create policy "planner_items_select_own" on public.planner_items for select using (auth.uid() = user_id);
create policy "planner_items_insert_own" on public.planner_items for insert with check (auth.uid() = user_id);
create policy "planner_items_update_own" on public.planner_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "planner_items_delete_own" on public.planner_items for delete using (auth.uid() = user_id);

-- DECISIONS Policies
create policy "decisions_select_own" on public.decisions for select using (auth.uid() = user_id);
create policy "decisions_insert_own" on public.decisions for insert with check (auth.uid() = user_id);
create policy "decisions_update_own" on public.decisions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "decisions_delete_own" on public.decisions for delete using (auth.uid() = user_id);

-- KNOWLEDGE ITEMS Policies
create policy "knowledge_items_select_own" on public.knowledge_items for select using (auth.uid() = user_id);
create policy "knowledge_items_insert_own" on public.knowledge_items for insert with check (auth.uid() = user_id);
create policy "knowledge_items_update_own" on public.knowledge_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "knowledge_items_delete_own" on public.knowledge_items for delete using (auth.uid() = user_id);

-- TAGS Policies
create policy "tags_select_own" on public.tags for select using (auth.uid() = user_id);
create policy "tags_insert_own" on public.tags for insert with check (auth.uid() = user_id);
create policy "tags_update_own" on public.tags for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags_delete_own" on public.tags for delete using (auth.uid() = user_id);

-- TASK_TAGS Policies (Verifies parent task ownership)
create policy "task_tags_select_own" on public.task_tags for select
    using (exists (select 1 from public.tasks where id = task_id and user_id = auth.uid()));

create policy "task_tags_insert_own" on public.task_tags for insert
    with check (
        exists (select 1 from public.tasks where id = task_id and user_id = auth.uid())
        and exists (select 1 from public.tags where id = tag_id and user_id = auth.uid())
    );

create policy "task_tags_delete_own" on public.task_tags for delete
    using (exists (select 1 from public.tasks where id = task_id and user_id = auth.uid()));

-- LEDGER_ENTRY_TAGS Policies (Verifies parent ledger entry ownership)
create policy "ledger_entry_tags_select_own" on public.ledger_entry_tags for select
    using (exists (select 1 from public.ledger_entries where id = ledger_entry_id and user_id = auth.uid()));

create policy "ledger_entry_tags_insert_own" on public.ledger_entry_tags for insert
    with check (
        exists (select 1 from public.ledger_entries where id = ledger_entry_id and user_id = auth.uid())
        and exists (select 1 from public.tags where id = tag_id and user_id = auth.uid())
    );

create policy "ledger_entry_tags_delete_own" on public.ledger_entry_tags for delete
    using (exists (select 1 from public.ledger_entries where id = ledger_entry_id and user_id = auth.uid()));

-- AI CONVERSATIONS Policies
create policy "ai_conversations_select_own" on public.ai_conversations for select using (auth.uid() = user_id);
create policy "ai_conversations_insert_own" on public.ai_conversations for insert with check (auth.uid() = user_id);
create policy "ai_conversations_update_own" on public.ai_conversations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_conversations_delete_own" on public.ai_conversations for delete using (auth.uid() = user_id);

-- AI MESSAGES Policies
create policy "ai_messages_select_own" on public.ai_messages for select using (auth.uid() = user_id);
create policy "ai_messages_insert_own" on public.ai_messages for insert with check (auth.uid() = user_id);
create policy "ai_messages_delete_own" on public.ai_messages for delete using (auth.uid() = user_id);

-- ==============================================================================
-- 7. SUPABASE STORAGE (Private 'user-files' Bucket & Policies)
-- ==============================================================================

insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

create policy "storage_user_files_select" on storage.objects
    for select using (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage_user_files_insert" on storage.objects
    for insert with check (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage_user_files_update" on storage.objects
    for update using (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage_user_files_delete" on storage.objects
    for delete using (bucket_id = 'user-files' and auth.uid()::text = (storage.foldername(name))[1]);
