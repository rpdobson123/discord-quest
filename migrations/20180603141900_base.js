exports.up = async function(knex, Promise) {
  await knex.schema.raw(`
    CREATE TABLE users (
      id SERIAL NOT NULL PRIMARY KEY,
      active_character_id int4,
      username text,
      last_action_at timestamptz default now()
    );
`);
  await knex.schema.raw(`
      CREATE TABLE characters (
        id SERIAL NOT NULL PRIMARY KEY,
        user_id int4,
        name text
      );
  `);

  await knex.schema.raw(`
    CREATE TABLE descriptors (
      id SERIAL NOT NULL PRIMARY KEY,
      entity text,
      entity_id int4,
      detail_level int4 default 1,
      key text,
      value text,
      helper_verb text,
      use_posessive boolean default true,
      use_pronoun boolean default true,
      use_key boolean default true,
      article text
    );
  `);
};

exports.down = async function(knex, Promise) {
  await knex.schema.raw(`DROP TABLE users;`);
  await knex.schema.raw(`DROP TABLE characters;`);
  await knex.schema.raw(`DROP TABLE descriptors;`);
};
