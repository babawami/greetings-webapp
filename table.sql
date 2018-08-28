create table users_greeted
(
    id serial primary key,
    names text not null,
    names_counter int not null
);