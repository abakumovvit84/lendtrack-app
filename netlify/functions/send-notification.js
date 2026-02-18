const fetch = require('node-fetch');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { username, message, transaction } = JSON.parse(event.body);
    const BOT_TOKEN = process.env.BOT_TOKEN;

    if (!BOT_TOKEN) {
      console.error('❌ BOT_TOKEN не установлен в переменных окружения');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Bot token not configured' 
        })
      };
    }

    const cleanUsername = username.replace('@', '');
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
      chat_id: `@${cleanUsername}`,
      text: message,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Подтвердить", callback_data: `confirm_${transaction.id}` },
            { text: "❌ Отклонить", callback_data: `reject_${transaction.id}` }
          ]
        ]
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.ok) {
      console.log(`✅ Уведомление отправлено пользователю @${cleanUsername}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          messageId: result.result.message_id 
        })
      };
    } else {
      // Проверяем, не потому ли ошибка, что пользователь не писал боту
      const userNotFound = result.description && result.description.includes('chat not found');
      console.log(`❌ Не удалось отправить @${cleanUsername}: ${result.description}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: result.description,
          userNotFound: userNotFound
        })
      };
    }

  } catch (error) {
    console.error('Ошибка функции:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
