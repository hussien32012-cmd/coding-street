const LOGO="logo.jpg";
const L={en:{home:'Home',faq:'FAQ',profile:'Profile',inst:'Install app',courses:'Courses',community:'Community',lab:'Playground',dash:'My learning',admin:'Instructor panel',login:'Log in',reg:'Sign up',out:'Log out',h1:'Learn to code. Build your future.',h2:'Structured courses, hands-on practice and a friendly community, all in one street.',start:'Browse courses',search:'Search courses…',enroll:'Enroll',cont:'Continue',name:'Full name',email:'Email',pw:'Password',post:'Share something with the community…',pub:'Publish',lessons:'Lessons',done:'Completed',run:'Run code',need:'Please log in first.',all:'All',vids:'Videos',files:'Files',none:'Nothing here yet.',nc:'No courses yet. New courses are coming soon.'},
ar:{nc:'لا توجد كورسات بعد. كورسات جديدة قريبًا.',home:'الرئيسية',faq:'الأسئلة الشائعة',profile:'الملف الشخصي',inst:'تثبيت التطبيق',courses:'الكورسات',community:'المجتمع',lab:'ساحة التجربة',dash:'تعلّمي',admin:'لوحة المدرّس',login:'تسجيل الدخول',reg:'إنشاء حساب',out:'خروج',h1:'تعلّم البرمجة وابنِ مستقبلك',h2:'كورسات منظمة وتطبيق عملي ومجتمع داعم في مكان واحد.',start:'تصفح الكورسات',search:'ابحث عن كورس…',enroll:'اشترك',cont:'تابع',name:'الاسم الكامل',email:'البريد',pw:'كلمة المرور',post:'شارك المجتمع بشيء…',pub:'نشر',lessons:'الدروس',done:'تم',run:'تشغيل الكود',need:'سجّل الدخول أولاً.',all:'الكل',vids:'الفيديوهات',files:'الملفات',none:'لا شيء بعد.'},
fr:{nc:'Aucun cours pour l’instant.',home:'Accueil',faq:'FAQ',profile:'Profil',inst:'Installer',courses:'Cours',community:'Communauté',lab:'Atelier',dash:'Mon parcours',admin:'Espace formateur',login:'Connexion',reg:'Inscription',out:'Déconnexion',h1:'Apprenez à coder. Construisez votre avenir.',h2:'Cours structurés, pratique et communauté.',start:'Voir les cours',search:'Rechercher…',enroll:'S’inscrire',cont:'Continuer',name:'Nom complet',email:'E-mail',pw:'Mot de passe',post:'Partagez quelque chose…',pub:'Publier',lessons:'Leçons',done:'Terminé',run:'Exécuter',need:'Connectez-vous d’abord.',all:'Tous',vids:'Vidéos',files:'Fichiers',none:'Rien pour l’instant.'},
es:{nc:'Aún no hay cursos.',home:'Inicio',faq:'Preguntas',profile:'Perfil',inst:'Instalar',courses:'Cursos',community:'Comunidad',lab:'Laboratorio',dash:'Mi aprendizaje',admin:'Panel docente',login:'Entrar',reg:'Registrarse',out:'Salir',h1:'Aprende a programar. Construye tu futuro.',h2:'Cursos organizados, práctica y comunidad.',start:'Ver cursos',search:'Buscar cursos…',enroll:'Inscribirme',cont:'Continuar',name:'Nombre completo',email:'Correo',pw:'Contraseña',post:'Comparte algo…',pub:'Publicar',lessons:'Lecciones',done:'Completado',run:'Ejecutar',need:'Inicia sesión primero.',all:'Todos',vids:'Vídeos',files:'Archivos',none:'Aún nada.'}};
let lang='en',mem=null,route='home';
function go(r){route=r;render();scrollTo(0,0)}
const t=k=>(L[lang]&&L[lang][k])||L.en[k]||k;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seed=()=>({users:[],session:null,posts:[],enr:{},prog:{},courses:[]});
function ld(){try{const s=localStorage.getItem('cs_db');if(s){const d=JSON.parse(s);d.courses=(d.courses||[]).filter(c=>!['html','css','js','py'].includes(c.id));return d}}catch(e){}return mem||seed()}
let db=ld();
function sv(){mem=db;try{localStorage.setItem('cs_db',JSON.stringify(db,(k,v)=>k=='url'?undefined:v))}catch(e){}}
const me=()=>db.users.find(u=>u.email==db.session);
const hash=async s=>{try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(s)}};
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function nav(){const r=route.split('/')[0],u=me();
 const ls=[['home','home'],['courses','courses'],['community','community'],['lab','lab']];
 if(u)ls.push(['dash','dash'],['profile','profile']);ls.push(['faq','faq']);if(u&&u.role=='admin')ls.push(['admin','admin']);
 hd.innerHTML=`<a class="brand" href="#" onclick="go('home');return false"><img src="${LOGO}" alt="">Coding Street</a><nav>${ls.map(([h,k])=>`<a href="#" onclick="go('${h}');return false" class="${r==h?'on':''}">${t(k)}</a>`).join('')}</nav>
 <select onchange="setLang(this.value)" aria-label="Language">${[['en','English'],['ar','العربية'],['fr','Français'],['es','Español']].map(([c,n])=>`<option value="${c}" ${c==lang?'selected':''}>${n}</option>`).join('')}</select>
 <button class="btn ghost" onclick="th()" aria-label="Theme">◐</button>${dp?`<button class="btn" onclick="inst()">${t('inst')}</button>`:''}
 ${u?`<a href="#" onclick="go('profile');return false" class="mu">${esc(u.name)}</a><button class="btn ghost" onclick="out()">${t('out')}</button>`:`<button class="btn ghost" onclick="auth('login')">${t('login')}</button><button class="btn" onclick="auth('reg')">${t('reg')}</button>`}`}
function setLang(l){lang=l;document.documentElement.lang=l;document.documentElement.dir=l=='ar'?'rtl':'ltr';render()}
function th(){const r=document.documentElement;r.dataset.theme=r.dataset.theme=='light'?'dark':'light'}
function pct(c){const u=me();if(!u)return 0;const p=(db.prog[u.email]||{})[c.id]||[];return Math.round(p.length/c.ls.length*100)}
function cc(c){const u=me(),en=u&&(db.enr[u.email]||[]).includes(c.id),p=pct(c);
 return `<div class="card"><span class="tag">${esc(c.cat)}</span><span class="tag">${esc(c.lv)}</span><h3>${esc(c.t)}</h3><p class="mu">${esc(c.d)}</p>${en?`<div class="bar"><i style="width:${p}%"></i></div><span class="mu">${p}%</span>`:''}<div class="row"><a class="btn" href="#" onclick="go('course/${c.id}');return false">${en?t('cont'):t('enroll')}</a></div></div>`}
let q='',cat='';
function render(){nav();const [r,id]=route.split('/'),u=me();let h='';
 if(r=='home'){h=`<section class="hero"><div><h1>${t('h1')}</h1><p>${t('h2')}</p><div class="row"><a class="btn" href="#" onclick="go('courses');return false">${t('start')}</a><a class="btn ghost" href="#" onclick="go('lab');return false">${t('lab')}</a></div></div><img src="${LOGO}" alt="Coding Street logo"></section><h2>${t('courses')}</h2><div class="grid">${db.courses.slice(0,4).map(cc).join('')||`<p class="mu">${t('nc')}</p>`}</div>`}
 else if(r=='courses'){const cs=db.courses.filter(c=>(!cat||c.cat==cat)&&c.t.toLowerCase().includes(q.toLowerCase()));
  h=`<h2>${t('courses')}</h2><div class="row"><input id="qs" value="${esc(q)}" placeholder="${t('search')}" oninput="q=this.value;render();qs.focus()"><select onchange="cat=this.value;render()"><option value="">${t('all')}</option>${[...new Set(db.courses.map(c=>c.cat))].map(c=>`<option ${c==cat?'selected':''}>${esc(c)}</option>`).join('')}</select></div><div class="grid">${cs.map(cc).join('')||`<p class="mu">${t('nc')}</p>`}</div>`}
 else if(r=='course'){const c=db.courses.find(x=>x.id==id);if(!c){h=t('none')}else{const en=u&&(db.enr[u.email]||[]).includes(c.id),p=u?(db.prog[u.email]||{})[c.id]||[]:[];
  h=`<h2>${esc(c.t)}</h2><p class="mu">${esc(c.d)}</p>${en?`<div class="bar"><i style="width:${pct(c)}%"></i></div>`:`<button class="btn" onclick="enroll('${c.id}')">${t('enroll')}</button>`}
  <h2>${t('lessons')}</h2><div class="card">${c.ls.map((l,i)=>`<label class="lesson"><input type="checkbox" ${p.includes(i)?'checked':''} onchange="mark('${c.id}',${i})"> ${esc(l)}</label>`).join('')}</div>
  <h2>${t('vids')}</h2>${c.v.map(v=>`<div class="card" style="margin-bottom:10px"><b>${esc(v.t)}</b>${v.url?`<video controls style="width:100%;margin-top:8px;border-radius:10px" src="${v.url}"></video>`:`<p class="mu">Re-upload to play (this session only).</p>`}</div>`).join('')||`<p class="mu">${t('none')}</p>`}
  <h2>${t('files')}</h2>${c.f.map(f=>`<div class="card" style="margin-bottom:10px">📄 ${f.url?`<a href="${f.url}" download="${esc(f.t)}" style="color:var(--ac)">${esc(f.t)}</a>`:esc(f.t)}</div>`).join('')||`<p class="mu">${t('none')}</p>`}`}}
 else if(r=='community'){h=`<h2>${t('community')}</h2>${u?`<div class="card"><textarea id="pt" rows="3" placeholder="${t('post')}"></textarea><div class="row"><button class="btn" onclick="pub()">${t('pub')}</button></div></div>`:`<p class="mu">${t('need')}</p>`}<div style="display:grid;gap:12px;margin-top:14px">${db.posts.map((p,i)=>`<div class="card"><b>${esc(p.a)}</b> <span class="mu">${new Date(p.d).toLocaleString()}</span><p>${esc(p.x)}</p><button class="btn ghost" onclick="like(${i})">♥ ${p.l}</button></div>`).join('')||`<p class="mu">${t('none')}</p>`}</div>`}
 else if(r=='lab'){h=`<h2>${t('lab')}</h2><textarea id="cd" class="code">${esc('<h1>Hello, Coding Street!</h1>\n<style>h1{color:#0a8f86}</style>\n<script>console.log("ready")<\/script>')}</textarea><div class="row"><button class="btn" onclick="run()">${t('run')}</button></div><iframe id="fr" sandbox="allow-scripts" title="Preview"></iframe>`;setTimeout(run,0)}
 else if(r=='dash'&&u){const e=(db.enr[u.email]||[]).map(i=>db.courses.find(c=>c.id==i)).filter(Boolean),dn=Object.values(db.prog[u.email]||{}).flat().length;
  h=`<h2>${t('dash')}</h2><div class="grid"><div class="card"><h3>${e.length}</h3><span class="mu">${t('courses')}</span></div><div class="card"><h3>${dn}</h3><span class="mu">${t('done')}</span></div></div><h2>${t('courses')}</h2><div class="grid">${e.map(cc).join('')||`<p class="mu">${t('nc')}</p>`}</div>`}
 else if(r=='admin'&&u&&u.role=='admin'){const o=db.courses.map(c=>`<option value="${c.id}">${esc(c.t)}</option>`).join('');
  h=`<h2>${t('admin')}</h2><div class="card"><h3>New course</h3><div class="row"><input id="nt" placeholder="Title"><input id="nc" placeholder="Category"><select id="nl"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div><input id="nd" placeholder="Description"><div class="row"><input id="ns" placeholder="Lessons, comma separated"><button class="btn" onclick="addC()">+</button></div></div>
  <div class="card" style="margin-top:14px"><h3>Upload video or file</h3><div class="row"><select id="uc">${o}</select><input id="ut" placeholder="Title"></div><div class="row"><input id="uf" type="file" accept="video/*,.pdf,.zip,.txt,.html,.css,.js,.py"><button class="btn" onclick="upl()">Upload</button></div><p class="mu">Uploads stay in this browser session. A real server is needed to store them permanently.</p></div>`}
 else if(r=='faq'){const F=FAQ[lang]||FAQ.en;h=`<h2>${t('faq')}</h2>${F.map(([a,b])=>`<details class="card" style="margin-bottom:10px"><summary><b>${esc(a)}</b></summary><p class="mu">${esc(b)}</p></details>`).join('')}`}
 else if(r=='profile'&&u){const e=(db.enr[u.email]||[]).length,dn=Object.values(db.prog[u.email]||{}).flat().length;
  h=`<h2>${t('profile')}</h2><div class="card"><div class="row"><div class="avatar">${esc((u.name.trim()[0]||'?').toUpperCase())}</div><div><h3>${esc(u.name)}</h3><span class="mu">${esc(u.email)}</span><br><span class="tag">${u.role=='admin'?'Instructor':'Student'}</span></div></div><p class="mu">${e} ${t('courses')}, ${dn} ${t('done')}</p></div>
  <div class="card" style="margin-top:14px"><h3>${t('name')}</h3><div class="row"><input id="pn" value="${esc(u.name)}"><button class="btn" onclick="upName()">Save</button></div></div>
  <div class="card" style="margin-top:14px"><h3>${t('pw')}</h3><div class="row"><input id="p1" type="password" placeholder="Current"><input id="p2" type="password" placeholder="New, 6+ characters"><button class="btn" onclick="upPw()">Save</button></div></div>
  <div class="row"><button class="btn ghost" onclick="out()">${t('out')}</button><button class="btn ghost" onclick="delAcc()">Delete account</button></div>`}
 else{h=`<p>${t('need')}</p>`}
 app.innerHTML=h}
function auth(m){const R=m=='reg';mo.innerHTML=`<div class="modal" onclick="if(event.target==this)mo.innerHTML=''"><div><h3>${R?t('reg'):t('login')}</h3>${R?`<label>${t('name')}</label><input id="an">`:''}<label>${t('email')}</label><input id="ae" type="email"><label>${t('pw')}</label><input id="ap" type="password"><p id="ar" class="mu"></p><button class="btn" onclick="sub(${R})">${R?t('reg'):t('login')}</button></div></div>`}
async function sub(R){const e=ae.value.trim().toLowerCase(),p=ap.value;if(!e||p.length<6){ar.textContent='Valid email and a password of 6+ characters required.';return}
 const h=await hash(p);
 if(R){if(db.users.some(u=>u.email==e)){ar.textContent='Email already registered.';return}db.users.push({name:an.value.trim()||e,email:e,pw:h,role:db.users.length?'student':'admin'})}
 else{const u=db.users.find(u=>u.email==e&&u.pw==h);if(!u){ar.textContent='Wrong email or password.';return}}
 db.session=e;sv();mo.innerHTML='';render();toast('Welcome!')}
function out(){db.session=null;sv();render()}
function enroll(id){const u=me();if(!u)return auth('login');(db.enr[u.email]=db.enr[u.email]||[]).push(id);sv();render()}
function mark(id,i){const u=me();if(!u){auth('login');return render()}const p=(db.prog[u.email]=db.prog[u.email]||{});p[id]=p[id]||[];const k=p[id].indexOf(i);k<0?p[id].push(i):p[id].splice(k,1);if(!(db.enr[u.email]||[]).includes(id))(db.enr[u.email]=db.enr[u.email]||[]).push(id);sv();render()}
function pub(){if(!pt.value.trim())return;db.posts.unshift({a:me().name,x:pt.value.trim(),d:Date.now(),l:0});sv();render()}
function like(i){db.posts[i].l++;sv();render()}
function run(){const c=document.getElementById('cd'),f=document.getElementById('fr');if(c&&f)f.srcdoc=c.value}
function addC(){if(!nt.value.trim())return;db.courses.push({id:'c'+Date.now(),t:nt.value.trim(),cat:nc.value.trim()||'General',lv:nl.value,d:nd.value.trim(),ls:(ns.value.split(',').map(s=>s.trim()).filter(Boolean)),v:[],f:[]});if(!db.courses.at(-1).ls.length)db.courses.at(-1).ls=['Lesson 1'];sv();toast('Course added');render()}
function upl(){const f=uf.files[0];if(!f)return;const c=db.courses.find(x=>x.id==uc.value),o={t:ut.value.trim()||f.name,url:URL.createObjectURL(f)};(f.type.startsWith('video')?c.v:c.f).push(o);sv();toast('Uploaded');render()}
function upName(){const u=me(),v=pn.value.trim();if(!v)return;u.name=v;sv();toast('Saved');render()}
async function upPw(){const u=me();if(p2.value.length<6)return toast('New password: 6+ characters');if(await hash(p1.value)!=u.pw)return toast('Current password is wrong');u.pw=await hash(p2.value);sv();toast('Password updated');render()}
function delAcc(){if(!confirm('Delete your account and progress?'))return;const e=db.session;db.users=db.users.filter(x=>x.email!=e);delete db.enr[e];delete db.prog[e];db.session=null;sv();go('home')}
const FAQ={en:[['Is Coding Street free?','Yes. Create an account and enroll in any course at no cost.'],['How do I track my progress?','Open a course and tick each lesson you finish. Your progress shows under My learning.'],['I forgot my password. What now?','You can change it from Profile while logged in. If you are locked out, contact the instructor.'],['Can I use it on my phone or computer?','Yes. Use Install app in the header, or Add to Home Screen on your phone, and it opens like a regular app.'],['Who can upload videos and files?','The instructor account, from the Instructor panel.'],['Which languages are supported?','English, Arabic, French and Spanish. Change it from the menu at the top.']],
ar:[['هل Coding Street مجانية؟','أيوه. أنشئ حسابًا واشترك في أي كورس بدون أي تكلفة.'],['إزاي أتابع تقدمي؟','افتح الكورس وعلّم كل درس تخلصه، وتقدمك بيظهر في صفحة تعلّمي.'],['نسيت كلمة المرور، أعمل إيه؟','تقدر تغيّرها من الملف الشخصي وإنت مسجل دخول. ولو مش قادر تدخل كلّم المدرّس.'],['أقدر أستخدمها على الموبايل والكمبيوتر؟','أيوه. استخدم زر تثبيت التطبيق أو إضافة للشاشة الرئيسية وهتفتح زي أي تطبيق.'],['مين يقدر يرفع فيديوهات وملفات؟','حساب المدرّس من لوحة المدرّس.'],['إيه اللغات المدعومة؟','الإنجليزية والعربية والفرنسية والإسبانية، من القائمة فوق.']]};
const A=/[\u0600-\u06FF]/;
const KB=[[/^(hi|hello|hey|salam)|مرحب|اهلا|أهلا|سلام|هاي/i,'Hi! I am Coding. Ask me about courses, your account, uploads or the app.','أهلا! أنا Coding. اسألني عن الكورسات أو حسابك أو الرفع أو التطبيق.'],
[/thank|شكر/i,'You are welcome!','العفو!'],
[/forgot|password|كلمة|باسورد|نسيت/i,'Change your password from Profile while logged in. If you are locked out, contact the instructor.','تقدر تغيّر كلمة المرور من الملف الشخصي وإنت مسجل دخول. ولو مش قادر تدخل كلّم المدرّس.'],
[/login|log in|sign|register|account|حساب|دخول|تسجيل/i,'Use Sign up to create an account, then Log in. Passwords need 6+ characters and each email can be used once.','اضغط إنشاء حساب ثم سجّل الدخول. كلمة المرور 6 أحرف على الأقل والبريد يتسجل مرة واحدة.'],
[/upload|video|file|رفع|فيديو|ملف/i,'Uploads are in the Instructor panel (the first account created is the instructor). Files added in the browser only last for the current session.','الرفع من لوحة المدرّس (أول حساب يتسجل هو المدرّس). الملفات المرفوعة بتفضل في الجلسة الحالية بس.'],
[/enroll|course|كورس|شترك|دورة/i,'Open Courses, choose one, press Enroll, then tick lessons as you finish them.','افتح الكورسات واختار كورس واضغط اشترك وبعدين علّم الدروس اللي خلصتها.'],
[/install|app|phone|mobile|تطبيق|موبايل|تثبيت/i,'Open the site in Chrome, Edge or Safari, then use Install app or Add to Home Screen.','افتح الموقع من كروم أو إيدج أو سفاري واختار تثبيت التطبيق أو إضافة للشاشة الرئيسية.'],
[/progress|تقدم/i,'Tick lessons inside a course. Your progress appears under My learning.','علّم الدروس جوه الكورس وهتشوف تقدمك في صفحة تعلّمي.'],
[/language|لغة|لغات/i,'Use the language menu at the top: English, Arabic, French or Spanish.','من قائمة اللغة فوق: إنجليزي أو عربي أو فرنسي أو إسباني.'],
[/who|owner|created|مين|صاحب/i,'Coding Street was created by Hussein Mahmoud Galal.','Coding Street من تصميم وتطوير Hussein Mahmoud Galal.'],
[/html/i,'HTML builds the structure of a page: headings, text, links, images and forms. Try the Playground to test it live.','HTML بيبني هيكل الصفحة: عناوين ونصوص وروابط وصور ونماذج. جرّبه مباشرة في ساحة التجربة.'],
[/css/i,'CSS controls colors, spacing and layout. Start with Flexbox (display:flex) for rows and columns.','CSS بيتحكم في الألوان والمسافات والتنسيق. ابدأ بـ Flexbox (display:flex).'],
[/js|javascript|جافا/i,'JavaScript adds behavior: clicks, forms, data. Test small snippets in the Playground with console.log().','JavaScript بيضيف التفاعل: ضغطات ونماذج وبيانات. جرّب أكواد صغيرة في ساحة التجربة.'],
[/python|بايثون/i,'Python is great for beginners: clear syntax for automation, data and backends.','بايثون ممتازة للمبتدئين: سهلة وتنفع للأتمتة والبيانات والسيرفرات.'],
[/error|bug|problem|issue|مشكلة|خطأ|شغال/i,'Tell me which page you are on and what you clicked. Reloading with Ctrl+F5 fixes most display issues.','قولي إنت في أنهي صفحة وضغطت على إيه. جرّب Ctrl+F5 لإعادة التحميل.']];
function chips(a){const d=document.createElement('div');d.className='chips';(a?['إزاي أشترك؟','نسيت كلمة المرور','تثبيت التطبيق','رفع فيديو']:['How do I enroll?','Forgot password','Install the app','Upload videos']).forEach(x=>{const b=document.createElement('button');b.textContent=x;b.onclick=()=>{ki.value=x;kong()};d.appendChild(b)});km.appendChild(d);km.scrollTop=1e9}
function tk(){kp.style.display=kp.style.display=='block'?'none':'block';if(!km.children.length){bot('Hi! I am Coding, your Coding Street support assistant. What problem did you run into?');chips(0)}}
function add(c,x){const d=document.createElement('div');d.className='m '+c;d.textContent=x;km.appendChild(d);km.scrollTop=1e9}
const bot=x=>add('b',x);
let hist=[];
function offline(x){const a=A.test(x),k=KB.find(([r])=>r.test(x));if(k)bot(a?k[2]:k[1]);else{bot(a?'مش متأكد من الإجابة. جرّب واحد من دول:':'I am not sure about that yet. Try one of these:');chips(a)}}
async function kong(){const x=ki.value.trim();if(!x)return;ki.value='';add('u',x);hist.push({role:'user',content:x});
 const w=document.createElement('div');w.className='m b';w.textContent='…';km.appendChild(w);km.scrollTop=1e9;
 try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:hist.slice(-12)})});
  const d=await r.json();if(!r.ok||!d.reply)throw 0;w.textContent=d.reply;hist.push({role:'assistant',content:d.reply})}
 catch(e){w.remove();offline(x)}
 km.scrollTop=1e9}
if(matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.dataset.theme='light';
let dp=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;render()});
function inst(){if(dp){dp.prompt();dp=null;render()}}
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
// --- ميزة رفع وحفظ صورة البروفايل لكل مستخدم ---
function uploadProfilePic(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 150, 150);

      const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
      localStorage.setItem('codingStreetUserAvatar', compressedImage);

      const avatarEl = document.getElementById('userAvatarImg');
      if (avatarEl) {
        avatarEl.src = compressedImage;
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

window.addEventListener('load', function() {
  const savedAvatar = localStorage.getItem('codingStreetUserAvatar');
  const avatarEl = document.getElementById('userAvatarImg');
  if (savedAvatar && avatarEl) {
    avatarEl.src = savedAvatar;
  }
});
