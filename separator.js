const csv = require('csv')

const csvStringify = async function (data) {
	return new Promise((resolve, reject) => {
		csv.stringify(
			data.rawContent,
			{
				header: true
			},
			(err, result) => {
				if (err) return reject(err);

				data.csv = result
				delete data.rawContent
				resolve(data)
			}
		)
	})
}

const paypalSeparator = async function (data) {
	const cleanData = data.trim()

	return new Promise((resolve, reject) => {
		const events = {}
		csv.parse(
			cleanData,
			{
				quote: '"',
				columns: true,
				//relax_column_count: true
			},
			async (err, csvData) => {
				if (err) return reject(err)

				for (let line of csvData) {
					if (!events[line['Item Title']]) {
						events[line['Item Title']] = []
					}
					events[line['Item Title']].push(line)
				}

				let result = Object.entries(events).map(([event, orders]) => {
					return {
						event,
						file: `PayPal_${event.replace(/ /g, '_')}.csv`,
						rawContent: orders
					}
				})

				result = await Promise.all(result.map(async (event) => csvStringify(event)))

				resolve(result)
			}
		)
	})
}

module.exports = paypalSeparator
