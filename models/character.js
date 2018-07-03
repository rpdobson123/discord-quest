const _ = require("lodash");
const User = require("./user.js");
const Descriptor = require("./descriptors.js");
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL
});

const Character = {
  name: "character",
  async getBy(value, key = "id") {
    const validColumns = {
      id: "id",
      user_id: "user_id",
      name: "name"
    };

    const result = (await knex("characters")
      .select("*")
      .where(validColumns[key], value))[0];

    return _.mapKeys(result, (value, key) => {
      return _.camelCase(key);
    });
  },

  async findOrCreate(characterName, author) {
    const character = await this.getBy(characterName, "name");
    const user = await User.getBy(author, "author");
    if (!character.id) {
      return await this.create(
        characterName[0].toUpperCase() + characterName.substr(1),
        author
      );
    } else {
      if (user.id === character.userId) {
        return character;
      } else {
        author.send(
          `Sorry - that character already belongs to ${User.username}!`
        );
        return;
      }
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

  async describe(character, level = 2) {
    if (!character) {
      return ` is noone. They have never existed.`;
    }

    return Descriptor.getByIdAndRender(character.id, this, level);
  },

  activity(name) {
    //TODO: track activity
  }
};
module.exports = Character;
