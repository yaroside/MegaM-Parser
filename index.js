//dependencies
import ExcelJS from 'exceljs'
import ora from 'ora'
import chalk from 'chalk'
//vars
let url = 'https://megamarket.ru/catalog/?q='
let userAgent =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
import { selectors } from './helpers/newDesign.js'
import { dom } from './helpers/newDesign.js'
import { dateObject } from './helpers/date.js'
import { text } from './helpers/text.js'
import setInputsValue from './functions/setInputsValue.js'
import launchBrowser from './functions/browserConfig.js'
import showHelp from './helpers/showHelp.js'
import askQuestion from './helpers/askQuestion.js'

process.stdin.setEncoding('utf8')
process.stdout.setEncoding('utf8')

async function main() {
	let userArgs = process.argv.slice(2)
	// Запуск инструкции по парсеру
	if (userArgs.includes('-h') || userArgs.includes('--help')) {
		showHelp()
	}
	let productQuery = askQuestion('Product For Search', '', 'string').normalize(
		'NFC'
	)
	if (productQuery.length < 2 || productQuery.length >= 100) {
		console.log('Продукт должен содержать от 2 до 100 символов')
		return
	}

	let countPages = askQuestion('Pages Count', '5', 'number')
	if (countPages === '' || isNaN(countPages)) countPages = 3

	let minAmount = askQuestion('Min. Price', 'false', 'number')
	if (minAmount === 'false' || isNaN(minAmount)) minAmount = false

	let maxAmount = askQuestion('Max. Price', 'false', 'number')
	if (maxAmount === 'false' || isNaN(maxAmount)) maxAmount = false

	const addParams = askQuestion('Add. Param', 'addAllProducts', 'string')

	let objectRequest = {
		productQuery,
		countPages,
		minAmount,
		maxAmount,
		addParams,
	}
	console.log(objectRequest)
	const encodedQuery = encodeURIComponent(objectRequest.productQuery)
	// **************************КОНФИГУРАЦИЯ БРАУЗЕРА**************************
	const { browser, page } = await launchBrowser(userAgent)
	// **************************РАБОТА СО СТРАНИЦЕЙ МАРКЕТА**************************
	await page.goto(url + encodedQuery, { waitUntil: 'domcontentloaded' })
	// закрытие модального окна (если оно появляется)
	await new Promise(resolve => setTimeout(resolve, 5000))
	const closeModalIfExists = async () => {
		const spinner = ora(chalk.yellow(text.modalWindow.windowWaiting)).start()
		try {
			await page.waitForSelector(dom.modalWindow, {
				visible: true,
				timeout: 10000,
			})
			await new Promise(resolve => setTimeout(resolve, 5000))
			await page.click(dom.modalWindowClose)
			spinner.succeed(chalk.green(text.modalWindow.windowClosed))
		} catch (error) {
			spinner.fail(chalk.red(text.modalWindow.windowNotFound))
		}
	}
	const closeModal = closeModalIfExists()
	await closeModal
	// выставление цены на товары
	async function setPrice() {
		let minValueRequest = objectRequest.minAmount
		let maxValueRequest = objectRequest.maxAmount
		let rangeInputs = await page.$('.range-inputs')
		// проверяет указан ли диапазон для суммы
		if (
			(minValueRequest != false && maxValueRequest != false) ||
			minValueRequest != false ||
			maxValueRequest != false
		) {
			if (rangeInputs) {
				// формирует массив из значений инпутов
				let inputsArrayValue = await page.evaluate(element => {
					let index = 0
					return Array.from(element.querySelectorAll('input')).map(input => {
						input.setAttribute('id', `inputvalueAmount_${index++}`)
						if (input.value.length >= 5) {
							return parseInt(input.value.replace(/\s+/g, ''))
						}
						return parseInt(input.value)
					})
				}, rangeInputs)
				// проверка минимального значения
				async function checkMinInputValue(minValueRequest) {
					if (
						minValueRequest >= inputsArrayValue[0] &&
						minValueRequest < inputsArrayValue[1]
					) {
						return minValueRequest
					} else {
						console.log(
							chalk.yellow(text.priceHandler.correctPriceMin(inputsArrayValue))
						)
						minValueRequest = inputsArrayValue[0]
						return minValueRequest
					}
				}
				minValueRequest = await checkMinInputValue(minValueRequest)
				// проверка максимального значения
				async function checkMaxInputValue(maxValueRequest) {
					if (
						maxValueRequest > inputsArrayValue[0] &&
						maxValueRequest <= inputsArrayValue[1]
					) {
						return maxValueRequest
					} else {
						console.log(
							chalk.yellow(text.priceHandler.correctPriceMax(inputsArrayValue))
						)
						maxValueRequest = inputsArrayValue[1]
						return maxValueRequest
					}
				}
				maxValueRequest = await checkMaxInputValue(maxValueRequest)
				// установление значения в инпуты
				if (
					typeof minValueRequest !== 'string' &&
					typeof maxValueRequest !== 'string'
				) {
					await setInputsValue(page, `#inputvalueAmount_0`, minValueRequest)
					await setInputsValue(page, `#inputvalueAmount_1`, maxValueRequest)
				} else if (typeof minValueRequest !== 'string') {
					await setInputsValue(page, `#inputvalueAmount_0`, minValueRequest)
				} else if (typeof maxValueRequest !== 'string') {
					await setInputsValue(page, `#inputvalueAmount_1`, maxValueRequest)
				}
				console.log(
					chalk.green(
						text.priceHandler.priceSuccess(minValueRequest, maxValueRequest)
					)
				)
			}
		}
	}
	await setPrice()
	// нажатие на кнопку для отображения всех товаров
	let pagesForSearch = objectRequest.countPages
	async function loadMoreProducts() {
		let pagesLoaded = 0
		let pagesForSearchNumber = +pagesForSearch
		while (pagesLoaded < pagesForSearchNumber) {
			const spinner = ora(chalk.yellow(text.loadingPages.loadBegin)).start()
			try {
				let button = await page.waitForSelector(dom.showMoreBtn, {
					timeout: 5000,
				})
				if (button) {
					await page.click(dom.showMoreBtn)
					pagesLoaded++
					spinner.succeed(
						chalk.yellowBright.cyanBright(
							text.loadingPages.loadProcessing(
								pagesLoaded,
								pagesForSearch,
								pagesForSearchNumber
							)
						)
					)
					await new Promise(resolve => setTimeout(resolve, 3000))
				}
			} catch (error) {
				spinner.fail(
					chalk.bgRed.yellow(text.loadingPages.loadError(pagesLoaded))
				)
				break
			}
		}
	}
	await loadMoreProducts()
	// получение всех элементов на странице
	const productElements = await page.$$eval(
		selectors.allProducts,
		(products, selectors, objectRequest) => {
			const allProducts = []
			products.forEach(product => {
				let productName = product
					.querySelector(selectors.productTitle)
					.textContent.trim()
				let productLink = product.querySelector(selectors.productLink).href
				let productPrice = product
					.querySelector(selectors.productPrice)
					.textContent.trim()
				let cbPercent = product.querySelector(selectors.cbPercent)
					? product.querySelector(selectors.cbPercent).textContent
					: null
				let cbAmount = product.querySelector(selectors.cbAmount)
					? product.querySelector(selectors.cbAmount).textContent
					: null

				function onlyCashback() {
					if (cbPercent && cbAmount) {
						allProducts.push({
							name: productName,
							link: productLink,
							price: productPrice.toString().replace(/\s+/g, ''),
							cbPercent: cbPercent,
							cbAmount: cbAmount,
						})
					}
				}

				function withoutCashback() {
					if (cbPercent === null && cbAmount === null) {
						allProducts.push({
							name: productName,
							link: productLink,
							price: productPrice.toString().replace(/\s+/g, ''),
							cbPercent: '-',
							cbAmount: '-',
						})
					}
				}

				function addAllProducts() {
					allProducts.push({
						name: productName,
						link: productLink,
						price: productPrice.toString().replace(/\s+/g, ''),
						cbPercent: cbPercent === null ? '-' : cbPercent,
						cbAmount: cbAmount === null ? '-' : cbAmount,
					})
				}

				switch (objectRequest.addParams) {
					case 'onlyCashback':
						onlyCashback()
						break
					case 'withoutCashback':
						withoutCashback()
						break
					case 'addAllProducts':
						addAllProducts()
						break
				}
			})
			if (objectRequest.addParams === 'onlyCashback') {
				return allProducts.sort(
					(a, b) => parseInt(b.cbPercent) - parseInt(a.cbPercent)
				)
			} else if (objectRequest.addParams === 'withoutCashback') {
				return allProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price))
			} else if (objectRequest.addParams === 'addAllProducts') {
				return allProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price))
			}
		},
		selectors,
		objectRequest
	)
	// **************************ЭКСПОРТ В EXCEL**************************
	if (productElements.length < 1) {
		console.log(
			chalk.underline.red(chalk.red(text.productsError.productsEmpty(product)))
		)
		await browser.close()
		return
	}
	const workbook = new ExcelJS.Workbook()
	const worksheet = workbook.addWorksheet(`${objectRequest.productQuery}`, {
		pageSetup: { orientation: 'landscape' },
	})
	// Добавляем заголовки
	worksheet.columns = [
		{ header: 'Название товара', key: 'productTitle', width: 75 },
		{ header: 'Ссылка на товар', key: 'productLink', width: 30 },
		{ header: 'Цена на товар', key: 'productPrice', width: 30 },
		{ header: 'Процент каши', key: 'cbPercent', width: 30 },
		{ header: 'Сумма каши', key: 'cbAmount', width: 30 },
	]
	// Устанавливаем стиль для заголовков
	const headerRow = worksheet.getRow(1)
	headerRow.font = { name: 'Times New Roman', size: 16, bold: true }
	headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
	headerRow.height = 30
	// Добавляем данные и центрируем нужные ячейки
	productElements.forEach(product => {
		const row = worksheet.addRow({
			productTitle: product.name,
			productLink: {
				text: 'Ctrl + LeftMouseClick',
				hyperlink: product.link,
				tooltip: product.link,
			},
			productPrice: product.price,
			cbPercent: product.cbPercent,
			cbAmount: product.cbAmount,
		})

		row.font = { name: 'Times New Roman', size: 12 }
		row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
	})
	// автоматический подгон высоты строк в зависимости от количества текста
	worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
		if (rowNumber !== 1) {
			let maxLength = 0
			row.eachCell({ includeEmpty: true }, cell => {
				if (cell.value) {
					let cellLength = cell.value.toString().length
					maxLength = Math.max(maxLength, cellLength)
				}
			})
			row.height = Math.floor(maxLength - maxLength / 5)
		}
	})
	// сохранение результатов в excel-файл
	await workbook.xlsx.writeFile(
		`${objectRequest.productQuery} ${dateObject.day}.${dateObject.month}.${dateObject.year}.xlsx`
	)
	console.log(
		chalk.bgBlackBright.green(
			text.excelInfo.excelSuccessSave(objectRequest.productQuery, dateObject)
		)
	)

	// закрываем браузер
	await browser.close()
}

main().catch(error => console.error(`Ошибка! Причина: `, error))
