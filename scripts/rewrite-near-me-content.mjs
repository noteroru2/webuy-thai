import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Simple Spintax engine
function spin(text) {
    const regex = /{([^{}]+)}/g;
    let result = text;
    while (regex.test(result)) {
        result = result.replace(regex, (match, contents) => {
            const options = contents.split('|');
            return options[Math.floor(Math.random() * options.length)];
        });
    }
    return result;
}

const nearMeTemplates = {
    h2_1: [
        "กำลังหาร้านรับซื้อ{KW} ใกล้ฉันอยู่ใช่ไหม?",
        "หมดปัญหาหาร้านรับซื้อ{KW}ใกล้บ้าน เราวิ่งไปรับถึงที่",
        "รับซื้อ{KW}ใกล้ฉัน ด่วนที่สุด ประเมินราคาไว จ่ายเงินสดหน้างาน",
        "หาร้านรับซื้อ{KW} ใกล้ฉัน ให้ราคาสูง จ่ายเงินชัวร์ ต้องที่นี่"
    ],
    p_1: [
        "หากคุณกำลังค้นหาว่าจะขาย{KW}ที่ไหนดีใกล้ๆ บ้าน {ไม่ต้องเสียเวลา|หมดปัญหา}ต้องฝ่ารถติดเพื่อนำเครื่องไปตีราคาที่ห้างสรรพสินค้าหรือร้านตู้ไกลๆ อีกต่อไป เพราะ WE BUY มีบริการรับซื้อถึงที่ (On-Site Service) ในพื้นที่ใกล้บ้านคุณ",
        "ในยุคนี้ความสะดวกและรวดเร็วคือสิ่งสำคัญที่สุด ใครที่กำลังเซิร์ชหาร้านรับซื้อ{KW} ใกล้ฉัน คุณมาถูกที่แล้วครับ เรามีทีมงานที่พร้อมพุ่งตัวไปประเมินเครื่องและรับซื้อถึงหน้าประตูบ้านคุณ ไม่ต้องเหนื่อยเดินทาง",
        "เบื่อไหมกับการต้องขับรถตระเวนหาร้านรับซื้อ{KW}ใกล้บ้าน แล้วยังโดนกดราคาหน้างาน? ปัญหาเหล่านั้นจะหมดไป เมื่อเรียกใช้บริการจากเรา เพียงแค่นัดหมาย เราก็พร้อมไปหาคุณถึงที่ ทั่วทุกมุมเมือง"
    ],
    p_2: [
        "เราเข้าใจดีว่าคุณต้องการขาย{KW}ให้ได้ราคาดีที่สุดและเร็วที่สุด ทีมงานผู้เชี่ยวชาญของเราพร้อมที่จะตีราคาออนไลน์ให้คุณทราบก่อนภายใน 15 นาที หากราคาเป็นที่น่าพอใจ เราจะส่งทีมงานที่อยู่ใกล้คุณที่สุดวิ่งไปรับเครื่องทันที",
        "ไม่ว่าคุณจะอยู่ที่ไหน เรามีเครือข่ายทีมงานประเมินราคาที่ครอบคลุมพื้นที่ ทำให้คุณได้รับบริการที่รวดเร็วเสมือนมีร้านรับซื้อตั้งอยู่หน้าปากซอยบ้านคุณ ความปลอดภัยและความโปร่งใสคือสิ่งที่เราให้ความสำคัญเป็นอันดับหนึ่ง",
        "เพียงแค่ส่งสเปกและรูปภาพมาให้เราดูเบื้องต้น คุณก็สามารถรู้อนาคตของเครื่องได้เลยโดยไม่ต้องก้าวขาออกจากบ้าน เราประเมินตามความเป็นจริง ให้ราคาสูง แฟร์ และจบงานไวที่สุดในย่านนี้"
    ],
    h2_2: [
        "ทำไมลูกค้าถึงเลือกบริการรับซื้อ{KW}ใกล้บ้านกับเรา?",
        "ข้อดีของการขาย{KW}ใกล้ฉัน กับ WE BUY",
        "หมัดต่อหมัด: ขาย{KW}ให้ร้านใกล้ฉัน VS ไปขายเองที่ห้าง",
        "เหตุผลที่บริการรับซื้อ{KW}ใกล้บ้านเรา คือคำตอบที่ดีที่สุด"
    ],
    p_3: [
        "การไปขายเครื่องที่ร้านตู้ทั่วไป คุณอาจต้องแบกรับความเสี่ยงที่จะถูกกดราคาหลังจากเดินทางไปถึงแล้ว ซึ่งทำให้เสียทั้งเวลาและอารมณ์ แต่บริการรับซื้อ{KW}ใกล้บ้านของเรา เราจะตกลงราคากันล่วงหน้าให้จบก่อน ทำให้คุณมั่นใจได้ว่าเมื่อเราไปถึง คุณจะได้รับเงินตามจำนวนที่คุยกันไว้ (หากสภาพเครื่องตรงตามที่คุณแจ้ง)",
        "นอกจากเรื่องความสะดวกสบายแล้ว การขาย{KW}ให้กับทีมงานที่วิ่งไปรับถึงที่ยังช่วยให้คุณประหยัดค่าใช้จ่ายในการเดินทาง ทั้งค่าน้ำมัน ค่าทางด่วน หรือค่าที่จอดรถ ทุกอย่างเราเป็นคนจัดการให้ คุณเพียงแค่นั่งรอรับเงินโอนเข้าบัญชีแบบสบายๆ ในห้องแอร์",
        "ความน่าเชื่อถือคือสิ่งที่เราสั่งสมมาอย่างยาวนาน บริการรับซื้อ{KW}ใกล้ฉันของเรา ไม่ได้มีดีแค่ความรวดเร็ว แต่ทีมงานทุกคนได้รับการฝึกอบรมมาอย่างมืออาชีพ พูดจาสุภาพ ให้เกียรติลูกค้า และพร้อมให้คำปรึกษาอย่างจริงใจ"
    ],
    p_4: [
        "นอกจากนี้ หากเครื่องของคุณมีตำหนิ หรือแบตเตอรี่เสื่อม เราก็ยินดีรับซื้อและประเมินราคาตามจริงอย่างยุติธรรม ไม่มีการนำข้อบกพร่องเล็กๆ น้อยๆ มาเป็นข้ออ้างในการหักราคาอย่างไม่สมเหตุสมผล",
        "เรายังมีบริการจัดการข้อมูล (Data Wipe) แบบต่อหน้าคุณ 100% ทำให้คุณมั่นใจได้ว่าข้อมูลส่วนตัว รูปภาพ หรือบัญชีต่างๆ ใน{KW} จะไม่รั่วไหลไปไหน นี่คือบริการพรีเมียมที่ร้านทั่วไปอาจไม่มีให้",
        "ด้วยฐานลูกค้านับหมื่นรายที่เคยใช้บริการรับซื้อใกล้บ้านจากเรา เป็นเครื่องการันตีได้ว่าเราคือตัวจริงในวงการนี้ ได้เงินไว ได้เงินชัวร์ และปลอดภัยขั้นสุด"
    ],
    h2_3: [
        "ขั้นตอนง่ายๆ เมื่อต้องการขาย{KW}ให้ร้านใกล้ฉัน",
        "ขาย{KW}ด่วนใกล้บ้านคุณ รับเงินก้อนได้ง่ายๆ ใน 3 ขั้นตอน",
        "อยากเรียกใช้บริการรับซื้อ{KW}ใกล้ฉัน ต้องทำอย่างไร?",
        "เปลี่ยน{KW}เป็นเงินสดถึงหน้าบ้าน ในไม่กี่อึดใจ"
    ],
    p_5: [
        "เริ่มต้นง่ายๆ เพียงแค่คุณทัก LINE ออฟฟิเชียลของเรา (@webuy) แล้วส่งรูปถ่ายเครื่อง {KW} พร้อมแจ้งสเปก รุ่น และตำหนิ (ถ้ามี) ให้ครบถ้วน ทีมงานจะใช้เวลาตรวจสอบเพียงไม่กี่นาที และแจ้งราคาประเมินเบื้องต้นกลับไปหาคุณทันที",
        "ไม่ต้องทำอะไรให้ยุ่งยาก หยิบมือถือขึ้นมา ถ่ายรูปเครื่อง {KW} ของคุณให้ชัดเจน แล้วแอดไลน์มาคุยกับเรา เรามีทีมประเมินราคาที่สแตนด์บายตลอด 24 ชั่วโมง พร้อมตอบทุกคำถามและให้ราคาที่ดีที่สุดในตลาด",
        "กระบวนการของเราเน้นความรวดเร็วและไม่ซับซ้อน ทักแชท ส่งรูป เช็คราคา หากคุณพอใจในราคาประเมินเบื้องต้น เราก็พร้อมลุยต่อทันที ไม่ต้องกรอกเอกสารวุ่นวาย"
    ],
    p_6: [
        "เมื่อตกลงราคากันได้แล้ว คุณสามารถปักหมุด Location ใกล้บ้านที่คุณสะดวก ไม่ว่าจะเป็นที่พัก คอนโด ออฟฟิศ หรือร้านกาแฟใกล้ๆ ทีมงานรับซื้อของเราจะขับรถไปหาคุณตามเวลานัดหมาย เมื่อตรวจสอบเครื่องเรียบร้อย รับเงินโอนเข้าบัญชีเต็มจำนวนทันที จบงานไว ไม่จุกจิก!",
        "หลังจากนั้น นัดหมายสถานที่ที่คุณสะดวกที่สุดในพื้นที่ใกล้ฉัน ทีมงานจะเดินทางไปหาตรงเวลาเป๊ะ ตรวจเช็คการทำงานของเครื่องต่อหน้าคุณ ใช้เวลาไม่เกิน 15 นาที และชำระเงินสดหรือโอนผ่านแอปธนาคารทันที ยืนยันว่าคุณจะได้รับเงินชัวร์ 100% ก่อนส่งมอบเครื่อง",
        "นัดจุดรับเครื่องใกล้บ้านคุณได้เลย เราพร้อมเสิร์ฟบริการถึงที่ ตรวจสอบสภาพเครื่องอย่างโปร่งใส พร้อมทั้งสอนวิธีล้างข้อมูลให้สะอาดหมดจดก่อนรับเครื่องกลับ และแน่นอน... คุณจะได้รับเงินก้อนโอนเข้าบัญชีทันที ณ จุดนัดพบ!"
    ]
};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('-ใกล้ฉัน.astro'));

for (const file of files) {
    const filePath = path.join(PAGES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Extract Keyword and slugPrefix from the ProvincialGrid component
    const gridMatch = content.match(/<ProvincialGrid\s+keyword="([^"]+)"\s+slugPrefix="([^"]+)"/);
    if (!gridMatch) {
        console.log(`Skipping ${file} - no ProvincialGrid found.`);
        continue;
    }
    const keyword = gridMatch[1];
    const slugPrefix = gridMatch[2];

    // Split content to isolate everything between </header> and <ProvincialGrid
    const headerEndRegex = /<\/header>/;
    const gridStartRegex = /<ProvincialGrid/;

    const startMatch = content.match(headerEndRegex);
    const endMatch = content.match(gridStartRegex);

    if (startMatch && endMatch) {
        const startIndex = startMatch.index + startMatch[0].length;
        const endIndex = endMatch.index;
        
        const beforeSection = content.substring(0, startIndex);
        const afterSection = content.substring(endIndex);
        
        // Generate new spun content replacing {KW} with keyword
        const h2_1 = spin(getRandomElement(nearMeTemplates.h2_1)).replace(/\{KW\}/g, keyword);
        const p_1 = spin(getRandomElement(nearMeTemplates.p_1)).replace(/\{KW\}/g, keyword);
        const p_2 = spin(getRandomElement(nearMeTemplates.p_2)).replace(/\{KW\}/g, keyword);
        
        const h2_2 = spin(getRandomElement(nearMeTemplates.h2_2)).replace(/\{KW\}/g, keyword);
        const p_3 = spin(getRandomElement(nearMeTemplates.p_3)).replace(/\{KW\}/g, keyword);
        const p_4 = spin(getRandomElement(nearMeTemplates.p_4)).replace(/\{KW\}/g, keyword);
        
        const h2_3 = spin(getRandomElement(nearMeTemplates.h2_3)).replace(/\{KW\}/g, keyword);
        const p_5 = spin(getRandomElement(nearMeTemplates.p_5)).replace(/\{KW\}/g, keyword);
        const p_6 = spin(getRandomElement(nearMeTemplates.p_6)).replace(/\{KW\}/g, keyword);

		const newSectionContent = `
        <section class="content">
			<TrustBadges className="mb-12 mt-8" />
			<h2>${h2_1}</h2>
			<p>${p_1}</p>
			<p>${p_2}</p>

			<ComparisonTable />
			<StepCards />
			
			<h2>${h2_2}</h2>
			<p>${p_3}</p>
			<p>${p_4}</p>

			<DataPrivacyBlock />

			<h2>${h2_3}</h2>
			<p>${p_5}</p>
			<p>${p_6}</p>
			
			<div class="cta-row" style="margin-top: 3rem; justify-content: center; padding-bottom: 3rem;">
				<a class="btn-line" href="https://line.me/R/ti/p/@webuy" target="_blank" rel="noopener noreferrer" style="font-size: 1.2rem; padding: 1.2rem 2.5rem;">คลิกทัก LINE ประเมินราคาใกล้คุณ!</a>
			</div>
		</section>
		`;

        content = beforeSection + newSectionContent + afterSection;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[REWRITTEN] ${file}`);
    } else {
        console.log(`[ERROR] Could not find </header> or <ProvincialGrid in ${file}`);
    }
}

console.log('All Near Me pages rewritten with unique spun content successfully!');
