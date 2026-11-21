"""Lit un dossier de photos (date, GPS, taille, netteté, empreinte pour les doublons) et trouve la commune la plus proche.

    python3 -I scripts/photos-lire.py <dossier des originaux> <dossier de travail>

Les communes viennent de geo.api.gouv.fr (téléchargées une fois dans le dossier de travail : com10.json, com51.json…) ;
les coordonnées des photos ne sont jamais envoyées à un service extérieur. Écrit <travail>/meta.json et des planches-contact
numérotées (<travail>/planches/pNN.jpg) pour le tri à l'œil (Pétré, visages, flou, cépage).
"""
import glob, json, math, os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageStat

src, travail = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(travail, "planches"), exist_ok=True)
communes = []
for f in glob.glob(os.path.join(travail, "com*.json")):
    for c in json.load(open(f)):
        if c.get("centre"):
            lon, lat = c["centre"]["coordinates"]
            communes.append((c["nom"], c["codeDepartement"], lat, lon))

def dms(v, ref):
    d, m, s = [float(x) for x in v]
    r = d + m / 60 + s / 3600
    return -r if ref in ("S", "W") else r

def proche(lat, lon):
    if not communes or lat < 46 or lat > 51.2 or lon < -5 or lon > 8.3:
        return None, None
    b = min(communes, key=lambda c: (c[2] - lat) ** 2 + ((c[3] - lon) * math.cos(math.radians(lat))) ** 2)
    return b[0], b[1]

out = []
for f in sorted(os.listdir(src)):
    if not f.lower().endswith((".jpg", ".jpeg", ".png", ".heic")):
        continue
    try:
        im = Image.open(os.path.join(src, f))
    except Exception as e:  # HEIC sans pillow-heif : à convertir d'abord
        out.append({"f": f, "erreur": str(e)}); continue
    ex = im.getexif(); dt = ex.get_ifd(0x8769).get(36867) or ex.get(306); g = ex.get_ifd(0x8825); gps = None
    if g and 2 in g and 4 in g:
        gps = [round(dms(g[2], g.get(1, "N")), 6), round(dms(g[4], g.get(3, "E")), 6)]
    petit = ImageOps.exif_transpose(im.copy()); petit.thumbnail((800, 800))
    nettete = ImageStat.Stat(petit.convert("L").filter(ImageFilter.FIND_EDGES)).var[0]
    gris = petit.convert("L").resize((9, 8)); p = list(gris.getdata())
    empreinte = "".join("1" if p[r * 9 + c] > p[r * 9 + c + 1] else "0" for r in range(8) for c in range(8))
    commune, dep = proche(*gps) if gps else (None, None)
    out.append({"f": f, "w": im.width, "h": im.height, "dt": dt, "gps": gps, "commune": commune, "dep": dep, "nettete": round(nettete, 1), "empreinte": empreinte})
out.sort(key=lambda o: o.get("dt") or "")
for i, o in enumerate(out):
    o["n"] = i + 1
json.dump(out, open(os.path.join(travail, "meta.json"), "w"), indent=0)

police = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
T = 300
for s in range(0, len(out), 20):
    feuille = Image.new("RGB", (5 * T, 4 * (T + 26)), "white"); d = ImageDraw.Draw(feuille)
    for k, o in enumerate(out[s : s + 20]):
        if "erreur" in o:
            continue
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, o["f"]))); im.thumbnail((T, T))
        x, y = (k % 5) * T, (k // 5) * (T + 26)
        feuille.paste(im, (x + (T - im.width) // 2, y + 26 + (T - im.height) // 2))
        d.text((x + 4, y + 2), f"#{o['n']} {(o['dt'] or '')[:10]} {(o['commune'] or '')[:12]}", fill="black", font=police)
    feuille.save(os.path.join(travail, "planches", f"p{s // 20 + 1:02d}.jpg"), quality=70)
print(f"{len(out)} photos lues, {sum(1 for o in out if o.get('gps'))} avec GPS.")
