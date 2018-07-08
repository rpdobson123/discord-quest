const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL
});
const Character = new require("./models/character.js");
const User = new require("./models/user.js");
const Discord = require("discord.js");
const Promise = require("bluebird");
const _ = require("lodash");
const client = new Discord.Client();
let generalChannel;
client.login(process.env.DISCORD_TOKEN);

client.on("ready", async () => {
  console.log("Ready!");
  await createAppropriateChannels();
  if (process.env.ENV === "Test") {
    sendMsg("The server just redeployed - Hello!");
  }
});

// client.on("guildMemberUpdate", async author => {
//   // const user = User.findOrCreate(user);
// });

client.on("guildMemberAdd", async author => {
  sendMsg(`Welcome, welcome ${author.nick}!`);
  const user = User.create(user);
});

client.on("message", async message => {
  User.activity(message.author.nick);
  if (message.content[0] !== "/") {
    return;
  }
  const [command, ...args] = message.content.substr(1).split(" ");
  const author = message.author;
  const userRecord = await User.findOrCreate(author, "author");
  const characterRecord = await User.getActiveCharacter(author);

  try {
    switch (command) {
      case "help":
        sendMsg(`You can use the following commands:
          /describeMe - describe your character
          /viewquests
          /joinAs (character name)
        `);
        break;
      case "viewQuests":
      case "viewquests":
        sendMsg(`In progress....`);
        break;
      case "joinas":
      case "joinAs":
        const character = await Character.findOrCreate(args.join(" "), author);
        if (character) {
          await User.setActiveCharacter(userRecord.id, character.id);
          if (!message.member.hasPermission("ADMINISTRATOR")) {
            await message.member.setNickname(
              character.name,
              "Active Character"
            );
          }

          const description = await Character.describe(character);
          sendMsg(
            `${author.username} switched to ${
              character.name
            }, who ${description}`
          );
        }
        break;
      case "describeMe":
      case "describeme":
        if (!characterRecord) {
          sendMsg("You are not born yet. Type /joinAs {name}.", author);
        } else {
          sendMsg(
            `${characterRecord.name} ${await Character.describe(
              characterRecord
            )}`,
            message.channel
          );
        }
        break;
    }
  } catch (e) {
    sendMsg(`ERROR: ${e}`);
    throw e;
  }

  if (message.channel.type === "text") {
    message.delete();
  }
});

const onUserJoin = async author => {
  await User.create(author);
  sendMsg(`Welcome to the world, ${userName}!`);
};

const sendMsg = (msg, channel = generalChannel) => {
  return channel.send(msg);
};

const createAppropriateChannels = async () => {
  const results = await knex("locations")
    .select("channel_name")
    .where({ active: true });
  const channelNames = _.map(results, result => {
    return result.channel_name;
  });

  _.each(channelNames, channelName => {
    channel = client.channels.find("name", channelName);

    if (!channel) {
      client.guilds.first().createChannel(channelName, "text");
    }
  });

  generalChannel = client.channels.find(
    "name",
    process.env.GENERAL_CHANNEL_NAME
  );

  if (!generalChannel) {
    client.guilds
      .first()
      .createChannel(process.env.GENERAL_CHANNEL_NAME, "text");
    generalChannel = client.channels.find(
      "name",
      process.env.GENERAL_CHANNEL_NAME
    );
  }
};
