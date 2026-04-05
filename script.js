async function sendData() {
    const btn = document.getElementById('submitBtn');
    
    // Собираем данные
    const name = document.getElementById('nameInput').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guestInfo = document.getElementById('guestInput').value;
    
    const drinks = [];
    document.querySelectorAll('#drinksGroup input:checked').forEach(cb => {
        drinks.push(cb.value);
    });

    if (!name) {
        alert("Пожалуйста, введите ваше имя");
        return;
    }

    // Визуальная индикация загрузки
    btn.disabled = true;
    btn.innerText = "ОТПРАВКА...";

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, attendance, guestInfo, drinks })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Спасибо! Ваш ответ отправлен.");
            // Можно очистить форму
        } else {
            throw new Error(result.error || "Ошибка соединения");
        }
    } catch (error) {
        alert("Произошла ошибка: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "ПОДТВЕРДИТЬ";
    }
}