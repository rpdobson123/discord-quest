const _ = require("lodash");
const User = require("./user.js");
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL
});

const Location = {
  name: "location",

  async getBy(value, key = "id") {
    const validColumns = {
      id: "id",
      name: "name"
    };

    const result = (await knex("locations")
      .select("*")
      .where(validColumns[key], value))[0];

    return _.mapKeys(result, (value, key) => {
      return _.camelCase(key);
    });
  },

  async find(locationId, author) {
    const location = await this.getBy(characterName, "name");
    const user = await User.getBy(author, "author");
    if (!location.get("id")) {
      u;
    }
  },

  async create(name, author) {
    let user = await User.getBy(author, "author");
    const character = await knex("characters")
      .insert({
        name: name,
        user_id: user.id
      })
      .returning("*");
    return character[0];
  },

  get(value) {
    return this.getBy(value);
  },

  activity(name) {
    //TODO: track activity
  }
};
module.exports = Location;
