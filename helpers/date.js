let date = new Date()
let getDay = date.getDate()
let getMonth = date.getMonth() + 1
let getYear = date.getFullYear()

let day = getDay < 10 ? '0' + getDay : getDay
let month = getMonth < 10 ? '0' + getMonth : getMonth
let year = getYear
let halfOfYear = year - 2000

const dateObject = {
	day: day,
	month: month,
	year: halfOfYear,
}
export { dateObject }
