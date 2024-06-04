const axios = require('axios');

async function getKelimeTDK(kelime) {
    try {
        const response = await axios.get(`https://sozluk.gov.tr/gts?ara=${kelime}`);
        const data = response.data;

        // Eğer veri dönmüyorsa veya hata varsa null döndür
        if (!data || data.length === 0) {
            return null;
        }
        if (data.error) {
            return {
                error: "Kelime Bulunamadı"
            }
        }

        const kelimeData = data[0];



        // Kelime ve anlamları al
        const kelimeAnlamlar = kelimeData.anlamlarListe.map(anlam => {
            // Örneklerin varlığını ve boş olup olmadığını kontrol et
            const ornek = anlam.orneklerListe && anlam.orneklerListe.length > 0 ? anlam.orneklerListe[0].ornek : null;
            return {
                anlam: anlam.anlam,
                ornek: ornek ? ornek : null
            };
        });

        // Json formatında dön
        return {
            kelime: kelime,
            anlamlar: kelimeAnlamlar
        };
    } catch (error) {
        console.error('Hata:', error);
        return null;
    }
}


module.exports = { getKelimeTDK };
