// gs-api.js
class GoogleSheetsAPI {
    constructor() {
        this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.auth = new GoogleAuth();
    }

    async _makeRequest(url, options = {}) {
        try {
            // Получаем актуальный токен
            const token = await this.auth.getAccessToken();
            
            // Добавляем авторизацию в заголовки
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Authorization'] = `Bearer ${token}`;
            
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка API: ${response.status} - ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Ошибка запроса:', error);
            throw error;
        }
    }

    async readSheet(sheetName, range = '') {
        const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}${range ? '!' + range : ''}`;
        const data = await this._makeRequest(url);
        return data.values || [];
    }

    async appendRow(sheetName, rowData) {
        const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [rowData]
            })
        };

        return await this._makeRequest(url, options);
    }

    async updateRow(sheetName, range, newData) {
        const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}!${range}?valueInputOption=USER_ENTERED`;
        
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [newData]
            })
        };

        return await this._makeRequest(url, options);
    }

    async clearRow(sheetName, range) {
        const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}!${range}:clear`;
        
        const options = {
            method: 'POST',
        };

        return await this._makeRequest(url, options);
    }
}

const gsAPI = new GoogleSheetsAPI();