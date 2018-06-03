// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
