(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var tt=$('#tt'),tm;
function toast(m){tt.textContent=m;tt.classList.add('on');clearTimeout(tm);tm=setTimeout(function(){tt.classList.remove('on')},2400)}

/* آیپی سرور: فقط از data-ip روی <body> خوانده می‌شود */
var ip=document.body.getAttribute('data-ip')||'';
var okIp=/^[A-Za-z0-9.\-]{1,100}(:\d{1,5})?$/.test(ip);
if(okIp){
  $$('[data-ip-text]').forEach(function(e){e.textContent=ip});
  $$('[data-ip-link]').forEach(function(e){e.setAttribute('href','mtasa://'+ip)});
}
$$('.js-copy').forEach(function(b){b.addEventListener('click',function(){
  if(!okIp){toast('آیپی معتبر نیست');return}
  var done=function(){toast('آیپی کپی شد ✓')};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ip).then(done,function(){fb()})}else fb();
  function fb(){var t=document.createElement('textarea');t.value=ip;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){toast(ip)}t.remove()}
})});

/* لینک‌ها: خارجی‌ها امن و در تب جدید؛ لینک خالی (#) فقط پیام نشان می‌دهد */
$$('a[href]').forEach(function(a){
  var h=a.getAttribute('href');
  if(/^https?:\/\//i.test(h)){a.target='_blank';a.rel='noopener noreferrer'}
  a.addEventListener('click',function(e){
    if(h==='#'){e.preventDefault();if(a.dataset.t)toast(a.dataset.t)}
  });
});

/* منو */
var nv=$('#nv'),bg=$('#bg');
bg.addEventListener('click',function(){var o=nv.classList.toggle('on');bg.setAttribute('aria-expanded',o)});
$$('#nv a').forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('on');bg.setAttribute('aria-expanded','false')})});

/* پنجره ورود */
var last;
function open(id){last=document.activeElement;var m=$('#'+id);m.classList.add('on');var i=$('input',m);if(i)setTimeout(function(){i.focus()},50)}
function close(m){m.classList.remove('on');if(last)last.focus()}
$$('[data-open]').forEach(function(b){b.addEventListener('click',function(){nv.classList.remove('on');open(b.dataset.open)})});
$$('[data-close]').forEach(function(b){b.addEventListener('click',function(){close(b.closest('.md'))})});
$$('.md').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m)close(m)})});
addEventListener('keydown',function(e){if(e.key==='Escape')$$('.md.on').forEach(close)});
$('#lg').addEventListener('click',function(){close($('#login'));toast('ورود به UCP به‌زودی فعال می‌شود')});

/* نوار متحرک */
var w=['ROYAL MTA','ROLEPLAY','IRAN','ECONOMY','FREEDOM'],h='';
for(var i=0;i<10;i++)h+='<span>'+w[i%5]+'</span><span>✦</span>';
$('#mqi').innerHTML=h;

/* ظاهر شدن و شمارنده (فقط یک observer) */
function count(el){var n=+el.dataset.n,s=el.dataset.s,t0=performance.now();(function f(t){var p=Math.min((t-t0)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)})(t0)}
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');$$('[data-n]',e.target).forEach(count);io.unobserve(e.target)})},{threshold:.12});
  $$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*60+'ms';io.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')});$$('[data-n]').forEach(function(el){el.textContent=el.dataset.n+el.dataset.s})}
})();
