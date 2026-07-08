import { readFileSync } from 'fs';

const files = [
	'dist/รับซื้อ-apple-watch/index.html',
	'dist/รับซื้อ-ups/index.html'
];

for (const file of files) {
	console.log(`\n=== File: ${file} ===`);
	const html = readFileSync(file, 'utf8');
	
	// search for occurrences of 'สู้ทุกราคา' and print surrounding 100 characters
	let idx = 0;
	while (true) {
		idx = html.indexOf('สู้ทุกราคา', idx);
		if (idx === -1) break;
		console.log(`[สู้ทุกราคา] Found around idx ${idx}:`);
		console.log(html.slice(idx - 100, idx + 100));
		idx += 10;
	}

	idx = 0;
	while (true) {
		idx = html.indexOf('100%', idx);
		if (idx === -1) break;
		// Skip CSS colors or width percentages
		const context = html.slice(idx - 50, idx + 50);
		if (!context.includes('width') && !context.includes('height') && !context.includes('gradient')) {
			console.log(`[100%] Found around idx ${idx}:`);
			console.log(context);
		}
		idx += 4;
	}
}
