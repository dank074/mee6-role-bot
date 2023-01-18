import { Client, GatewayIntentBits } from "discord.js";
import config from './config.json';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("messageCreate", (msg) => {
    //console.log(msg);
    if (!msg.author.bot) // we only want mee6 messages
       return

    if(msg.author.username !== config.botName) return;
    
    if (!msg.content) return;

    if (msg.mentions.members.size === 0) return;

    const member = msg.mentions.members.first();

    const indexOfRank = config.messageFormat.split(' ').indexOf('{rank}');

    const matchCommand = config.messageFormat.replace('{user_id}', member.user.id).replace('{rank}', config.requiredRank.toString());
    
    if (msg.content.startsWith(matchCommand)) {
        const splitMsg = msg.content.split(' ');
        const rankString = splitMsg[indexOfRank];
        const rank = parseInt(rankString);

        if (rank < config.requiredRank) return;

        let role = msg.guild.roles.cache.find(r => r.name === config.role);

        if (!role) return;

        if (member.roles.cache.has(role.id)) {
            return;
        }

        member.roles.add(role).catch(console.error);

        msg.channel.send(`${member.user.toString()} is now a **${role.name}** `);
    }
});

client.login(config.token);