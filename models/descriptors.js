const _ = require("lodash");
const User = require("./user");
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL
});

const Descriptors = {
  async getById(entityId, entity, detailLevel = 2) {
    const results = await knex("descriptors")
      .select("*")
      .where({
        entity: entity.name,
        entity_id: entityId
      })
      .andWhere("detail_level", "<=", detailLevel);
    return _.mapKeys(results, (value, key) => {
      return _.camelCase(key);
    });
  },

  async getByIdAndRender(entityId, entity, detailLevel = 2) {
    const results = await knex("descriptors")
      .select("*")
      .where({
        entity: entity.name,
        entity_id: entityId
      })
      .andWhere("detail_level", "<=", detailLevel);
    const records = _.map(results, result => {
      _.mapKeys(results, _.camelCase);
    });

    entityRecord = await entity.getBy(entityId, "id");
    if (!records.length) {
      return detailLevel > 1 && entityRecord.name
        ? `a being of an unknown nature`
        : `an entity entirely unknown to you.`;
    }
    return _.mapKeys(result[0], (value, key) => {
      return _.camelCase(key);
    });
  }
};

module.exports = Descriptors;
