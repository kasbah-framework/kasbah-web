create table node (
    id uuid not null default md5(random()::text || clock_timestamp()::text)::uuid unique,
    parent_id uuid references node ( id ),
    alias varchar(256) not null,
    type varchar(256) not null default 'Kasbah.Core.ContentBroker.Models.EmptyItem, Kasbah.Core.ContentBroker',

    constraint uq_alias unique ( parent_id, alias )
);

create table node_version (
    id uuid not null default md5(random()::text || clock_timestamp()::text)::uuid unique,

    node_id uuid not null references node ( id ),

    created_at timestamp not null default (now() at time zone 'utc'),
    modified_at timestamp not null default (now() at time zone 'utc'),

    "data" jsonb
);

alter table node add active_version_id uuid references node_version ( id ) on delete cascade;
