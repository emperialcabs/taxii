import subprocess
import re
import base64
import io
import os
from PIL import Image, ImageEnhance, ImageDraw

# 1. Retrieve pristine original 1707x1650 image from git commit 8321181
out = subprocess.check_output(['git', 'show', '8321181:EMPERAL_CABS_App_Logo_Sharp.svg']).decode('utf-8')
match = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', out)
if not match:
    print('Failed to find base64 image in git')
    exit(1)

img_data = base64.b64decode(match.group(1))
src_img = Image.open(io.BytesIO(img_data)).convert('RGBA')

YELLOW_COLOR = (252, 185, 0, 255) # #FCB900

# 2. Crop to tightest bounding box of logo graphic
bbox = src_img.getbbox()
cropped = src_img.crop(bbox)

# 3. Create 2048x2048 4K Ultra-HD Crisp Full-Bleed Logo Image
CANVAS_SIZE = 2048
full_logo_4k = Image.new('RGBA', (CANVAS_SIZE, CANVAS_SIZE), YELLOW_COLOR)

w, h = cropped.size
target_dim = int(CANVAS_SIZE * 0.90) # Crisp, bold, edge-to-edge fill
ratio = min(target_dim / w, target_dim / h)
new_w, new_h = int(w * ratio), int(h * ratio)

resized_car = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Subtle sharpness enhancement for 4K clarity
enhancer = ImageEnhance.Sharpness(resized_car)
resized_car = enhancer.enhance(1.2)

offset_x = (CANVAS_SIZE - new_w) // 2
offset_y = (CANVAS_SIZE - new_h) // 2
full_logo_4k.paste(resized_car, (offset_x, offset_y), resized_car)

# 4. Convert 4K PNG to base64 for SVG
buf = io.BytesIO()
full_logo_4k.save(buf, format='PNG', quality=100)
b64_full = base64.b64encode(buf.getvalue()).decode('utf-8')

new_svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" width="2048" height="2048">
  <rect width="2048" height="2048" fill="#FCB900"/>
  <image href="data:image/png;base64,{b64_full}" width="2048" height="2048"/>
</svg>'''

src_svg_path = r'd:\taxiiiii\EMPERAL_CABS_App_Logo_Sharp.svg'
with open(src_svg_path, 'w', encoding='utf-8') as f:
    f.write(new_svg_content)

print('4K ULTRA-HD CRISP SVG CREATED SUCCESSFULLY!')

# 5. Overwrite all SVG and PNG assets across public and src
target_svgs = [
    r'd:\taxiiiii\public\assets\images\logo.svg',
    r'd:\taxiiiii\public\assets\images\imperial_logo.svg',
    r'd:\taxiiiii\public\assets\images\splash-screen\logo.svg',
    r'd:\taxiiiii\public\assets\images\let-you-screen\logo.svg',
    r'd:\taxiiiii\src\assets\images\logo.svg',
    r'd:\taxiiiii\src\assets\images\splash-screen\logo.svg',
    r'd:\taxiiiii\src\assets\images\let-you-screen\logo.svg',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\logo.svg',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\imperial_logo.svg',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\splash-screen\logo.svg',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\let-you-screen\logo.svg'
]

for p in target_svgs:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(new_svg_content)

target_pngs = [
    r'd:\taxiiiii\public\assets\images\logo.png',
    r'd:\taxiiiii\public\assets\images\splash-screen\logo.png',
    r'd:\taxiiiii\public\assets\images\let-you-screen\logo.png',
    r'd:\taxiiiii\src\assets\images\logo.png',
    r'd:\taxiiiii\src\assets\images\splash-screen\logo.png',
    r'd:\taxiiiii\src\assets\images\let-you-screen\logo.png',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\logo.png',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\splash-screen\logo.png',
    r'd:\taxiiiii\android\app\src\main\assets\public\assets\images\let-you-screen\logo.png'
]

for p in target_pngs:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    full_logo_4k.save(p, 'PNG', quality=100)

# 6. Generate Android Launcher Icons with high-density Lanczos resampling
mipmap_sizes = {
    'mipmap-mdpi': (48, 108),
    'mipmap-hdpi': (72, 162),
    'mipmap-xhdpi': (96, 216),
    'mipmap-xxhdpi': (144, 324),
    'mipmap-xxxhdpi': (192, 432)
}

res_dir = r'd:\taxiiiii\android\app\src\main\res'

def make_full_square_icon(size, graphic_scale=0.88):
    canvas = Image.new('RGBA', (size, size), YELLOW_COLOR)
    w_c, h_c = cropped.size
    target_dim = int(size * graphic_scale)
    ratio = min(target_dim / w_c, target_dim / h_c)
    new_w, new_h = int(w_c * ratio), int(h_c * ratio)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    offset_x = (size - new_w) // 2
    offset_y = (size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

def make_full_round_icon(size, graphic_scale=0.85):
    sq = make_full_square_icon(size, graphic_scale)
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    round_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    round_img.paste(sq, (0, 0), mask)
    return round_img

def make_adaptive_foreground(fg_size, safe_scale=0.68):
    canvas = Image.new('RGBA', (fg_size, fg_size), (0, 0, 0, 0))
    w_c, h_c = cropped.size
    target_dim = int(fg_size * safe_scale)
    ratio = min(target_dim / w_c, target_dim / h_c)
    new_w, new_h = int(w_c * ratio), int(h_c * ratio)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    offset_x = (fg_size - new_w) // 2
    offset_y = (fg_size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

for folder, (icon_sz, fg_sz) in mipmap_sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    sq = make_full_square_icon(icon_sz)
    sq.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG', quality=100)
    
    rd = make_full_round_icon(icon_sz)
    rd.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG', quality=100)
    
    fg = make_adaptive_foreground(fg_sz)
    fg.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG', quality=100)

print('ALL ULTRA-HD 4K ASSETS GENERATED SUCCESSFULLY!')
