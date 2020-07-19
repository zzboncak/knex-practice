drop type if exists grocery;
create type grocery as enum (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

create table if not exists shopping_list (
    id integer primary key generated by default as identity,
    name text not null,
    price decimal(12,2) not null,
    date_added timestamp default now() not null,
    checked boolean default false,
    category grocery
);