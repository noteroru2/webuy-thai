const CLAIM_COPY_MARKERS = [
	'ราคาสูงที่สุด',
	'ให้ราคาสูง',
	'ราคาสูง',
	'สู้ทุกราคา',
	'ไม่กดราคาแน่นอน',
	'ไม่กดราคา',
	'จ่ายสดทันที',
	'จ่ายเงินสดทันที',
	'จ่ายเงินสด',
	'รับเงินสดทันที',
	'ตีราคาให้ทันที',
	'ประเมิน 15 นาที',
	'10-15 นาที',
	'15 นาที',
	'100%',
	'1,000,000%',
	'อันดับ 1',
	'อันดับหนึ่ง',
	'รับทุกสภาพ',
	'รับถึงที่ทั่วประเทศ',
	'ทั่วประเทศแบบรับถึงที่ทุกจังหวัด',
	'ด่วนที่สุด',
	'รับถึงที่',
	'ได้เงินทันที',
] as const;

const NEGATIVE_CONTEXT_MARKERS = [
	'ไม่กล่าวอ้างราคาสูงสุด',
	'รับซื้อราคาสูงอย่างเดียว',
	'ใช้คำว่าให้บริการทั่วประเทศโดยไม่อธิบาย',
	'ไม่ใช่การันตีราคา',
	'ไม่กดราคาเกินเหตุ',
	'ราคาอิงตลาด ไม่กดราคาค่าพื้นที่',
] as const;

export function hasClaimHeavyCopy(text: string): boolean {
	const normalized = text.trim();
	if (!normalized) return false;
	if (NEGATIVE_CONTEXT_MARKERS.some((marker) => normalized.includes(marker))) {
		return false;
	}
	const lower = normalized.toLowerCase();
	return CLAIM_COPY_MARKERS.some((marker) => lower.includes(marker.toLowerCase()));
}

export function isSafeHomePreviewPost(input: {
	title: string;
	description?: string | null;
	heroImageAlt?: string | null;
	titleHtml?: string | null;
}): boolean {
	return ![
		input.title,
		input.description ?? '',
		input.heroImageAlt ?? '',
		input.titleHtml ?? '',
	]
		.filter(Boolean)
		.some((field) => hasClaimHeavyCopy(field));
}
