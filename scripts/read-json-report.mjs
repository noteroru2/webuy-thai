import fs from 'fs';

let jsonStr = fs.readFileSync('link-report-http.json', 'utf16le');
if (jsonStr.charCodeAt(0) === 0xFEFF) {
  jsonStr = jsonStr.slice(1);
}

const report = JSON.parse(jsonStr);

// Filter for 404 links
const brokenLinks = report.links.filter(link => link.state === 'BROKEN');

// Group by url
const grouped = {};
for (const link of brokenLinks) {
	if (!grouped[link.url]) grouped[link.url] = new Set();
	grouped[link.url].add(link.parent);
}

// Print top 15 broken URLs and 1 parent for each
let i = 0;
for (const [url, parents] of Object.entries(grouped)) {
	if (i >= 15) break;
	console.log(`Broken URL: ${decodeURIComponent(url)}`);
	console.log(`Found in (Sample): ${decodeURIComponent([...parents][0])}`);
	console.log('---');
	i++;
}

console.log(`Total unique broken URLs: ${Object.keys(grouped).length}`);
