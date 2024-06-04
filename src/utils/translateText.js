const { translate } = require('google-translate-api-browser');
const fs = require('fs');

const diller = JSON.parse(fs.readFileSync('src/languages/diller.json'))[0];



async function translateText(kelime) {
    if (kelime == "!diller") {
        return diller

    }
    try {
        const res = await translate(kelime, { to: "tr" });
        if (res.from.language.iso === 'ar') {
            return "Arapça dilini çevirmiyoruz";
        }

        console.log(diller)
        const anlam = res.text;
        const dilKodu = res.from.language.iso;
        const dilAdi = await diller[dilKodu]; // dilAdi'ni diller.json dosyasından al
        const TranslatedText = res.from.text.didYouMean != null ? res.from.text.didYouMean : res.from.text.value;
        const anlamwithlanguage = { dilAdi, anlam, TranslatedText }
        console.log(res);
        return anlamwithlanguage;
    } catch (error) {
        return "Bir hata oluştu";
    }
}

module.exports = { translateText }