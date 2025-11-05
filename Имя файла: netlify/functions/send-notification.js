exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: "Функция работает!",
      method: event.httpMethod,
      path: event.path
    })
  };
};
