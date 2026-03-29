import { getSiteOrigin } from '../lib/site';

const site = getSiteOrigin();
const siteName = import.meta.env.PUBLIC_SITE_NAME ?? 'เรารับซื้อ.com';
const orgName = import.meta.env.PUBLIC_ORG_NAME ?? 'WE BUY | เรารับซื้อ';

export function GET() {
	const body = `# ${siteName}

> ${orgName} — รับซื้อโน๊ตบุ๊ค คอมพิวเตอร์ ไอโฟน ไอแพด มือถือ กล้อง และไอทีมือสองทั่วประเทศ ประเมินราคาโปร่งใส แอดไลน์ @WEBUY หรือโทร 064-2579353 ตลอด 24 ชั่วโมง

## About
- ชื่อองค์กร: ${orgName}
- ประเภทธุรกิจ: รับซื้อสินค้าไอทีมือสอง
- ภาษา: ไทย (th-TH)
- ช่องทางติดต่อ: Line @webuy, โทร 064-257-9353
- เวลาทำการ: 24 ชั่วโมง ทุกวัน

## Services
- หน้ารวมรับซื้อ: ${site}/รับซื้อ/
- รับซื้อโน๊ตบุ๊ค: ${site}/โน๊ตบุ๊ค/
- รับซื้อคอมพิวเตอร์: ${site}/คอม/
- รับซื้อไอโฟน: ${site}/ไอโฟน/
- รับซื้อกล้อง: ${site}/กล้อง/

## Canonical Pages
- หน้าแรก: ${site}/
- บทความ: ${site}/blog/
- ติดต่อเรา: ${site}/contact/
- รับซื้อ (รวมหมวด): ${site}/รับซื้อ/

## Discovery
- Sitemap: ${site}/sitemap-index.xml
- Robots: ${site}/robots.txt
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
