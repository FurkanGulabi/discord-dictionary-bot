require("dotenv").config()
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require("discord.js");
const { getKelimeTDK } = require("./utils/getKelimeTDK");
const { translateText } = require("./utils/translateText");


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,

    ]
})

client.on('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`)
    client.user.setActivity({
        name: 'TDK',
        type: ActivityType.Custom
    });
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'kelime-tdk') {
        const kelime = interaction.options.get("kelime").value

        try {
            const result = await getKelimeTDK(kelime);
            console.log(result);
            if (result.error) {
                const embed = new EmbedBuilder()
                    .setTitle('Kelime Bulunamadı')
                    .setColor('FF0000')

                return interaction.reply({ embeds: [embed] });
            }

            let anlamMetni = '';
            result.anlamlar.forEach((anlam, index) => {
                anlamMetni += `**Anlam ${index + 1}:** ${anlam.anlam.replace('►', '')}\n`; // ► işaretini çıkar
                if (anlam.ornek) {
                    anlamMetni += `**Örnek:** ${anlam.ornek}\n`;
                }
                anlamMetni += '\n';
            });



            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`**Kelime:** ${result.kelime}`)
                .setDescription(anlamMetni)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Hata:", error);
            interaction.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
    }

    if (interaction.commandName === 'çevir') {
        const metin = interaction.options.get("metin").value

        try {
            const trAnlam = await translateText(metin);
            if (!trAnlam) interaction.reply("Çevirilemedi")
            console.log(trAnlam);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(trAnlam.anlam)
                .setDescription(trAnlam.TranslatedText)
                .setFooter({
                    text: trAnlam.dilAdi,
                    iconURL: interaction.user.displayAvatarURL() // İsteğe bağlı, kendi ikon URL'nizi ekleyebilirsiniz
                });


            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Hata:", error.message);
            interaction.reply("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
    }
})


client.login(process.env.BOT_TOKEN)