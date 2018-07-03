exports.up = function(knex, Promise) {
  return knex.schema.alterTable("locations", table => {
    table.boolean("active").defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("locations", table => {
    table.dropColumn("active");
  });
};
