const client = new Discord.Client();
const Discord = require("discord.js");
const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ["knex", "public"]
});

client.on("ready", () => {
  console.log("Ready!");
});

client.on("");
client.on("message", message => {
  console.log(message.content);
});

// Create an event listener for new guild members
client.on("guildMemberAdd", member => {
  channel.send(`Welcome to the server, ${member}`);
});
client.login(process.env.DISCORD_TOKEN);
