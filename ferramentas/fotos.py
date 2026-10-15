from PIL import Image, ImageOps
import glob, os, sys, json
SRC = "/mnt/user-data/uploads/2026_2_Índia, Nepal e Itália/App"
OUT = "/home/claude/indaly-build/fotos-app"
R = 8 / 3
foco = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
for f in sorted(glob.glob(SRC + "/1*.jpg")):
    nome = os.path.basename(f)[:-4]
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    w, h = im.size
    if w / h > R:
        nw = int(h * R); x = int((w - nw) * foco.get(nome, [0.5, 0.5])[0]); im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / R); y = int((h - nh) * foco.get(nome, [0.5, 0.5])[1]); im = im.crop((0, y, w, y + nh))
    W = min(1200, max(im.size[0], 900))
    im = im.resize((W, int(W / R)), Image.LANCZOS)
    im.save(f"{OUT}/foto-{nome}.jpg", quality=82, optimize=True, progressive=True)
ims = [Image.open(p) for p in sorted(glob.glob(OUT + "/foto-*.jpg"))]
t = [i.resize((480, 180)) for i in ims]
o = Image.new("RGB", (480, len(t) * 184), "white")
for k, i in enumerate(t): o.paste(i, (0, k * 184))
o.save("/tmp/claude-0/-home-claude-indaly/d2b406ff-211b-5ed6-a605-a4d57879fdec/scratchpad/fotos/cortes.jpg", quality=70)
print([(os.path.basename(p), os.path.getsize(p)//1024) for p in sorted(glob.glob(OUT + "/foto-*.jpg"))])
