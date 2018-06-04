exports.up = function(knex, Promise) {
  return knex.schema.raw(`
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

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP TABLE descriptors;`);
};
