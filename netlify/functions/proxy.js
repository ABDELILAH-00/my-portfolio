const axios = require('axios');

exports.handler = async (event, context) => {
  const path = event.path.replace('/api/', '');
  const isStorage = event.path.includes('/storage/');
  
  // The actual URL on InfinityFree
  const targetUrl = isStorage 
    ? `http://abdelilah-portfolio.wuaze.com/public${event.path}`
    : `http://abdelilah-portfolio.wuaze.com/public/api/${path}`;

  try {
    const response = await axios({
      method: event.httpMethod,
      url: targetUrl,
      data: event.body ? JSON.parse(event.body) : null,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': isStorage ? 'image/*' : 'application/json',
        'X-ADMIN-KEY': event.headers['x-admin-key'] || '',
      },
      responseType: isStorage ? 'arraybuffer' : 'json'
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers['content-type'],
      },
      body: isStorage 
        ? Buffer.from(response.data).toString('base64') 
        : JSON.stringify(response.data),
      isBase64Encoded: isStorage
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
