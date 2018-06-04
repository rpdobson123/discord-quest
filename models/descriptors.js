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
    return _.map(results, result => {
      _.mapKeys(results, result => {
        return _.camelCase(result.key);
      });
    });
  },

  async getByIdAndRender(entityId, entity, detailLevel = 2) {
    const results = _.map(
      await knex("descriptors")
        .select("*")
        .where({
          entity: entity.name,
          entity_id: entityId
        })
        .andWhere("detail_level", "<=", detailLevel),
      result => {
        return _.mapKeys(result, (value, key) => {
          return _.camelCase(key);
        });
      }
    );

    entityRecord = await entity.getBy(entityId, "id");
    const genderIndex = _.findKey(results, { key: "gender" });
    const gender = genderIndex && results[genderIndex].value;
    results.splice(genderIndex, 1);

    if (!results.length) {
      return detailLevel > 1 && entityRecord.name
        ? `, some entity who you know only by name.`
        : `, an entity entirely unknown to you.`;
    }
    const descriptions = _.map(results, (descriptor, key) => {
      const description = this.getDescription(
        entity.name,
        descriptor,
        gender,
        key
      );
      return `${description.join(" ")}`;
    });
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return `${descriptions[0]} and ${descriptions[1]}`;
      default:
        const last = descriptions.pop();
        return `${descriptions.join(". ")}, and ${last}`;
    }
  },

  getDescription(name, descriptor, gender, index) {
    const description = [];
    if (index !== 0 && descriptor.usePronoun) {
      if (gender === "male") {
        description.push(descriptor.usePosessive ? "he" : "his");
      } else if (gender === "female") {
        description.push(descriptor.usePosessive ? "she" : "her");
      } else if (name === "character") {
        descriptor.helperVerb =
          descriptor.helperVerb === "has" ? "have" : descriptor.helperVerb;
        description.push(descriptor.usePosessive ? "they" : "their");
      } else {
        description.push(descriptor.usePosessive ? "it" : "its");
      }
    }
    if (descriptor.helperVerb) {
      description.push(descriptor.helperVerb);
    }
    if (descriptor.article) {
      const nextWord = descriptor.value || descriptor.key;
      const letterIsVowel = _.includes(["a", "e", "i", "o", "u"], nextWord[0]);
      if (descriptor.article === "a" && letterIsVowel) {
        descriptor.article = "an";
      }
      description.push(descriptor.article);
    }
    if (descriptor.value) {
      description.push(descriptor.value);
    }
    if (descriptor.useKey) {
      description.push(descriptor.key);
    }
    return description;
  }
};

module.exports = Descriptors;
