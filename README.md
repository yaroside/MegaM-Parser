![alt text](image.png)

MegaM Parser — это инструмент для автоматического сбора информации о товарах с маркетплейса MegaM. Он позволяет быстро находить товары по ключевым словам, фильтровать их по цене и кешбэку, а затем сохранять данные в Excel.

📌 Возможности: \
✔️ Поиск товаров по ключевому запросу \
✔️ Указание количества страниц для парсинга \
✔️ Фильтрация товаров по цене (минимальная и максимальная) \
✔️ Опция фильтрации товаров только с кешбэком и без \
✔️ Сохранение результатов в Excel-файл \
✔️ Автоматизированное взаимодействие с сайтом через Puppeteer 

📌 Используемые технологии: 
- ✔️ Node js 
- ✔️ Puppeteer – управление браузером для парсинга 
- ✔️ ExcelJS – работа с файлами Excel 
- ✔️ Chalk – цветной вывод в консоли 
- ✔️ Ora – анимация загрузки в терминале 

Параметры:

- Product For Search — Запрос для поиска (обязательный) 
- Pages Count — Сколько страниц просканировать. (1 страница ~ 45 товаров)
- Min. Price — Минимальная цена (false, если не задана) 
- Max. Price — Максимальная цена (false, если не задана)
- Add. Param — Фильтр товаров (доступные режимы ниже) 

📌 Режимы фильтрации (addParams):
- addAllProducts — Собрать все товары без фильтрации 
- onlyCashback — Только товары с кешбэком
- withoutCashback — Только товары без кешбэка

Перед началом работы убедитесь, что у вас установлен Node.js 
Затем склонируйте репозиторий и установите зависимости 

Запуск - node index.js \
Подсказка - node index.js --help || node index.js -h \
Также рекомендую ввести команду в терминал Windows "chcp 65001". Это поможет избежать проблем с кодировкой

- ✅ Автоматически выравнивает диапазон цен если указанные параметры выше или ниже диапазона 
- ✅ Если указанное количество страниц превышает актуальное количество страниц с товаром, парсер закончит свою работу, записав в excel-файл то количество товаров, которые соответствовали фильтрам
- ✅ Работает только в терминале – графический интерфейс отсутствует

Буду рад вашим вопросам и улучшениям! 🥰
