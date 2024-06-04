require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name: 'kelime-tdk',
        description: 'Kelime Tdk anlamı',
        options: [
            {
                name: 'kelime',
                description: 'Kelime',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'çevir',
        description: 'Cümleleri Türkçe diline çevirir',
        options: [
            {
                name: 'metin',
                description: 'Çevirilecek metin',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
];

const rest = new REST({ version: "10" });
rest.setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Slash Commands Registered');
    } catch (error) {
        console.error("RegisterCommand Error: ", error.message);
    }
})();
