import readlineSync from 'readline-sync'
import chalk from 'chalk'

export default function askQuestion(question, defaultValue = '', type) {
	let displayQuestion = `${chalk.cyanBright(question)} (${chalk.gray(
		defaultValue
	)}): `
	let answer = readlineSync.question(displayQuestion, {
		defaultInput: defaultValue,
	})

	if (type === 'number' && answer !== 'false') {
		return parseFloat(answer)
	} else if (type === 'string' && answer.length >= 100) {
		return 'Максимальное количество символов - 100'
	}
	return answer.trim() === '' ? defaultValue : answer
}
