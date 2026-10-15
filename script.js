'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const cv=$('#c'),g=cv.getContext('2d'),hg=$('#hero').getContext('2d'),app=$('#app'),VW=800,VH=450,GY=380;
let SC=1;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),
 R=i=>Math.abs(Math.sin(i*91.7)*1000%1),ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

/* ---------- Suara (Web Audio, tanpa file) ---------- */
let AC;
function snd(f,d=.1,t='square',v=.07,f2){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const n=AC.currentTime,o=AC.createOscillator(),a=AC.createGain();o.type=t;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);a.gain.setValueAtTime(v,n);a.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(a);a.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}
const seq=(a,d,t)=>a.forEach((f,i)=>setTimeout(()=>snd(f,d,t,.08),i*d*600));
const SFX={jump:()=>snd(320,.2,'square',.05,720),coin:()=>seq([988,1319],.12,'square'),star:()=>seq([523,659,784,1047],.18,'triangle'),
 hurt:()=>snd(240,.35,'sawtooth',.08,60),stomp:()=>snd(180,.15,'square',.08,520),shield:()=>snd(400,.4,'sine',.1,1200),
 win:()=>seq([523,659,784,1047,784,1047,1319],.25,'triangle')};


/* ---------- Musik latar (dibuat dengan kode, tanpa file) ---------- */
let MU=1,mTimer=0,mTrack=-2,mStep=0,mNext=0,unlocked=0;
const ac=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC};
const NOTE=n=>440*Math.pow(2,(n-69)/12),lead=t=>t.split(' ').map(x=>x==='.'?null:+x);
const SONGS=[
 {bpm:132,root:72,w:'square',bass:[48,53,55,48],lead:lead('0 . 4 . 7 4 0 . 2 . 5 . 9 5 2 . 4 7 11 7 4 . 0 . -1 2 5 2 0 . . .')},
 {bpm:142,root:69,w:'square',bass:[45,41,43,45],lead:lead('0 . 3 . 7 . 3 0 -2 . 2 5 7 5 2 . 0 3 7 12 7 3 0 . -2 2 5 2 0 . . .')},
 {bpm:152,root:62,w:'sawtooth',bass:[38,34,36,38],lead:lead('0 . 0 3 . 7 . 3 0 . 0 3 . 8 . 7 5 . 5 3 . 7 . 3 2 . 3 . 0 . . .')},
 {bpm:152,root:72,w:'triangle',bass:[48,53,55,48],lead:lead('0 4 7 12 7 4 7 12 2 5 9 14 9 5 9 14 4 7 11 16 11 7 4 . 0 . 4 . 7 . 12 .')},
 {bpm:108,root:72,w:'sine',bass:[48,53,55,48],lead:lead('0 . 4 . 7 . 4 . 5 . 9 . 12 . 9 . 7 . 11 . 14 . 11 . 4 . 7 . 0 . . .')}];
SONGS[5]={...SONGS[3],bpm:178};
function tone(f,d,type,v,t){const a=ac(),o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn);gn.connect(a.destination);o.start(t);o.stop(t+d+.02)}
function sched(){const s=SONGS[mTrack];if(!s)return;const sd=60/s.bpm/2;
 while(mNext<AC.currentTime+.3){const n=mStep%32,l=s.lead[n],bar=Math.floor(n/8)%4;
  if(l!=null)tone(NOTE(s.root+l),sd*.9,s.w,.04,mNext);
  if(n%2===0)tone(NOTE(s.bass[bar]+(n%8===4?7:0)),sd*1.8,'triangle',.07,mNext);
  mNext+=sd;mStep++}}
function mus(i){if(i===mTrack&&(mTimer||i<0))return;clearInterval(mTimer);mTimer=0;mTrack=i;if(i<0)return;
 try{ac()}catch(e){return}mStep=0;mNext=AC.currentTime+.1;mTimer=setInterval(sched,60)}
function refreshMusic(){if(!unlocked||!MU||document.hidden)return mus(-1);
 mus(mode==='play'?L.i:mode==='menu'||mode==='done'?4:mode==='win'?5:-1)}
function unlock(){if(unlocked)return;unlocked=1;try{ac()}catch(e){}refreshMusic()}
addEventListener('pointerdown',unlock);addEventListener('keydown',unlock);
document.addEventListener('visibilitychange',refreshMusic);

/* ---------- Data level ---------- */
const row=(x,y,n,s=38)=>Array.from({length:n},(_,i)=>[x+i*s,y]);
const arc=(x,n,s=36,h=70)=>Array.from({length:n},(_,i)=>[x+i*s,GY-24-Math.sin(i/(n-1)*Math.PI)*h]);
const LV=[
{n:'Hutan Komentar',W:2700,goal:2580,gaps:[],pl:[[520,290,130],[950,280,150],[1450,290,130],[1900,265,170]],
 sp:[400,720,1060,1300,1650,2050,2250],mo:[],fr:[],sh:[[2040,230]],
 st:[[585,250],[1020,240],[1515,250],[1940,225]],
 co:[...arc(360,5),...arc(680,5),...row(545,255,3),...arc(1020,5),...row(975,245,4),...arc(1260,5),...arc(1610,5),...row(1930,230,3),...arc(2010,5),...arc(2210,5),...row(2350,GY-24,4)]},
{n:'Kota Internet',W:3000,goal:2920,gaps:[[620,100],[1320,110],[2040,120]],pl:[[1000,290,130],[1700,285,130],[2450,290,130]],
 sp:[350,880,1520,1900,2260,2700],mo:[[760,960,1.2],[1480,1700,1.4],[2200,2420,1.6]],fr:[2800],sh:[[1100,235]],
 st:[[1030,250],[1760,240],[2510,250]],
 co:[...arc(590,7,32,100),...arc(330,5),...arc(860,5),...row(1010,255,3),...arc(1280,7,32,100),...arc(1500,5),...row(1720,250,3),...arc(2000,8,32,100),...arc(2240,5),...arc(2680,5)]},
{n:'Benteng Monster Bully',W:3200,goal:3150,gaps:[[760,100],[1500,110]],pl:[[520,300,100],[1050,290,120],[1300,250,100],[1850,295,120],[2100,260,130]],
 sp:[400,950,1200,1750,2300],mo:[[900,1100,1.4],[1700,1900,1.5],[2000,2200,1.6]],fr:[3080],boss:{x0:2550,x1:2950},
 sh:[[1130,250],[1370,215],[2180,220]],st:[[560,260],[1080,250],[1340,210]],
 co:[...arc(360,5),...arc(730,6,32,100),...row(540,265,3),...arc(930,5),...row(1070,255,3),...row(1320,215,3),...arc(1470,7,32,100),...arc(1660,5),...row(1870,260,3),...row(2120,225,3),...arc(2260,5)]},
{n:'Dunia Digital Ceria',W:3600,goal:3520,gaps:[[520,110],[1150,120],[1800,120],[2500,120],[3000,110]],pl:[[900,290,120],[1500,280,130],[2150,270,120],[2750,285,130]],
 sp:[380,780,1350,2000,2300,3300],mo:[[700,900,1.5],[1300,1600,1.6,1],[1950,2250,1.7,1],[2650,2900,1.8],[3150,3400,1.9,1]],fr:[1700,2400,3450],
 sh:[[1000,245],[2790,245]],st:[[950,250],[1560,240],[2200,230],[2810,245]],
 co:[...arc(340,5),...arc(480,7,32,100),...arc(740,5),...row(910,255,3),...arc(1110,7,32,100),...arc(1330,5),...row(1520,245,4),...arc(1760,8,32,100),...arc(1990,5),...arc(2270,5),...row(2170,235,3),...arc(2460,8,32,100),...row(2770,250,4),...arc(2960,7,32,100),...arc(3280,5)]}
];
const TH=[['#3d9b4f','#7ed957'],['#4c4f9c','#7986f0'],['#4a2a7a','#9c5fe0'],['#43a047','#c6ff6e']];
const END=['Hutan Komentar sudah bersih! Kamu keren!','Temanmu selamat! Kota Internet kembali aman.','Monster Bully kalah! Bentengnya runtuh.'];

/* ---------- Status ---------- */
let L,P,G,mode='menu',T=0,cam=0,shake=0,msgCd=0,tt,last=0,PA=[],firstKill=0;
const K={L:0,R:0,J:0,Jp:0,Ap:0};
function setMode(m){mode=m;app.dataset.m=m;refreshMusic()}
function show(id){$$('.scr').forEach(s=>s.classList.toggle('on',s.id===id))}
function say(t,ms=2800){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),ms)}
function snap(){G.sn={score:G.score,coins:G.coins,fr:G.fr}}
function newGame(){G={score:0,coins:0,fr:0,lives:3,sh:0,sawS:0};startLevel(0)}
function startLevel(i,keep){if(!G)G={score:0,coins:0,fr:0,lives:3,sh:0,sawS:0};
 if(keep){Object.assign(G,G.sn)}else snap();
 G.lives=3;G.sh=0;load(i);firstKill=0;PA=[];show('none');setMode('play');say('Level '+(i+1)+' — '+L.d.n,3000)}
function load(i){const d=LV[i],sol=[];let x=0;
 for(const[gx,gw]of d.gaps){sol.push({x,y:GY,w:gx-x,g:1});x=gx+gw}
 sol.push({x,y:GY,w:d.W-x,g:1});d.pl.forEach(([a,b,c])=>sol.push({x:a,y:b,w:c}));
 const it=a=>a.map(([x,y])=>({x:x-15,y:y-15,w:30,h:30})),em=['🐱','🐶','🐰','🐼'];
 L={i,d,W:d.W,goal:d.goal,nf:d.fr.length,rs:0,sol,co:it(d.co),st:it(d.st),sh:it(d.sh),pr:[],
  sp:d.sp.map(x=>({x:x+3,y:GY-30,w:28,h:30,tx:['Cupu!','Jelek!','Payah!','Hoax!'][Math.floor(R(x)*4)]})),
  mo:d.mo.map(([a,b,v,f])=>({x:a,x0:a,x1:b,v,w:32,h:30,y:f?GY-95:GY-30,f,ph:R(a)*6})),
  fr:d.fr.map((x,j)=>({x,y:GY-36,w:34,h:36,em:em[(i+j)%4],t:0})),
  boss:d.boss?{x:d.boss.x1,x0:d.boss.x0,x1:d.boss.x1,y:GY-70,w:70,h:70,v:-1.4,hp:3,inv:0,cd:90}:null};
 P={x:60,y:GY-40,w:24,h:40,vx:0,vy:0,f:1,gr:0,coy:0,buf:0,inv:0,sh:0,sq:1,safe:60};cam=0}

/* ---------- Efek ---------- */
function burst(x,y,n,c,s=4){for(let i=0;i<n;i++)PA.push({x,y,vx:rnd(-s,s),vy:rnd(-s,s/2),l:rnd(25,50),c,r:rnd(2,5)})}
const dust=(x,y,n)=>burst(x,y,n,'#ffffffaa',2);
const pop=(x,y,t)=>PA.push({x,y,vx:0,vy:-1.2,l:50,t});
function confetti(){for(let i=0;i<120;i++)PA.push({x:cam+rnd(0,VW),y:rnd(-300,0),vx:rnd(-1,1),vy:rnd(1,3.5),l:rnd(160,260),c:['#ffd600','#69f0ae','#b388ff','#40c4ff','#ff80ab'][i%5],r:rnd(3,6),cf:1})}

/* ---------- Aksi pemain ---------- */
function hurt(fall){const p=P;if(!fall&&(p.inv>0||p.sh>0))return;
 G.lives--;SFX.hurt();shake=14;burst(p.x+12,p.y+20,14,'#ff5252');
 if(G.lives<=0){setMode('over');show('over');return}
 p.inv=110;if(fall){p.x=p.safe;p.y=GY-p.h;p.vy=0}else{p.vy=-8;p.x=clamp(p.x-p.f*34,0,L.W-p.w)}}
function useShield(){if(P.sh>0)return;if(G.sh>0){G.sh--;P.sh=420;SFX.shield()}else if(msgCd<=0){say('Cari Perisai Kebaikan 🛡️ dulu!',1800);msgCd=120}}
function killMon(m,stomp){m.dead=1;G.score+=50;SFX.stomp();burst(m.x+16,m.y+15,12,'#ff80ab');pop(m.x,m.y,'+50');if(stomp)P.vy=-10;
 if(!firstKill){firstKill=1;say('Kekuatan positif mengalahkan komentar jahat!')}}
function finish(){G.score+=500;SFX.win();confetti();
 if(L.i<3){setMode('done');$('#dT').textContent=END[L.i];$('#dS').textContent='Skor: '+G.score;show('done')}
 else{setMode('win');$('#wS').textContent='Skor akhir: '+G.score+' · Koin: '+G.coins;
  const b=[['🏅 Pahlawan Kebaikan',G.sawS],['🤝 Pelindung Teman',G.fr>=4],['🦸 Pahlawan Siber',1]];
  $('#bd').innerHTML=b.map(([t,o])=>'<span class="bdg'+(o?'':' off')+'">'+t+'</span>').join('');show('win')}}

/* ---------- Update ---------- */
function upd(dt){T+=dt;const p=P,k=dt,py=p.y;
 const ax=(K.R?1:0)-(K.L?1:0);p.vx=ax*4.4;if(ax)p.f=ax;
 p.coy-=k;p.buf-=k;msgCd-=k;if(K.Jp){p.buf=8;K.Jp=0}if(K.Ap){K.Ap=0;useShield()}
 if(p.buf>0&&p.coy>0){p.vy=-13;p.buf=p.coy=0;p.sq=1.3;SFX.jump();dust(p.x+12,p.y+40,6)}
 if(!K.J&&p.vy<-5)p.vy*=.9;
 p.vy=Math.min(p.vy+.62*k,16);const fall=p.vy>0;
 p.x=clamp(p.x+p.vx*k,0,L.W-p.w);p.y+=p.vy*k;
 const was=p.gr;p.gr=0;
 if(p.vy>=0)for(const s of L.sol)if(p.x+p.w-4>s.x&&p.x+4<s.x+s.w&&py+p.h<=s.y+2&&p.y+p.h>=s.y){p.y=s.y-p.h;p.vy=0;p.gr=1;p.coy=7;if(s.g&&p.x>s.x+50&&p.x<s.x+s.w-80)p.safe=p.x;break}
 if(p.gr&&!was){p.sq=.75;dust(p.x+12,p.y+40,5)}
 p.sq+=(1-p.sq)*.2*k;
 if(p.y>VH+60)hurt(1);
 p.inv-=k;if(p.sh>0)p.sh-=k;shake=Math.max(0,shake-k);
 const hb={x:p.x+3,y:p.y+4,w:p.w-6,h:p.h-4};
 const take=(a,fn)=>a.forEach(o=>{if(!o.got&&ov(hb,o)){o.got=1;fn(o,o.x+15,o.y+15)}});
 take(L.co,(o,x,y)=>{G.coins++;G.score+=10;SFX.coin();burst(x,y,6,'#ffd600');pop(x,y,'+10')});
 take(L.st,(o,x,y)=>{G.score+=50;SFX.star();burst(x,y,12,'#fff59d');pop(x,y,'+50')});
 take(L.sh,(o,x,y)=>{G.sh=Math.min(3,G.sh+1);G.sawS=1;SFX.shield();burst(x,y,14,'#40c4ff');say('Lindungi dirimu, simpan bukti, dan laporkan perundungan.',3800)});
 for(const s of L.sp){if(s.dead)continue;
  if(ov(hb,s)){if(p.sh>0){s.dead=1;G.score+=20;SFX.stomp();burst(s.x+14,s.y+15,10,'#ff5252');pop(s.x,s.y,'+20')}else hurt()}
  else if(!s.pass&&p.x>s.x+s.w+10){s.pass=1;G.score+=5;if(msgCd<=0){say('Kata-kata bisa menyakiti. Yuk, gunakan kata-kata yang baik!');msgCd=420}}}
 for(const m of L.mo){if(m.dead)continue;m.x+=m.v*k;if(m.x<m.x0||m.x>m.x1)m.v*=-1;
  if(m.f)m.y=GY-95+Math.sin(T*.05+m.ph)*22;
  if(ov(hb,m)){if(fall&&py+p.h<=m.y+m.h*.7)killMon(m,1);else if(p.sh>0)killMon(m,0);else hurt()}}
 const b=L.boss;
 if(b&&!b.dead){b.x+=b.v*k*(1+(3-b.hp)*.3);if(b.x<b.x0||b.x>b.x1)b.v*=-1;b.inv-=k;b.cd-=k;
  if(b.cd<=0&&Math.abs(p.x-b.x)<650&&p.x<b.x+20){b.cd=110+b.hp*20;L.pr.push({x:b.x,y:GY-24,w:30,h:24,vx:-3.4})}
  if(ov(hb,b)&&b.inv<=0){
   if((fall&&py+p.h<=b.y+30)||p.sh>0){b.hp--;b.inv=70;p.vy=-11;SFX.stomp();shake=10;burst(b.x+35,b.y+35,16,'#e040fb');
    if(b.hp<=0){b.dead=1;G.score+=500;SFX.star();burst(b.x+35,b.y+35,40,'#ffd600',7);say('Monster Bully kalah! Kebaikan menang!',3200)}}
   else hurt()}}
 L.pr=L.pr.filter(q=>{q.x+=q.vx*k;if(ov(hb,q)){if(p.sh>0){G.score+=10;burst(q.x,q.y,8,'#ff5252')}else hurt();return false}return q.x>cam-80});
 for(const f of L.fr){if(f.saved){f.t+=k;continue}
  if(ov(hb,f)){if(b&&!b.dead){if(msgCd<=0){say('Kalahkan Monster Bully dulu!',2000);msgCd=200}}
   else{f.saved=1;L.rs++;G.fr++;G.score+=200;SFX.star();burst(f.x+17,f.y+10,20,'#ff80ab',5);pop(f.x,f.y,'+200');say('Pahlawan sejati membantu teman yang dirundung.',3400)}}}
 const open=L.rs>=L.nf&&(!b||b.dead);
 if(p.x+p.w>L.goal&&p.x<L.goal+44){if(open)finish();else if(msgCd<=0){say(b&&!b.dead?'Kalahkan Monster Bully dan selamatkan temanmu!':'Selamatkan semua temanmu dulu!',2400);msgCd=200}}
 cam+=(clamp(p.x-300,0,L.W-VW)-cam)*.12;
}

/* ---------- Gambar ---------- */
const circ=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h)}
const emo=(t,x,y,s=24)=>{g.font=s+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y)};
function hero(c,x,y,f,t,run){c.save();c.translate(x,y);c.scale(f,1);const w=run?Math.sin(t*.4):0;
 c.fillStyle='#8e44ff';c.beginPath();c.moveTo(-6,-27);c.quadraticCurveTo(-22-w*3,-14,-18+w*2,-1);c.lineTo(-4,-8);c.fill();
 c.fillStyle='#1a49b8';c.fillRect(-7,-9,6,9+w*2);c.fillRect(1,-9,6,9-w*2);
 c.fillStyle='#2979ff';rr(c,-9,-26,18,19,6);c.fill();
 c.font='10px serif';c.textAlign='center';c.textBaseline='middle';c.fillText('⭐',0,-17);
 circ(c,0,-31,10,'#ffd9b3');c.fillStyle='#ffd600';rr(c,-11,-36,22,8,4);c.fill();
 c.fillStyle='#fff';c.fillRect(-7,-35,5,5);c.fillRect(2,-35,5,5);c.fillStyle='#222';c.fillRect(-5,-34,3,3);c.fillRect(4,-34,3,3);
 c.strokeStyle='#c2185b';c.lineWidth=1.5;c.beginPath();c.arc(0,-29,4,.2,2.9);c.stroke();c.restore()}
function mon(x,y,w,h,col,t){g.save();g.translate(x+w/2,y+h/2);const s=w/32,b=Math.sin(t*.15)*1.5;g.scale(s,s);
 circ(g,0,b,16,col);g.fillStyle='#ffd600';[-9,9].forEach(a=>{g.beginPath();g.moveTo(a-4,-9);g.lineTo(a,-18+b);g.lineTo(a+4,-9);g.fill()});
 circ(g,-6,-2,5,'#fff');circ(g,6,-2,5,'#fff');circ(g,-5,-1,2.4,'#222');circ(g,7,-1,2.4,'#222');
 g.strokeStyle='#222';g.lineWidth=2;g.beginPath();g.moveTo(-11,-8);g.lineTo(-2,-5);g.moveTo(11,-8);g.lineTo(2,-5);g.moveTo(-5,8);g.quadraticCurveTo(0,4,5,8);g.stroke();g.restore()}
function bub(x,y,w,h,tx,c){rr(g,x,y,w,h-6,8);g.fillStyle=c;g.fill();g.beginPath();g.moveTo(x+6,y+h-7);g.lineTo(x+5,y+h);g.lineTo(x+16,y+h-7);g.fill();g.fillStyle='#fff';g.font='bold 11px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(tx,x+w/2,y+(h-6)/2)}
function bg(){const i=L.i,c=[['#5fd0ff','#b9f6ca'],['#1a1f6e','#8e5bd6'],['#150a2e','#5b1a9a'],['#38bdf8','#f5d0fe']][i];
 const gr=g.createLinearGradient(0,0,0,VH);gr.addColorStop(0,c[0]);gr.addColorStop(1,c[1]);g.fillStyle=gr;g.fillRect(0,0,VW,VH);
 const px=(f,gap,fn)=>{const o=-(cam*f)%gap,b=Math.floor(cam*f/gap);for(let k=-1;o+k*gap<VW+gap;k++)fn(o+k*gap,b+k)};
 if(i==0){circ(g,660,80,42,'#fff176');px(.25,300,(x,j)=>circ(g,x+150,GY+30,140+R(j)*50,'#2e9e6b'));
  g.globalAlpha=.4;g.fillStyle='#fff';px(.4,260,(x,j)=>emo('💬',x,50+R(j)*110,34));g.globalAlpha=1;
  px(.55,170,(x,j)=>{const h=70+R(j)*50;g.fillStyle='#6d4c41';g.fillRect(x+20,GY-h,14,h);circ(g,x+27,GY-h-8,34,'#1b8a4a');circ(g,x+14,GY-h+8,22,'#23a85a')})}
 if(i==1){g.fillStyle='#fff';px(.1,90,(x,j)=>g.fillRect(x,R(j)*200,2,2));circ(g,640,80,34,'#fffde7');
  [[.35,130,'#3b3f9e',120],[.6,160,'#272a80',90]].forEach(([f,gap,col,mh])=>px(f,gap,(x,j)=>{const h=mh+R(j)*150;g.fillStyle=col;g.fillRect(x,GY-h,gap-30,h);g.fillStyle='#ffe082';for(let a=0;a<h-20;a+=24)for(let b=8;b<gap-40;b+=22)if(R(j*7+a+b)>.45)g.fillRect(x+b,GY-h+10+a,8,10)}))}
 if(i==2){px(.5,200,(x,j)=>{g.fillStyle='#2f1860';g.fillRect(x,0,60,GY);g.fillStyle='#ffffff10';for(let y=0;y<GY;y+=30)g.fillRect(x,y,60,3);g.globalAlpha=.8+Math.sin(T*.2+j)*.2;emo('🔥',x+30,150,30);g.globalAlpha=1});
  px(.8,420,(x,j)=>emo('🦇',x+Math.sin(T*.03+j)*40,70+R(j)*60+Math.sin(T*.1)*8,26))}
 if(i==3){['#ff5252','#ffab40','#ffee58','#69f0ae','#40c4ff','#b388ff'].forEach((col,j)=>{g.strokeStyle=col;g.lineWidth=14;g.beginPath();g.arc(480-cam*.1,470,330-j*14,Math.PI,0);g.stroke()});
  g.globalAlpha=.8;px(.3,260,(x,j)=>{circ(g,x+40,70+R(j)*80,26,'#fff');circ(g,x+70,80+R(j)*80,22,'#fff');circ(g,x+15,84+R(j)*80,18,'#fff')});g.globalAlpha=1;
  px(.5,320,(x,j)=>circ(g,x+160,GY+60,150+R(j)*40,'#66bb6a'));px(.8,130,(x,j)=>emo(['🌸','🌼','🌷'][j&1?1:0],x,GY-6,18));
  const a=1-L.rs/L.nf;if(a>0){g.fillStyle='rgba(80,80,100,'+a*.6+')';g.fillRect(0,0,VW,VH)}}}
function draw(){g.setTransform(SC,0,0,SC,0,0);g.save();if(shake>0)g.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);
 if(mode==='menu')cam=(cam+1.5)%1200;bg();g.translate(-cam|0,0);
 const th=TH[L.i];
 for(const s of L.sol){if(s.g){g.fillStyle=th[0];g.fillRect(s.x,GY,s.w,VH-GY);g.fillStyle=th[1];g.fillRect(s.x,GY,s.w,10)}
  else{rr(g,s.x,s.y,s.w,16,8);g.fillStyle=th[0];g.fill();g.fillStyle=th[1];g.fillRect(s.x+6,s.y,s.w-12,5)}}
 for(const s of L.sp)if(!s.dead)bub(s.x,s.y,s.w,s.h,s.tx,'#ff5252');
 const b=L.boss,open=L.rs>=L.nf&&(!b||b.dead);
 for(let r=0;r<3;r++){g.strokeStyle=open?['#ffd600','#69f0ae','#b388ff'][r]:'#777';g.lineWidth=4;g.beginPath();g.ellipse(L.goal+22,GY-45,18+r*5+Math.sin(T*.1+r)*3,45-r*8,0,0,7);g.stroke()}
 emo(open?'🚪':'🔒',L.goal+22,GY-45,24);
 for(const c of L.co)if(!c.got){const w=Math.abs(Math.cos(T*.08+c.x))*8+3;g.fillStyle='#ffd600';g.strokeStyle='#ff8f00';g.lineWidth=2;g.beginPath();g.ellipse(c.x+15,c.y+15,w,9,0,0,7);g.fill();g.stroke()}
 for(const s of L.st)if(!s.got)emo('⭐',s.x+15,s.y+15+Math.sin(T*.07+s.x)*4,26);
 for(const s of L.sh)if(!s.got){circ(g,s.x+15,s.y+15,18,'#40c4ff55');emo('🛡️',s.x+15,s.y+15+Math.sin(T*.07+s.x)*4,26)}
 for(const f of L.fr){if(!f.saved){emo(f.em,f.x+17,f.y+18,28);g.strokeStyle='#cfd8dc';g.lineWidth=3;g.strokeRect(f.x-2,f.y-4,38,42);for(let a=6;a<36;a+=9){g.beginPath();g.moveTo(f.x+a,f.y-4);g.lineTo(f.x+a,f.y+38);g.stroke()}}
  else{g.globalAlpha=Math.max(0,1-f.t/90);emo(f.em,f.x+17,f.y+18-f.t*.6+Math.abs(Math.sin(f.t*.15))*-12,28);emo('❤️',f.x+17,f.y-10-f.t*.4,16);g.globalAlpha=1}}
 for(const m of L.mo)if(!m.dead)mon(m.x,m.y,m.w,m.h,m.f?'#ff7043':'#b04bff',T+m.ph*9);
 if(b&&!b.dead){if(b.inv<=0||Math.floor(T/4)%2){mon(b.x,b.y,b.w,b.h,'#7b1fa2',T);emo('👑',b.x+35,b.y-12,30)}emo('❤️'.repeat(b.hp),b.x+35,b.y-38,16)}
 for(const q of L.pr)bub(q.x,q.y,q.w,q.h+6,'!!','#d50000');
 if(mode!=='menu'){const p=P;if(p.inv<=0||Math.floor(T/4)%2){g.save();g.translate(p.x+12,p.y+40);g.scale(1/p.sq,p.sq);hero(g,0,0,p.f,T,p.gr&&p.vx);g.restore()}
  if(p.sh>0&&(p.sh>90||Math.floor(T/5)%2)){g.fillStyle='#40c4ff44';g.strokeStyle='#40c4ff';g.lineWidth=3;g.beginPath();g.arc(p.x+12,p.y+20,32,0,7);g.fill();g.stroke()}}
 for(const q of PA){g.globalAlpha=clamp(q.l/20,0,1);if(q.t){g.fillStyle='#fff';g.strokeStyle='#2a1a6a';g.lineWidth=3;g.font='bold 16px sans-serif';g.textAlign='center';g.strokeText(q.t,q.x,q.y);g.fillText(q.t,q.x,q.y)}else{g.fillStyle=q.c;g.fillRect(q.x,q.y,q.r,q.r)}}
 g.globalAlpha=1;g.restore();
 if(mode==='menu'){hg.clearRect(0,0,160,160);hg.save();hg.translate(80,135+Math.sin(T*.08)*5);hg.scale(2.8,2.8);hero(hg,0,0,1,T,0);hg.restore()}}

function hud(){if(!G||mode==='menu')return;$('#hS').textContent='⭐ '+G.score;$('#hC').textContent='🪙 '+G.coins;
 $('#hL').textContent='❤️'.repeat(Math.max(0,G.lives));$('#hSh').textContent='🛡️ '+G.sh+(P.sh>0?' ('+Math.ceil(P.sh/60)+'s)':'');
 $('#hN').textContent='Level '+(L.i+1);$('#bar b').style.width=clamp(P.x/L.goal,0,1)*100+'%'}

function loop(ts){const dt=Math.min(2,(ts-last)/16.67||1);last=ts;
 if(mode==='play')upd(dt);else if(mode==='menu'||mode==='win'||mode==='done'||mode==='over')T+=dt;
 if(mode!=='pause'){PA=PA.filter(q=>{q.x+=q.vx*dt;q.y+=q.vy*dt;if(!q.t)q.vy+=(q.cf?.02:.15)*dt;q.l-=dt;return q.l>0})}
 if(mode==='win'&&Math.random()<.2)confetti();
 draw();hud();requestAnimationFrame(loop)}

/* ---------- Kontrol ---------- */
function press(k,v){if(k==='L'||k==='R')K[k]=v;if(k==='J'){K.J=v;if(v)K.Jp=1}if(k==='A'&&v)K.Ap=1}
const KM={ArrowLeft:'L',KeyA:'L',ArrowRight:'R',KeyD:'R',Space:'J',ArrowUp:'J',KeyW:'J',ShiftLeft:'A',ShiftRight:'A',KeyE:'A',KeyJ:'A'};
function togglePause(){if(mode==='play'){setMode('pause');show('pause')}else if(mode==='pause'){setMode('play');show('none')}}
addEventListener('keydown',e=>{if(KM[e.code]){e.preventDefault();if(!e.repeat)press(KM[e.code],1)}else if((e.code==='KeyP'||e.code==='Escape')&&!e.repeat)togglePause()});
addEventListener('keyup',e=>{if(KM[e.code])press(KM[e.code],0)});
addEventListener('blur',()=>{K.L=K.R=K.J=0;if(mode==='play')togglePause()});
$$('#pad button').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();press(k,1);b.classList.add('d')});
 ['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,()=>{press(k,0);b.classList.remove('d')}))});
addEventListener('contextmenu',e=>e.preventDefault());

/* ---------- Menu ---------- */
$('#lvl').innerHTML=LV.map((l,i)=>'<button class="b'+(['',' g',' p',' g'][i])+'" data-a="pick" data-i="'+i+'">'+(i+1)+' · '+l.n+'</button>').join('');
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;snd(660,.08,'triangle',.05);
 const a=b.dataset.a;
 if(a==='start'){G=null;newGame()}
 else if(a==='pick'){if(!G||mode==='menu')G={score:0,coins:0,fr:0,lives:3,sh:0,sawS:0,sn:{score:0,coins:0,fr:0}};
  const i=+b.dataset.i;if(i===0||mode==='menu'){G.score=G.coins=G.fr=0}startLevel(i)}
 else if(a==='how')show('how');else if(a==='levels')show('levels');else if(a==='back'){if(mode==='pause')setMode('menu');show('menu')}
 else if(a==='pause')togglePause();else if(a==='resume')togglePause();
 else if(a==='restart'){if(!G)return;startLevel(L.i,1)}
 else if(a==='next')startLevel(L.i+1);
 else if(a==='mute'){MU=!MU;$$('[data-a=mute]').forEach(x=>x.textContent=MU?'🔊':'🔇');refreshMusic()}
 else if(a==='menu'){setMode('menu');show('menu')}});

function resize(){const st=$('#stage'),w=st.clientWidth,d=clamp(window.devicePixelRatio||1,1,2);st.style.fontSize=Math.max(w/50,11)+'px';cv.width=Math.round(w*d);cv.height=Math.round(w*d*VH/VW);SC=cv.width/VW}
addEventListener('resize',resize);addEventListener('orientationchange',()=>setTimeout(resize,250));resize();
load(0);requestAnimationFrame(loop);
