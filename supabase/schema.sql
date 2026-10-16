-- 在 Supabase 控制台 → SQL Editor 中整段运行一次

create table public.cards (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  uid text not null,
  phrase text not null,
  meaning text not null,
  example text not null default '',
  scene text not null default '',
  note text not null default '',
  created_at bigint not null,
  ease double precision not null,
  interval_days integer not null,
  due text not null,
  reps integer not null,
  lapses integer not null,
  introduced smallint not null,
  introduced_on text not null default '',
  deleted smallint not null default 0,
  updated_at bigint not null,
  server_at timestamptz not null default now(),
  primary key (user_id, uid)
);

create table public.logs (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  uid text not null,
  card_uid text not null,
  day text not null,
  rating smallint not null,
  at bigint not null,
  server_at timestamptz not null default now(),
  primary key (user_id, uid)
);

create index cards_pull_idx on public.cards (user_id, server_at);
create index logs_pull_idx on public.logs (user_id, server_at);

-- 每次写入由服务端打时间戳，作为各设备拉取增量的游标（不依赖设备时钟）
create function public.set_server_at() returns trigger
language plpgsql as $$
begin
  new.server_at = now();
  return new;
end;
$$;

create trigger cards_server_at before insert or update on public.cards
  for each row execute function public.set_server_at();
create trigger logs_server_at before insert or update on public.logs
  for each row execute function public.set_server_at();

-- 仅向已登录用户开放这两张表（项目创建时未勾选“自动暴露新表”，所以需要显式授权）
grant select, insert, update, delete on public.cards, public.logs to authenticated;

-- 行级安全：只能读写自己的数据
alter table public.cards enable row level security;
alter table public.logs enable row level security;

create policy "own cards" on public.cards for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own logs" on public.logs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
