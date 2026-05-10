import os
from google import genai

# 1. ตั้งค่า Client (ใช้ API Key ของคุณ)
client = genai.Client(api_key="AIzaSyBMVZ-BoK0NsJwIDGo6VHq2SfWXOIMT0hQ")

def read_astro_project(target_dir):
    context = ""
    if not os.path.exists(target_dir): return None
    for root, dirs, files in os.walk(target_dir):
        if any(x in root for x in ['node_modules', 'dist', '.astro']): continue
        for file in files:
            if file.endswith(('.astro', '.ts', '.js', '.json')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, target_dir)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        context += f"\n--- FILE: {relative_path} ---\n{f.read()[:3000]}\n"
                except: continue
    return context

# 2. อ่านโค้ดโปรเจค
project_context = read_astro_project("./src")

if project_context:
    # 3. ลองใช้ชื่อโมเดลแบบ Generic ที่สุดสำหรับ SDK ใหม่
    # ใน SDK ใหม่ มักจะใช้ชื่อรหัสรุ่นไปเลย ไม่ต้องมีคำว่า models/
    target_model = "gemini-2.5-pro"

    print(f"กำลังส่งข้อมูลให้ {target_model} วิเคราะห์...")
    
    prompt = f"""
    คุณเป็นผู้เชี่ยวชาญด้าน SEO, AEO และ GEO 
    วิเคราะห์โค้ด Astro ของโปรเจค 'webuy-thai' ต่อไปนี้:
    {project_context}
    
    ช่วยแนะนำ:
    1. การปรับปรุง HTML Semantic และ Schema Markup
    2. การทำ Local SEO ให้คนหาคำว่า 'รับซื้อโน้ตบุ๊ก' แล้วเจอเรา
    3. ตรวจสอบว่าใช้คำว่า 'โน้ตบุ๊ก' (มี ก ไก่ การันต์) และ 'เทิร์น' ถูกต้องหรือไม่
    """

    try:
        response = client.models.generate_content(
            model=target_model,
            contents=prompt
        )
        print("\n--- ผลการวิเคราะห์ ---")
        print(response.text)
        
    except Exception as e:
        print(f"\n[!] เกิดข้อผิดพลาดในการเรียก {target_model}: {e}")
        print("\nกำลังดึงรายชื่อโมเดลที่บัญชีนี้ใช้ได้จริงมาให้ดูครับ...")
        # แก้ไข AttributeError โดยใช้ supported_actions ตามที่เครื่องแจ้งมา
        for m in client.models.list():
            try:
                print(f"- ชื่อโมเดลที่ใช้ได้: {m.name} (Actions: {m.supported_actions})")
            except:
                print(f"- ชื่อโมเดลที่ใช้ได้: {m.name}")
else:
    print("ไม่พบไฟล์ในโฟลเดอร์ src")