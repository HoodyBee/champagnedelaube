"""Prépare les photos retenues pour Sanity : redressées, 2400 px maximum (grand côté), qualité 80, TOUTES les
métadonnées supprimées (GPS, date, appareil…), puis auteur et copyright ajoutés (EXIF + XMP), et nom de fichier SEO.

    python3 -I scripts/photos-preparer.py <dossier des originaux> <selection.json> <dossier de sortie>

selection.json : [{"original": "PXL_….jpg", "fichier": "vendanges-champagne-cote-des-bar-2026.jpg"}, …]
"""
import json, os, sys
from PIL import Image, ImageOps

src, sel, sortie = sys.argv[1:4]
os.makedirs(sortie, exist_ok=True)
CREDIT = "© Champagne de l'Aube / Detectezmoi.com"
XMP = (
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
    '<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/">'
    "<dc:creator><rdf:Seq><rdf:li>Champagne de l'Aube / Detectezmoi.com</rdf:li></rdf:Seq></dc:creator>"
    f'<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{CREDIT}</rdf:li></rdf:Alt></dc:rights><photoshop:Credit>{CREDIT}</photoshop:Credit>'
    '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>'
).encode("utf-8")
noms = set()
for p in json.load(open(sel)):
    assert p["fichier"] not in noms, f"Nom en double : {p['fichier']}"
    noms.add(p["fichier"])
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, p["original"]))).convert("RGB")
    im.thumbnail((2400, 2400), Image.LANCZOS)
    exif = Image.Exif()
    exif[315] = "Champagne de l'Aube / Detectezmoi.com"  # Artist
    exif[33432] = "Copyright Champagne de l'Aube / Detectezmoi.com"  # Copyright (ASCII : le © est dans le XMP)
    im.save(os.path.join(sortie, p["fichier"]), "JPEG", quality=80, optimize=True, progressive=True, exif=exif.tobytes(), xmp=XMP)
# Contrôle : seuls l'auteur et le copyright restent.
for f in os.listdir(sortie):
    e = Image.open(os.path.join(sortie, f)).getexif()
    assert set(e.keys()) <= {315, 33432} and not e.get_ifd(0x8825) and not e.get_ifd(0x8769), f"Métadonnées restantes : {f}"
print(f"{len(noms)} photos prêtes dans {sortie}.")
