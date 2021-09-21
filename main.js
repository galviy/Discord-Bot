const Discord = require("discord.js");
const client = new Discord.Client();
const request = require('request');
const puppeteer = require("puppeteer");
const fs = require('fs')
var image = 0;

function randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on("ready", () => {
    client.user.setActivity('NoTaBot old source')
    console.log(`${client.user.tag} now online!`)
});

client.on("message", async message => {
    const prefix = "^";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.author.bot) {
        return;
    } else if (!message.content.startsWith(prefix)) {
        return;
    } else if (message.channel.type === "dm") {
        return;
    }


    if (command == "hostmaker") {
        const ips = args[0];
        const fakeip = args[1];
        if (!ips) {
            return message.reply(`Please input the ip.`)
        } else if (!fakeip) {
            return message.reply(`Please input how much fake ip you want to generate\nFor example: ${prefix}${command} 127.0.0.1 100`)
        } else if (fakeip < 1) {
            return message.reply("What would you use this instead make your own hosts?");
        } else if (isNaN(+fakeip) == true) {
            return message.reply("you can't use string to generate fake ip");
        } else if (fakeip > 2000) {
            return message.reply(`Something went wrong, Cannot generate fake ips more than 2000 variable.`);
        }
        try {
            var total = "#" + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 254) + " growtopia1.com\n";
            for (var a = 1; a < args[1]; a++) {
                total += "#" + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 254) + " growtopia1.com\n";
            }
            total += args[0] + "growtopia1.com\n" + args[0] + "growtopia2.com\n";
            for (var a = 1; a < args[1]; a++) {
                total += "#" + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 255) + "." + randomNum(0, 254) + " growtopia2.com\n";
            }
            fs.writeFileSync("./host/hosts", total);
            return message.channel.send("Here you go", {
                files: ["./host/hosts"]
            });
        } catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong.");
        }

    } else if (command === "gtonline") {
        try {
            request.get(`https://growtopiagame.com/detail`, function(err, response, data) {
                if (err) {
                    return message.channel.send(`Something went wrong?`)
                }
                const online = JSON.parse(data);
                if (response.statusCode == 200) {
					var onlineplayers = parseInt(online['online_user']);
                    message.channel.send(`There are ${onlineplayers.toLocaleString()} players online right now!`)
                } else if (response.statusCode == 502) {
                    return message.channel.send("Cannot access growtopia website, Maybe down?");
                }
            })
        } catch (err) {
			console.log(err)
        }
    } else if (command === "sswebsite") {
        let websitename = args[0];

        if (!websitename) {
            return message.channel.send(`Please input the website url\nfor example: ${prefix}sswebsite http://google.com/`)
        } else {
             message.channel.send(`Please wait it will takes 5 seconds.\nNote: abusing this command/directing bot to adult sites will result in permanently muted.`)

            request.get(`${websitename}`, function(err, response, data) {
                if (err) {
                    return message.reply(`**error can't find website's ip**.`)
                } else {
                    image++;
                    isSSWeb = true;
                    const capture = async () => {
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        await page.goto(websitename);
                        await page.screenshot({
                            path: `./images/${image}.png`,
                            fullpage: true
                        });
                        await browser.close();
                    };
                    capture()
                    setTimeout(() => {
                        message.reply(`Here you are the screenshot.`, {
                            files: [`./images/${image}.png`]
                        }).catch(err => message.reply(`Something went wrong.`));
                    }, 5000);
                }
            });
        }
    }

});



client.login("Discord bot token");