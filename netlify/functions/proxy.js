exports.handler = async (event) => {
  const path = event.path;
  const isStorage = path.includes('/storage/');
  
  // Correction de l'URL cible
  let targetUrl;
  if (isStorage) {
    // Les images sont dans public/storage/...
    targetUrl = `http://abdelilah-portfolio.wuaze.com/public${path}`;
  } else {
    // Les routes API passent par l'URL de base
    const apiPath = path.replace('/api/', '');
    targetUrl = `http://abdelilah-portfolio.wuaze.com/api/${apiPath}`;
  }

  console.log("Proxying to:", targetUrl);

  try {
    const requestOptions = {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-ADMIN-KEY': event.headers['x-admin-key'] || '',
        'Content-Type': 'application/json'
      }
    };

    if (event.body && (event.httpMethod === 'POST' || event.httpMethod === 'PUT')) {
      requestOptions.body = event.body;
    }

    const response = await fetch(targetUrl, requestOptions);
    
    if (isStorage) {
      const buffer = await response.arrayBuffer();
      return {
        statusCode: 200,
        headers: { 'Content-Type': response.headers.get('content-type') || 'image/webp', 'Access-Control-Allow-Origin': '*' },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true
      };
    } else {
      const data = await response.text();
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: data
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy Error: " + error.message })
    };
  }
};
