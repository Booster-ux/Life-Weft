-- ==============================================================================
-- LIFEWEFT — ADMIN ROLE, SYSTEM REPORTS, & SECURITY MIGRATION
-- Adds role column to profiles, RLS policies, admin helpers, & reports table
-- ==============================================================================

-- 1. ADD ROLE COLUMN TO PROFILES TABLE
do $$
begin
    if not exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' 
        and table_name = 'profiles' 
        and column_name = 'role'
    ) then
        alter table public.profiles 
        add column role text not null default 'user' check (role in ('user', 'admin'));
    end if;
end $$;

-- Index on role for fast permission lookups
create index if not exists idx_profiles_role on public.profiles(role);

-- 2. CREATE IS_ADMIN() SECURITY DEFINER FUNCTION
-- Securely checks if the currently authenticated caller has role = 'admin'
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
end;
$$ language plpgsql security definer stable;

-- 3. ROLE ELEVATION PROTECTION TRIGGER
-- Prevents regular users from modifying their own role column from the client
create or replace function public.prevent_role_elevation()
returns trigger as $$
begin
    -- If role is changing and caller is NOT an admin, reject the modification
    if (new.role is distinct from old.role) then
        if not public.is_admin() then
            -- Fallback check: if service_role is executing, allow
            if current_user <> 'service_role' and current_setting('request.jwt.claim.role', true) <> 'service_role' then
                new.role := old.role; -- Silently revert role change to prevent client spoofing
            end if;
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_prevent_role_elevation on public.profiles;
create trigger tr_prevent_role_elevation
    before update on public.profiles
    for each row
    execute function public.prevent_role_elevation();

-- 4. UPDATE PROFILES RLS POLICIES FOR ADMIN ACCESS
-- Drop previous policies to avoid conflicts
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;

-- Normal users can view their own profile; Admins can view all user profiles
create policy "profiles_select_own_or_admin" on public.profiles
    for select using (auth.uid() = id or public.is_admin());

-- Users can update their own profile; Admins can update any profile
create policy "profiles_update_own_or_admin" on public.profiles
    for update using (auth.uid() = id or public.is_admin())
    with check (auth.uid() = id or public.is_admin());

-- 5. CREATE SYSTEM REPORTS & FEEDBACK TABLE
create table if not exists public.system_reports (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    title text not null,
    description text not null,
    category text default 'general' not null check (category in ('bug', 'feature', 'feedback', 'account', 'general')),
    status text default 'open' not null check (status in ('open', 'in_progress', 'resolved', 'closed')),
    priority text default 'normal' not null check (priority in ('low', 'normal', 'high', 'urgent')),
    admin_notes text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Index for reports
create index if not exists idx_system_reports_user_id on public.system_reports(user_id);
create index if not exists idx_system_reports_status on public.system_reports(status);
create index if not exists idx_system_reports_category on public.system_reports(category);
create index if not exists idx_system_reports_created_at on public.system_reports(created_at desc);

-- Enable RLS on system_reports
alter table public.system_reports enable row level security;

drop policy if exists "system_reports_select" on public.system_reports;
drop policy if exists "system_reports_insert" on public.system_reports;
drop policy if exists "system_reports_update" on public.system_reports;
drop policy if exists "system_reports_delete" on public.system_reports;

-- Users can view their own reports; Admins can view all reports
create policy "system_reports_select" on public.system_reports
    for select using (auth.uid() = user_id or public.is_admin());

-- Any authenticated user can submit a report
create policy "system_reports_insert" on public.system_reports
    for insert with check (auth.uid() = user_id or auth.uid() is not null);

-- Only admins can update reports (change status, add notes) or author can update their open report
create policy "system_reports_update" on public.system_reports
    for update using (public.is_admin() or (auth.uid() = user_id and status = 'open'))
    with check (public.is_admin() or (auth.uid() = user_id and status = 'open'));

-- Only admins can delete reports
create policy "system_reports_delete" on public.system_reports
    for delete using (public.is_admin());

-- 6. CREATE ADMIN AUDIT LOGS TABLE
create table if not exists public.admin_audit_logs (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid not null references auth.users(id) on delete cascade,
    action text not null,
    target_resource text not null,
    target_id text,
    details jsonb default '{}'::jsonb,
    ip_address text,
    created_at timestamptz default now() not null
);

create index if not exists idx_admin_audit_logs_admin_id on public.admin_audit_logs(admin_id);
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs(created_at desc);

alter table public.admin_audit_logs enable row level security;

-- Only admins can view audit logs
create policy "admin_audit_logs_select" on public.admin_audit_logs
    for select using (public.is_admin());

-- Only admins can insert audit logs
create policy "admin_audit_logs_insert" on public.admin_audit_logs
    for insert with check (public.is_admin() and auth.uid() = admin_id);
