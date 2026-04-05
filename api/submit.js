export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, attendance, companion, drinks } = req.body;

        // Эти данные мы возьмем из настроек Vercel (см. инструкцию ниже)
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_IDS = process.env.TELEGRAM_CHAT_IDS.split(','); // Список ID через запятую

        let text = "💌 <b>Новая анкета гостя!</b>\n\n";
        text += `👤 <b>Имя:</b> ${name}\n`;
        text += `❓ <b>Присутствие:</b> ${attendance}\n`;
        if (companion) {
            text += `👥 <b>Спутник:</b> ${companion}\n`;
        }
        if (drinks && drinks.length > 0) {
            text += `🍷 <b>Напитки:</b> ${drinks.join(', ')}\n`;
        }

        // Отправляем сообщение всем получателям
        const sendPromises = CHAT_IDS.map(chatId => {
            return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId.trim(),
                    text: text,
                    parse_mode: 'HTML'
                })
            });
        });

        const responses = await Promise.all(sendPromises);
        const allOk = responses.every(r => r.ok);

        if (allOk) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Ошибка отправки в Telegram' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
}