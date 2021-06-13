"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nacl = require("tweetnacl");
const axios = require("axios");
const Discord = require("discord.js");
const PUBLIC_KEY = "ed1c4e1eb883faf4e47c3602de8943aef915cdc1e67ecc415815241d38f29a05";
const APPLICATION_ID = "844757716344897548";
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`CrumblBot woke up at: ${Date()}`);
        // validate request
        const signature = req.headers["x-signature-ed25519"];
        const timestamp = req.headers["x-signature-timestamp"];
        const body = req.rawBody;
        const isVerified = nacl.sign.detached.verify(Buffer.from(timestamp + body), Buffer.from(signature, "hex"), Buffer.from(PUBLIC_KEY, "hex"));
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
                    type: 1,
                }),
            };
        }
        else {
            // send back cookies!
            // we need to send back a 200 immediately in case this is a slow start
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: 5,
                }),
            };
            const cookiesData = yield axios
                .get("https://crumbl.azurewebsites.net/api/fetchcrumblspecials?code=Xvd37SKFCnS8KyfIDGfVOXa9SPDwJVb9Chp6UQX1ZN5ViAl0JLxYwA==")
                .then((response) => response.data);
            // update the response once we have the data
            axios.patch(`https://discord.com/api/v8/webhooks/${APPLICATION_ID}/${req.body.token}/messages/@original`, {
                content: "Here are the weekly specialty cookies!",
                embeds: cookiesData.map((cookie) => new Discord.MessageEmbed()
                    .setTitle(cookie.name)
                    .setDescription(cookie.description)
                    .setThumbnail(cookie.image)),
            });
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map