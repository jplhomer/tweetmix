drop table if exists users;
create table users (
  id integer primary key,
  name text,
  email text not null unique,
  username text not null unique,
  password text not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
);

drop table if exists tweets;
create table tweets (
  id integer primary key,
  user_id integer not null,
  text text not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp,
  foreign key (user_id) references users(id)
);
