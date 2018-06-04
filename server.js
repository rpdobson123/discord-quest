const Character = new require("./models/character.js");
const User = new require("./models/user.js");
const Discord = require("discord.js");

const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log("Ready!");
});

client.on("guildMemberUpdate", async author => {
  const user = User.findOrCreate(user);
});

client.on("guildMemberAdd", async author => {
  sendMsg(`Welcome, welcome ${author.nick}!`);
  const user = User.create(user);
});

client.on("message", async message => {
  User.activity(message.author.nick);
  if (message.content[0] !== "/") {
    return;
  }

  const input = message.content.substring(1).split(" ");
  const author = message.author;
  const userRecord = await User.findOrCreate(author, "author");
  const characterRecord = await User.getActiveCharacter(author);

  try {
    switch (input[0]) {
      case "joinAs":
        const character = await Character.findOrCreate(input[1], author);
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
            `${author.username} switched to ${character.name}, ${description}`
          );
        }
        break;
      case "describeme":
        if (!characterRecord.id) {
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

const sendMsg = (msg, channel = client.channels.get("452935723515904033")) => {
  return channel.send(msg);
};
