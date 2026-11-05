"use strict";
(() => {
  const translations = {
    en: {home:'Home', rules:'Alliance rules', leadership:'Leadership', handbook:'THE ALLIANCE HANDBOOK', mission:'Different backgrounds.\nOne shared standard.', eyebrow:'THE BADA ALLIANCE HANDBOOK', search:'Search the rules…', empty:'No matching rules. Try another search.', count:(n,total)=>`Showing ${n} of ${total} rules`, print:'Print rules ↗', top:'Back to top ↑', skip:'Skip to content'},
    pt: {home:'Início', rules:'Regras da aliança', leadership:'Liderança', handbook:'MANUAL DA ALIANÇA', mission:'Origens diferentes.\nUm mesmo compromisso.', eyebrow:'O MANUAL DA ALIANÇA BADA', search:'Buscar nas regras…', empty:'Nenhuma regra encontrada. Tente outra busca.', count:(n,total)=>`Exibindo ${n} de ${total} regras`, print:'Imprimir regras ↗', top:'Voltar ao topo ↑', skip:'Ir para o conteúdo'},
    es: {home:'Inicio', rules:'Reglas de la alianza', leadership:'Liderazgo', handbook:'MANUAL DE LA ALIANZA', mission:'Diferentes orígenes.\nUn mismo compromiso.', eyebrow:'EL MANUAL DE LA ALIANZA BADA', search:'Buscar en las reglas…', empty:'No se encontraron reglas. Prueba otra búsqueda.', count:(n,total)=>`Mostrando ${n} de ${total} reglas`, print:'Imprimir reglas ↗', top:'Volver arriba ↑', skip:'Ir al contenido'},
    ko: {home:'홈', rules:'연맹 규칙', leadership:'리더십', handbook:'연맹 안내서', mission:'서로 다른 배경.\n하나의 기준.', eyebrow:'BADA 연맹 안내서', search:'규칙 검색…', empty:'검색 결과가 없습니다. 다른 검색어를 입력하세요.', count:(n,total)=>`전체 ${total}개 규칙 중 ${n}개 표시`, print:'규칙 인쇄 ↗', top:'맨 위로 ↑', skip:'본문으로 이동'},
    vi: {home:'Trang chủ', rules:'Luật liên minh', leadership:'Ban lãnh đạo', handbook:'CẨM NANG LIÊN MINH', mission:'Khác biệt về xuất thân.\nChung một tiêu chuẩn.', eyebrow:'CẨM NANG LIÊN MINH BADA', search:'Tìm trong luật…', empty:'Không tìm thấy luật phù hợp. Hãy thử từ khóa khác.', count:(n,total)=>`Hiển thị ${n} trong ${total} quy tắc`, print:'In luật ↗', top:'Về đầu trang ↑', skip:'Đến nội dung'},
    de: {home:'Startseite', rules:'Allianzregeln', leadership:'Führung', handbook:'ALLIANZHANDBUCH', mission:'Verschiedene Hintergründe.\nEin gemeinsamer Maßstab.', eyebrow:'DAS BADA-ALLIANZHANDBUCH', search:'Regeln durchsuchen…', empty:'Keine passenden Regeln gefunden. Versuche eine andere Suche.', count:(n,total)=>`${n} von ${total} Regeln angezeigt`, print:'Regeln drucken ↗', top:'Nach oben ↑', skip:'Zum Inhalt'}
  };
  const $ = id => document.getElementById(id);
  const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let language = 'en';
  let copy;
  let words;
  function filter() {
    const query = normalize($('rules-search').value.trim());
    let count = 0;
    document.querySelectorAll('.rule').forEach(rule => {
      rule.hidden = !normalize(rule.textContent).includes(query);
      if (!rule.hidden) count++;
    });
    document.querySelectorAll('.rules-group').forEach(group => {
      group.hidden = ![...group.querySelectorAll('.rule')].some(rule => !rule.hidden);
    });
    $('rules-count').textContent = words.count(count, copy.regras.length);
    $('rules-empty').hidden = count > 0;
  }
  function render() {
    copy = TEXTOS[language]; words = translations[language];
    document.documentElement.lang = copy.html;
    document.title = 'BaDa — ' + words.rules;
    for (const [id, text] of Object.entries({'t-idioma':copy.idioma,'intro':copy.intro,'t-cons':copy.consTitulo,'cons-intro':copy.consIntro,'cons-grave':copy.consGrave,'rodape':copy.rodape,'breadcrumb':words.rules,'rules-sidebar-label':words.handbook,'sidebar-footer-label':words.rules,'rules-eyebrow':words.eyebrow,'rules-empty':words.empty,'print-rules':words.print,'back-top':words.top,'nav-consequences':copy.consTitulo})) $(id).textContent = text;
    for (const [id, text] of Object.entries({'nav-home':words.home,'nav-rules':words.rules,'nav-leadership':words.leadership})) $(id).innerHTML = escape(text) + ' <span>↗</span>';
    $('sidebar-mission').innerHTML = escape(words.mission).replace('\n','<br>');
    $('t-regras').innerHTML = escape(words.rules) + '<span class="heading-dot">.</span>';
    document.querySelector('.skip-link').textContent = words.skip;
    $('rules-search').placeholder = words.search;
    $('rules-search').setAttribute('aria-label',words.search);
    $('cons-passos').innerHTML = copy.consPassos.map(item => '<li>' + item + '</li>').join('');
    const boundaries = [0,5,11,copy.regras.length];
    $('lista').innerHTML = copy.blocos.map((title,group) => {
      $('group-nav-' + group).textContent = title;
      const rules = copy.regras.slice(boundaries[group],boundaries[group+1]).map((rule,index) => {
        const number = boundaries[group] + index + 1;
        return `<article class="rule" id="regra-${number}"><div class="rule-header"><span class="rule-number">${String(number).padStart(2,'0')}</span><h3>${rule[0]}</h3></div><ul>${rule[1].map(item=>'<li>'+item+'</li>').join('')}</ul>${rule[2] ? '<p class="rule-emphasis">'+rule[2]+'</p>':''}</article>`;
      }).join('');
      return `<section id="group-${group}" class="rules-group"><h2>${escape(title)}<span class="heading-dot">.</span></h2>${rules}</section>`;
    }).join('');
    filter();
  }
  try { const saved = localStorage.getItem('bada-idioma'); if (Object.hasOwn(TEXTOS,saved)) language = saved; } catch {}
  $('idioma').value = language;
  $('idioma').addEventListener('change', () => {
    language = $('idioma').value;
    try { localStorage.setItem('bada-idioma', language); } catch {}
    // A query in the previous language should not hide the newly selected translation.
    $('rules-search').value = '';
    render();
  });
  $('rules-search').addEventListener('input', filter);
  $('print-rules').addEventListener('click', () => window.print());
  let printState = [];
  window.addEventListener('beforeprint', () => {
    printState = [...document.querySelectorAll('.rule, .rules-group')].map(element=>[element,element.hidden]);
    printState.forEach(([element])=>{element.hidden=false;});
  });
  window.addEventListener('afterprint', () => printState.forEach(([element,hidden])=>{element.hidden=hidden;}));
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault(); $('rules-search').focus();
    }
  });
  function scrollToHash() {
    if (!/^#(?:regra-\d+|group-\d+|consequences|main)$/.test(location.hash)) return;
    const target = $(location.hash.slice(1));
    if (target) {
      if (target.hidden) {$('rules-search').value='';filter();}
      target.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', scrollToHash);
  render();
  requestAnimationFrame(scrollToHash);
})();
