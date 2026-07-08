import { readFileSync } from 'fs';

const html = readFileSync('./dist/index.html', 'utf8');
const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];

if (matches.length > 0) {
	console.log("Raw HTML match[0] start:");
	console.log(matches[0].slice(0, 500));
}
