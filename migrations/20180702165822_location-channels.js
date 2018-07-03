const _ = require("lodash");

exports.up = async function(knex, Promise) {
  await knex.schema.raw(`
    CREATE TABLE locations (
        id SERIAL NOT NULL PRIMARY KEY,
        channel_name text not null,
        volatile boolean default true,
        name text
    )
  `);
  await knex.schema.alterTable("characters", table => {
    table
      .integer("location_id")
      .notNull()
      .defaultTo(1);
  });

  await knex
    .insert({
      name: process.env.HUB_NAME,
      channel_name: _.kebabCase(process.env.HUB_NAME)
    })
    .into("locations");
  await knex
    .insert({
      entity: "location",
      entity_id: 1,
      detail_level: 1,
      key: process.env.HUB_NAME,
      adjective: process.env.HUB_ADJECTIVE,
      helper_verb: "is in",
      use_posessive: "FALSE",
      use_pronoun: "FALSE",
      use_key: "TRUE",
      article: "the"test breaking change
    })
    .into("descriptors");
};

exports.down = async function(knex, Promise) {
  await knex.schema.raw(`DROP TABLE locations;`);
  await knex.schema.alterTable("characters", table => {
    table.dropColumn("location_id");
  });
};
