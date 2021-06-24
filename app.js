const axios = require("axios");
const Discord = require("discord.js");

const APPLICATION_ID = "844757716344897548";

const fetchCookiesData = async () => {
  const response = await axios.get(
    "https://jpswqfm3od.execute-api.us-east-1.amazonaws.com/default/crumbl-api"
  );

  console.log(response.data);
  return response.data;
};

exports.handler = async (event, context) => {
  console.log(`CrumblBot woke up at: ${Date()}`);

  const body = JSON.parse(event.body);

  console.log(body);

  const cookiesData = await fetchCookiesData();

  // update the response
  await axios.patch(
    `https://discord.com/api/v8/webhooks/${APPLICATION_ID}/${body.token}/messages/@original`,
    {
      content: "Here are the weekly specialty cookies!",
      embeds: cookiesData.map((cookie) =>
        new Discord.MessageEmbed()
          .setTitle(cookie.name)
          .setDescription(cookie.description)
          .setThumbnail(cookie.image)
      ),
    }
  );
};
