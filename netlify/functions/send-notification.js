exports.handler = async (event) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Обрабатываем OPTIONS запрос (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Только POST запросы
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { username, message, transaction } = JSON.parse(event.body);
    
    // Логируем запрос (в реальном приложении здесь будет отправка в Telegram)
    console.log('📨 Уведомление:', { 
      username, 
      message, 
      transactionId: transaction.id 
    });
    
    // Имитируем успешную отправку
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: `Уведомление для ${username} отправлено!`,
        test: true // Флаг что это тестовая отправка
      })
    };

  } catch (error) {
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
