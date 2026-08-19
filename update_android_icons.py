import os
from PIL import Image, ImageDraw, ImageEnhance

# Source image explicitly requested by user
src_png_path = r'd:\taxiiiii\src\assets\images\let-you-screen\logo.png'
src_img = Image.open(src_png_path).convert('RGBA')

YELLOW_COLOR = (252, 185, 0, 255) # #FCB900

# Bounding box of non-transparent image or inner car graphic
bbox = src_img.getbbox()
cropped = src_img.crop(bbox)

mipmap_sizes = {
    'mipmap-mdpi': (48, 108),
    'mipmap-hdpi': (72, 162),
    'mipmap-xhdpi': (96, 216),
    'mipmap-xxhdpi': (144, 324),
    'mipmap-xxxhdpi': (192, 432)
}

res_dir = r'd:\taxiiiii\android\app\src\main\res'

def make_full_square_icon(size, graphic_scale=0.90):
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

def make_full_round_icon(size, graphic_scale=0.88):
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

# 1. Update Android Mipmap Launcher & Notification Icons
for folder, (icon_sz, fg_sz) in mipmap_sizes.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # Square launcher icon
    sq = make_full_square_icon(icon_sz)
    sq.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG', quality=100)
    
    # Round launcher icon
    rd = make_full_round_icon(icon_sz)
    rd.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG', quality=100)
    
    # Adaptive foreground launcher icon
    fg = make_adaptive_foreground(fg_sz)
    fg.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG', quality=100)

    # Notification icon
    noti = make_full_square_icon(icon_sz, graphic_scale=0.92)
    noti.save(os.path.join(folder_path, 'ic_notification.png'), 'PNG', quality=100)
    noti.save(os.path.join(folder_path, 'ic_stat_ic_notification.png'), 'PNG', quality=100)

# 2. Update Drawable Notification Icons
make_full_square_icon(96, graphic_scale=0.92).save(os.path.join(res_dir, 'drawable', 'ic_notification.png'), 'PNG', quality=100)
make_full_square_icon(96, graphic_scale=0.92).save(os.path.join(res_dir, 'drawable', 'ic_stat_ic_notification.png'), 'PNG', quality=100)

# 3. Update Android Splash Screens
splash_dirs = {
    'drawable': (480, 800),
    'drawable-port-mdpi': (320, 480),
    'drawable-port-hdpi': (480, 800),
    'drawable-port-xhdpi': (720, 1280),
    'drawable-port-xxhdpi': (960, 1600),
    'drawable-port-xxxhdpi': (1280, 1920),
    'drawable-land-mdpi': (480, 320),
    'drawable-land-hdpi': (800, 480),
    'drawable-land-xhdpi': (1280, 720),
    'drawable-land-xxhdpi': (1600, 960),
    'drawable-land-xxxhdpi': (1920, 1280),
}

def make_splash_screen(width, height):
    canvas = Image.new('RGBA', (width, height), YELLOW_COLOR)
    max_w = int(width * 0.75)
    max_h = int(height * 0.45)
    w_c, h_c = cropped.size
    ratio = min(max_w / w_c, max_h / h_c)
    new_w, new_h = int(w_c * ratio), int(h_c * ratio)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    offset_x = (width - new_w) // 2
    offset_y = (height - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y), resized)
    return canvas

for folder, (w, h) in splash_dirs.items():
    folder_path = os.path.join(res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    spl = make_splash_screen(w, h)
    spl.save(os.path.join(folder_path, 'splash.png'), 'PNG', quality=100)

print('SUCCESSFULLY APPLIED LOGO.PNG TO APP ICON, NOTIFICATION ICON AND SPLASH SCREENS!')
