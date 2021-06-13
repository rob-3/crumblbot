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
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`woke up at: ${Date()}`);
        // validate request
        context.log("0");
        const signature = req.headers["x-signature-ed25519"];
        context.log("1");
        const timestamp = req.headers["x-signature-timestamp"];
        context.log("a");
        const body = req.rawBody;
        const isVerified = nacl.sign.detached.verify(Buffer.from(timestamp + body), Buffer.from(signature, "hex"), Buffer.from(PUBLIC_KEY, "hex"));
        context.log("b");
        if (!isVerified) {
            context.res = {
                status: 401,
                body: "Invalid signature!",
            };
            context.log("c");
            return;
        }
        context.log("d");
        if (req.body.type === 1) {
            context.log("e");
            // authorize discord endpoint
            context.res = {
                status: 200,
                body: JSON.stringify({
                    type: 1,
                }),
            };
        }
        else {
            context.log("here");
            // send back cookies!
            // we need to send back a 200 immediately
            context.res = {
                status: 200,
            };
            context.log("there");
            const cookiesData = yield axios
                .get("https://crumbl.azurewebsites.net/api/fetchcrumblspecials?code=Xvd37SKFCnS8KyfIDGfVOXa9SPDwJVb9Chp6UQX1ZN5ViAl0JLxYwA==")
                .then((response) => response.data);
            context.log(cookiesData);
            context.res = {
                status: 200,
                body: JSON.stringify({
                    type: 4,
                    data: {
                        content: "hello",
                        embeds: cookiesData.map((cookie) => new Discord.MessageEmbed()
                            .setTitle(cookie.name)
                            .setDescription(cookie.description)
                            .setThumbnail(cookie.image)),
                    },
                }),
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map