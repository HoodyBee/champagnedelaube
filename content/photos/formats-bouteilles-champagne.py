# Illustration originale : les formats de bouteilles de champagne, côte à côte, à l'échelle
# (hauteur proportionnelle à la racine cubique du volume : formes semblables).
from PIL import Image, ImageDraw, ImageFont
F=[("Quart",0.2,"20 cl"),("Demie",0.375,"37,5 cl"),("Bouteille",0.75,"75 cl"),("Magnum",1.5,"1,5 L"),("Jéroboam",3,"3 L"),
("Réhoboam",4.5,"4,5 L"),("Mathusalem",6,"6 L"),("Salmanazar",9,"9 L"),("Balthazar",12,"12 L"),("Nabuchodonosor",15,"15 L"),
("Salomon",18,"18 L"),("Souverain",26.25,"26,25 L"),("Primat",27,"27 L"),("Melchisédech",30,"30 L")]
S=2; W,H=1600*S,900*S
OR=(191,145,64); BRONZE=(138,100,32); ANTH=(30,30,32); CREME=(254,252,247); FILET=(239,230,210); GRIS=(92,86,80); VERT=(52,64,52)
im=Image.new('RGB',(W,H),CREME); d=ImageDraw.Draw(im)
inter=lambda sz,w='Medium': ImageFont.truetype(f'/usr/share/fonts/opentype/inter/Inter-{w}.otf',sz*S)
serif=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',40*S)
d.text((60*S,48*S),"Les formats de bouteilles de champagne",font=serif,fill=ANTH)
d.text((60*S,104*S),"DU QUART AU MELCHISÉDECH, À L'ÉCHELLE",font=inter(18,'SemiBold'),fill=BRONZE)
base=H-200*S; R=0.26; mingap=22*S
k=min(520*S/30**(1/3), (W-120*S-mingap*(len(F)-1))/(R*sum(v**(1/3) for _,v,_ in F)))
hs=[k*v**(1/3) for _,v,_ in F]; ws=[h*R for h in hs]
gap=(W-120*S-sum(ws))/(len(F)-1)
x=60*S
for (nom,v,lab),h,w in zip(F,hs,ws):
  cx=x+w/2; neck=w*0.36; top=base-h
  body_top=base-h*0.62; shoulder=base-h*0.78
  pts=[(x,base),(x,body_top),(cx-neck/2,shoulder),(cx-neck/2,top+h*0.06),(cx+neck/2,top+h*0.06),(cx+neck/2,shoulder),(x+w,body_top),(x+w,base)]
  d.polygon(pts,fill=VERT)
  d.rectangle([cx-neck/2,top,cx+neck/2,top+h*0.16],fill=OR)          # coiffe dorée
  d.rectangle([x+w*0.12,base-h*0.42,x+w*0.88,base-h*0.24],fill=CREME) # étiquette
  d.line([(x+w*0.12,base-h*0.33),(x+w*0.88,base-h*0.33)],fill=OR,width=max(1,int(w*0.03)))
  # légende
  fn=inter(14,'SemiBold'); fl=inter(13,'Regular'); i=[f[0] for f in F].index(nom); o=0 if i%2==0 else 48
  if o: d.line([(cx,base+4*S),(cx,base+(10+o)*S)],fill=FILET,width=S)
  for txt,font,col,dy in ((nom,fn,ANTH,14+o),(lab,fl,GRIS,34+o)):
    tw=d.textlength(txt,font=font); d.text((cx-tw/2,base+dy*S),txt,font=font,fill=col)
  x+=w+gap
d.line([(60*S,base),(W-60*S,base)],fill=FILET,width=2*S)
note="Hauteurs proportionnelles à la racine cubique du volume. Contenances : Comité Champagne et fiche « formats de bouteilles » de champagne.education."
d.text((60*S,H-56*S),note,font=inter(14,'Regular'),fill=GRIS)
im=im.resize((1600,900),Image.LANCZOS)
im.save('formats-bouteilles-champagne.png',optimize=True)
im.convert('RGB').save('formats-bouteilles-champagne.jpg',quality=88,optimize=True)
