exports.up = function(knex, Promise) {
  knex.raw(`
    CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username text,
        character_name text,
        last_action_at timestamp tz default now()
    );
  `);
};

exports.down = function(knex, Promise) {};
