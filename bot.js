const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  if (message.content === "!crumbl") {
    fetch(
      "https://crumblcookies.com/_next/data/-KVpzWBj2HBHdCW7haOpO/index.json"
    )
      .then((blob) => blob.json())
      .then((data) => {
        const cookies = data.pageProps.products.cookies;
        console.log(cookies);
        cookies
          .filter(
            (c) =>
              c.name !== "Milk Chocolate Chip" && c.name !== "Chilled Sugar"
          )
          .forEach((cookie) => {
            const embed = new Discord.MessageEmbed()
              .setTitle(cookie.name)
              .setDescription(cookie.description)
              .setThumbnail(cookie.newImage);
            message.channel.send(embed);
          });
      })
      .catch((err) => console.error(err));
  }
});

client.login(process.env.DISCORD_KEY);
