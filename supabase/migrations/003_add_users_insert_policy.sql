alter table public.users enable row level security;

create policy "Allow public signup"
on public.users
for insert
to anon
with check (true);