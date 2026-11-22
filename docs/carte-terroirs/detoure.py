import cv2,numpy as np,json,sys
def formes(path, scale_to=(1440,1080), labels=None, roi=None):
  im=cv2.imread(path); im=cv2.resize(im,scale_to,interpolation=cv2.INTER_AREA)
  hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV); H,S,V=[hsv[...,i].astype(int) for i in range(3)]
  M={
   'cote-des-bar': (H>=88)&(H<=110)&(S>=90)&(V>=95),
   'les-riceys':   ((H>=160)|(H<=5))&(S>=90)&(V>=110),
   'montgueux':    (H>=10)&(H<=35)&(S>=90)&(V>=110),
   'villenauxe':   (H>=45)&(H<=75)&(S>=80)&(V>=80),
  }
  out={}
  for k,m in M.items():
    m=(m.astype(np.uint8))*255
    if labels:  # masque les étiquettes (petits carrés de couleur)
      for (x,y,w,h) in labels: m[y:y+h,x:x+w]=0
    if roi and k in roi:  # zone de recherche du terroir (fractions de l'image)
      x0,y0,x1,y1=roi[k]; Hh,Ww=m.shape; z=np.zeros_like(m); z[int(y0*Hh):int(y1*Hh),int(x0*Ww):int(x1*Ww)]=1; m=m*z
    if k=='cote-des-bar':
      # enlève les fines lignes bleues du fond (rivières) avant de combler les courbes de niveau
      m=cv2.morphologyEx(m,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
      m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)),iterations=2)
    else:
      m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)),iterations=1)
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    cs=[c for c in cs if cv2.contourArea(c)>(60 if k!='cote-des-bar' else 1500)]
    polys=[]
    for c in sorted(cs,key=cv2.contourArea,reverse=True):
      a=cv2.approxPolyDP(c,1.6,True)
      polys.append([[int(p[0][0]),int(p[0][1])] for p in a])
    out[k]=polys
  return out,im
ROI={'cote-des-bar':(0.55,0.45,0.97,0.93),'les-riceys':(0.6,0.78,0.73,0.9),'montgueux':(0.37,0.47,0.43,0.53),'villenauxe':(0.16,0.2,0.23,0.27)}
LABELS=[(150,170,265,65),(445,455,265,65),(590,565,155,50),(960,652,290,62),(820,822,248,62),(1290,25,125,125),(1220,1035,215,40)]
if __name__=='__main__':
  f,im=formes(sys.argv[1],labels=LABELS,roi=ROI)
  for k,v in f.items(): print(k,len(v),'formes',[len(p) for p in v][:8], 'aire', [int(cv2.contourArea(np.array(p))) for p in v][:6])
  dbg=im.copy()
  col={'cote-des-bar':(255,200,0),'les-riceys':(255,0,255),'montgueux':(0,255,255),'villenauxe':(0,255,0)}
  for k,v in f.items():
    for p in v: cv2.polylines(dbg,[np.array(p)],True,col[k],2)
  cv2.imwrite(sys.argv[2],dbg); json.dump(f,open(sys.argv[3],'w'))
