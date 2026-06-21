import fs from 'node:fs';

function readJsonText(filePath) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.slice(2).toString('utf16le');
  }

  return buffer.toString('utf8').replace(/^\uFEFF/, '');
}

const jsonStr = readJsonText('link-report-http.json');

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
