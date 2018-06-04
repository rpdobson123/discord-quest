const _ = require("lodash");
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL
});

const User = {
  name: "user",
  async getBy(value, key = "id") {
    const validColumns = {
      id: "id",
      author: "username",
      activeCharacter: "active_character"
    };

    if (key === "author") {
      value = this.getUniqueIdentifier(value);
    }

    const result = await knex("users")
      .select("*")
      .where(validColumns[key], value);
    return _.mapKeys(result[0], (value, key) => {
      return _.camelCase(key);
    });
  },

  async create(author) {
    const user = await knex("users")
      .insert({
        username: this.getUniqueIdentifier(author)
      })
      .returning("*");
    return user[0];
  },

  async findOrCreate(author) {
    let user = await this.getBy(author, "author");
    if (!user.id) {
      user = await this.create(author);
    }
    return user;
  },

  async getActiveCharacter(author) {
    const username = this.getUniqueIdentifier(author);
    return (await knex("users")
      .select("characters.*")
      .join("characters", "characters.id", "users.active_character_id")
      .where("username", "=", username))[0];
  },

  setActiveCharacter(userId, characterId) {
    return knex("users")
      .update({ active_character_id: characterId })
      .where({ id: userId });
  },

  getUniqueIdentifier(author) {
    return `${author.username}-${author.discriminator}`;
  },

  activity(name) {
    //TODO: track activity
  }
};
module.exports = User;
