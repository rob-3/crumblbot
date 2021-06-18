const nacl = require("tweetnacl");
const axios = require("axios");
const Discord = require("discord.js");

const PUBLIC_KEY =
  "ed1c4e1eb883faf4e47c3602de8943aef915cdc1e67ecc415815241d38f29a05";

//const APPLICATION_ID = "844757716344897548";

exports.handler = async (event, context) => {
  console.log(`CrumblBot woke up at: ${Date()}`);
  // validate request
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = JSON.parse(event.body);
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + event.body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    console.log("invalid sig, sent back a 401");
    return {
      statusCode: 401,
      body: "Invalid signature!",
    };
  }
  if (body.type === 1) {
    console.log("body type was 1, ok");
    // authorize discord endpoint
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 1, // reply to registration ping with a Pong
      }),
    };
  } else {
    const cookiesData = await axios
      .get(
        "https://crumbl.azurewebsites.net/api/fetchcrumblspecials?code=Xvd37SKFCnS8KyfIDGfVOXa9SPDwJVb9Chp6UQX1ZN5ViAl0JLxYwA=="
      )
      .then((response) => response.data);

    // update the response once we have the data
    /*
    axios.patch(
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
    */
    // send back cookies!
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: 4,
        data: {
          content: "Here are the weekly specialty cookies!",
          embeds: cookiesData.map((cookie) =>
            new Discord.MessageEmbed()
              .setTitle(cookie.name)
              .setDescription(cookie.description)
              .setThumbnail(cookie.image)
          ),
        },
      }),
    };
  }
};
