import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'docs/recovery/batch-5-6/screenshots');

const pages = [
	{ slug: 'index', label: 'home' },
	{ slug: 'รับซื้อ/index', label: 'hub' },
	{ slug: 'รับซื้อโน๊ตบุ๊ค/index', label: 'notebook' },
	{ slug: 'รับซื้อไอโฟน/index', label: 'iphone' },
	{ slug: 'รับซื้อกล้อง/index', label: 'camera' },
];

const viewports = [
	{ name: 'desktop-1280', width: 1280, height: 900 },
	{ name: 'mobile-390', width: 390, height: 844 },
];

function startServer() {
	return new Promise((resolve, reject) => {
		const proc = spawn('npx', ['--yes', 'serve', dist, '-l', '4173'], {
			cwd: root,
			shell: true,
			stdio: ['ignore', 'pipe', 'pipe'],
		});
		let ready = false;
		const onData = (chunk) => {
			const text = chunk.toString();
			if (!ready && /Local:|Accepting connections/i.test(text)) {
				ready = true;
				resolve(proc);
			}
		};
		proc.stdout.on('data', onData);
		proc.stderr.on('data', onData);
		proc.on('error', reject);
		setTimeout(() => {
			if (!ready) resolve(proc);
		}, 5000);
	});
}

await mkdir(outDir, { recursive: true });
const server = await startServer();
const browser = await chromium.launch();
const base = 'http://127.0.0.1:4173';

try {
	for (const vp of viewports) {
		const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
		const page = await context.newPage();
		for (const item of pages) {
			const url = `${base}/${item.slug === 'index' ? '' : item.slug}`;
			await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
			await page.waitForTimeout(500);
			const file = path.join(outDir, `${item.label}-${vp.name}.png`);
			await page.screenshot({ path: file, fullPage: true });
			console.log(`Saved ${file}`);
		}
		await context.close();
	}
} finally {
	await browser.close();
	server.kill('SIGTERM');
}
