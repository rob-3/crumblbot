const nacl = require("tweetnacl");
const axios = require("axios");
const Discord = require("discord.js");

const PUBLIC_KEY =
  "ed1c4e1eb883faf4e47c3602de8943aef915cdc1e67ecc415815241d38f29a05";

module.exports = async (context, req) => {
  context.log(`CrumblBot woke up at: ${Date()}`);

  // validate request
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const body = req.rawBody;
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    context.res = {
      status: 401,
      body: "Invalid signature!",
    };
    return;
  }

  if (req.body.type === 1) {
    // authorize discord endpoint
    context.res = {
      status: 200,
      body: JSON.stringify({
        type: 1, // reply to registration ping with a Pong
      }),
    };
  } else {
    // send back cookies!
    // we need to send back a 200 immediately
    context.res = {
      status: 200,
    };
    const cookiesData = await axios
      .get(
        "https://crumbl.azurewebsites.net/api/fetchcrumblspecials?code=Xvd37SKFCnS8KyfIDGfVOXa9SPDwJVb9Chp6UQX1ZN5ViAl0JLxYwA=="
      )
      .then((response) => response.data);
    axios.post(
      `https://discord.com/api/v8/interactions/${req.body.id}/${req.body.token}/callback`,
      {
        type: 4,
        data: {
          content: "",
          embeds: cookiesData.map((cookie) =>
            new Discord.MessageEmbed()
              .setTitle(cookie.name)
              .setDescription(cookie.description)
              .setThumbnail(cookie.image)
          ),
        },
      }
    );
  }
};
