const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const fetch = require("node-fetch");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.on("interaction", (interaction) => {
    console.log(interaction);
  });
});

const regex = /"buildId":"(.*?)"/;

client.on("message", async (message) => {
  try {
    if (message.content === "!crumbl") {
      message.channel.send({
        content:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-lqZLzifawhs%2FTzIi_iT7VRI%2FAAAAAAAAA3I%2F6qK3V38WkZI%2Fs1600%2FNo%2Bcookies%2Bfor%2Byou.jpg&f=1&nofb=1",
      });
      message.channel.send({
        content: `Hi! I'm switching to Discord's new slash commands so that I can sleep when I'm not being used! These constant all-nighters are really getting to me. I'm staying up for few more weeks to warn unsuspecting users, but this command will stop working entirely in the future.

**You can now summon me via the \`/crumbl\` slash command!**`,
      });
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(process.env.DISCORD_KEY);
