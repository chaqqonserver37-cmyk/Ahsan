// auth.js
class GoogleAuth {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
    }

    // Получаем JWT токен для аутентификации
    async getAccessToken() {
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.token;
        }

        return await this.fetchNewToken();
    }

    async fetchNewToken() {
        // Service Account credentials из JSON файла
        const credentials = {
            "type": "service_account",
            "project_id": "my-project-ahsan-477818",
            "private_key_id": "39e1bf41652d1e7b0faf1f0a9535d809cecd682e", 
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUho5fsYS0tllI\nLhnjOwyzl5fZIzj3vHUxBWn+MwJ75plsBspeoSD3+HUJ7aQ7of459tsSDwErSgMz\nK3I6GZpFshRuXAehB+lXbvbk8YY1NichLLH4dAhtjqdcXyJ6J4j2r0+YRbgnakLa\nwPxtiMNpt8k7QD0AQxvQRdv9X3R05cBRC4wkZxKXkG1R9dDKup4InkcYgmjG0Ic7\n2fXJIdcZodqCAlJjhyD5v/OqftYzEwjDRYQ+OMezEpUwjRBxE8QNil2q2Qg6RzGw\nB2kK0jAWYd6lavt3VK1+hC33qwqLnhQ4RyE9/5p5qKjvel+EpXl/QMfrCWz91xwA\nHvq49On/AgMBAAECggEAATW5DyOoipmQv8BFuIqF6nHfdA3aTnv+KumPUhxXM1Yr\nEujRRcQuFftMSGnJSfYTNSs12PhMjetGzSiDs5z4q7A3Necb/WFgfg78vjMVN+Dm\n3t39wX3ClSausMQ26H0O9QE9HayhEzx7OaLHgEzuKBYkRXgUNO+pNWNK7+JgivFa\nJQ4b738fSywjSXKEgkxrWAVEZVJkBhTCOxDSgwR3oWAvnIGEUZNG6PBMGBNp4rFK\n/gXJjw4g/xy0EYolp0FiEik3KOyTDjJBqZI6uTjCUj7Mq3FGmO1ce7woiTPIYt9q\nm8oyT8ILKY/AUAH6JBYoRDhkq0jkxsOkIkVhGvJBwQKBgQDz+UDLoFGJq+zfFAr0\nGFUTWhbdLcfT7XwAx0eQFSN9xtOBlAazccDxfieFzSdq51LBP0BuJAz+jHwsRvJv\nOozLj2izeoT4CpG/2IUnKJvRKu1P9Hz1VJNk4cBtmfYlRo/WdCPkmoj6AUOyMoGx\nXflPkHIC/oJ9d49vx4hBvuNWLwKBgQDfAHRmLEYLP09zCl+Kdo2VwC90h9ntffHG\n/1FxORrraKd613yQjM/t7t3x8PhwynPNLj46Q3ohYjI0AjySDocokBvRa5mEgJmV\nzDZXWubkhhMA0kGXduNehfmOp9RZggthy6mT/Vzcp1QwqNCfo5YA20KIhte+eQPZ\n4daNd0WFMQKBgHX0CvynvOQnp/TOVuFepjsd8jHrAVKX3bzum82wOqGDsBxUucyl\n8ZeP24HYBvercRoW/4qAiXvD5gDuKCXYk9uSsRcc5A6b5Y1wHCgrfPHqpCNk28ks\no7pBXuxeZF/vNnmDWxsaD6F3XQhZXNSoz3FFL6n87I/GbyWmvVyz8mtnAoGAFilk\nZ/cEav+6tJMWVZtcjMJRtQH/PWPj0EP1YwwqybRX2JRrs63ayCmR8wZgmkz0XzK2\nSnIERCcPGC4UuOsqsXRI33ITCqEBImruB5ZoFdPhNZavoA7Xn8AuweeZ6d9LpEdq\nLePjA6a5bjCIsyS9to4TuZ+09x/tqwyPlvWAejECgYBjxxjdD9r0GL2EXoTe242x\nRt83mg58O0oMx283rQs8alIp0E1n9jt/AWwSYB5ho291k6/QBclYfts1Gzv7QIGM\nGDkTuAQygdUT7erDiEGH8ug6y3Z56bb58g0fo1+/hxLCyoP1ii4ffsZ7B+GP8TKt\nx4ceGVwiHAbnz0m2hUl6aA==\n-----END PRIVATE KEY-----\n",
            "client_email": "department-ahsan@my-project-ahsan-477818.iam.gserviceaccount.com",
            "client_id": "117278067141915151643",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        };

        const jwtHeader = {
            alg: 'RS256',
            typ: 'JWT'
        };

        const now = Math.floor(Date.now() / 1000);
        const jwtPayload = {
            iss: credentials.client_email,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: credentials.token_uri,
            exp: now + 3600, // Токен на 1 час
            iat: now
        };

        // Кодируем header и payload
        const encodedHeader = btoa(JSON.stringify(jwtHeader)).replace(/=/g, '');
        const encodedPayload = btoa(JSON.stringify(jwtPayload)).replace(/=/g, '');
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        // Подписываем JWT (упрощенная версия - в реальности нужна криптография)
        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signatureInput}`
            });

            const data = await response.json();
            
            if (data.access_token) {
                this.token = data.access_token;
                this.tokenExpiry = Date.now() + (data.expires_in * 1000);
                return this.token;
            } else {
                throw new Error('Не удалось получить токен: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error('Ошибка аутентификации:', error);
            throw error;
        }
    }
}