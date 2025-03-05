const text = {
	productQuestion: {
		inputMessage: 'Какой товар вы хотите найти?',
		inputLengthMax: 'Максимальное количество букв - 100',
		inputRegex:
			'Введите минимум 2 символа из латинского алфавита или кириллицы',
	},
	pagesQuestion: {
		inputMessage:
			'Введите количество страниц для поиска, (1 страница ≈ 44 товара, минимальное значение - 2)',
		inputRegex: 'Пожалуйста, введите число',
		inputLengthMax: 'Количество страниц не должно превышать 1000',
		inputLengthMin: 'Минимальное значение - 2',
	},
	confirmationQuestion: {
		inputMessage: pages =>
			`Время выполнения скрипта составит от ${Math.floor(
				(pages * 3) / 60
			)} до ${Math.ceil((+pages * 3) / 60) + 1} минут. Продолжить?`,
	},
	programmEnd: {
		inputMessage: 'Программа завершила свою работу',
	},
	modalWindow: {
		windowWaiting: 'Ожидание модального окна',
		windowClosed: 'Модальное окно закрыто',
		windowNotFound: 'Модальное окно не найдено',
	},
	loadingPages: {
		loadBegin: 'Начало загрузки страниц...',
		loadProcessing: (pagesLoaded, pagesForSearch, pagesForSearchNumber) =>
			`Загружено страниц: ${pagesLoaded} из ${pagesForSearch}. Выполнено ${Math.floor(
				(pagesLoaded / pagesForSearchNumber) * 100
			)}% из 100%`,
		loadError: pagesLoaded =>
			`Количество страниц для поиска превышает количество страниц с товаром. Страниц просканировано: ${pagesLoaded}`,
	},
	productsError: {
		productsEmpty: product =>
			`Объект с товарами пустой, проверьте Ваш запрос ${product} или найдите другой товар`,
	},
	excelInfo: {
		excelSuccessSave: (product, dateObject) =>
			`Данные успешно сохранены в ${product} ${dateObject.day}.${dateObject.month}.${dateObject.year}.xlsx`,
	},
	priceHandler: {
		priceSuccess: (minValueRequest, maxValueRequest) =>
			`Ценовой диапазон установлен от ${minValueRequest} до ${maxValueRequest}`,
		correctPriceMin: inputsArray =>
			`Минимальная сумма была скорректирована до ${inputsArray[0]}`,
		correctPriceMax: inputsArray =>
			`Максимальная сумма была скорректирована до ${inputsArray[1]}`,
	},
}
export { text }
