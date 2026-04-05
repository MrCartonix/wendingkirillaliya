export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, attendance, companion, drinks } = req.body;
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_IDS = process.env.TELEGRAM_CHAT_IDS.split(',');

        let text = "💌 <b>Новая анкета гостя!</b>\n\n";
        text += `👤 <b>Имя:</b> ${name}\n`;
        text += `❓ <b>Присутствие:</b> ${attendance}\n`;
        if (companion) text += `👥 <b>Спутник:</b> ${companion}\n`;
        if (drinks && drinks.length > 0) text += `🍷 <b>Напитки:</b> ${drinks.join(', ')}\n`;

        // Используем цикл, чтобы ошибка одного пользователя не ломала всё
        for (const chatId of CHAT_IDS) {
            try {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId.trim(),
                        text: text,
                        parse_mode: 'HTML'
                    })
                });
            } catch (err) {
                // Если одному пользователю не отправилось, просто пишем в логи и идем дальше
                console.error(`Не удалось отправить сообщение пользователю ${chatId}:`, err);
            }
        }

        // В любом случае возвращаем успех браузеру, так как форма заполнена
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Критическая ошибка сервера:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
