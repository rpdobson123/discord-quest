exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    CREATE TABLE users (
      id SERIAL NOT NULL PRIMARY KEY,
      active_character_id int4,
      username text,
      last_action_at timestamptz default now()
    );
`);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP TABLE users;`);
};
