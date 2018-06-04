exports.up = function(knex, Promise) {
  return knex.schema.raw(`
      CREATE TABLE characters (
        id SERIAL NOT NULL PRIMARY KEY,
        user_id int4,
        name text
      );
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`DROP TABLE characters;`);
};
