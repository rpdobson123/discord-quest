exports.up = function(knex, Promise) {
  return knex.schema.raw(`
      CREATE TABLE descriptors (
        id SERIAL NOT NULL PRIMARY KEY,
        entity text,
        entity_id int4,
        detail_level int4,
        key text,
        template text,
        limited_keys text[],
        name text
      );
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP TABLE descriptors;`);
};
