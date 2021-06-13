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
      const html = await fetch("https://crumblcookies.com").then((r) =>
        r.text()
      );
      const buildId = html.match(regex)[1];
      const data = await fetch(
        `https://crumblcookies.com/_next/data/${buildId}/index.json`
      ).then((blob) => blob.json());
      const cookies = data.pageProps.products.cookies;
      cookies
        .filter(
          (c) => c.name !== "Milk Chocolate Chip" && c.name !== "Chilled Sugar"
        )
        .forEach((cookie) => {
          const embed = new Discord.MessageEmbed()
            .setTitle(cookie.name)
            .setDescription(cookie.description)
            .setThumbnail(cookie.image);
          message.channel.send({ embeds: [embed] });
        });
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(process.env.DISCORD_KEY);
