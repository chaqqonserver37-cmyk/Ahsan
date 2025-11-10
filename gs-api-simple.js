// gs-api-simple.js
class GoogleSheetsAPISimple {
    constructor() {
        this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
        // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ API КЛЮЧ
        this.apiKey = 'AIzaSyBRdsdesDN447akXMLmDxfuA8qjH1ygMX8';
    }

    async readSheet(sheetName, range = '') {
        try {
            const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}${range ? '!' + range : ''}?key=${this.apiKey}`;
            console.log('Запрос к URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! статус: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Получены данные:', data);
            return data.values || [];
            
        } catch (error) {
            console.error('Ошибка при чтении данных:', error);
            throw error;
        }
    }

    async appendRow(sheetName, rowData) {
        try {
            const url = `${this.baseURL}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [rowData]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ошибка! статус: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при добавлении строки:', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр
const gsAPI = new GoogleSheetsAPISimple();