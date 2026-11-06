"use strict";
(() => {
  const language = window.BADA_LANGUAGE.get();
  const locale = window.LEADERSHIP_LOCALES[language];
  const dictionary = Object.fromEntries(window.LEADERSHIP_UI_KEYS.map((key,index) => [key,locale ? locale.ui[index] : key]));
  const t = text => dictionary[text] || text;
  const original = window.CHARTER;
  const data = locale ? {
    ...original,
    roles: original.roles.map((role,index) => {
      const [title,intro,tasks,authority,division] = locale.roles[index];
      const owners = [...role.body.matchAll(/^\*\*(Main|Support):\*\* (.+)$/gm)].map(match => '**' + match[1] + ':** ' + match[2].trim()).join('\n');
      return {title, englishTitle:role.title, body:owners + '\n\n' + intro + '\n\n**Responsibilities:**\n' + tasks.map(task => '- ' + task).join('\n') + (division ? '\n\n**Suggested division:** ' + division : '') + '\n\n**' + (index === 9 ? 'Coordination' : 'Authority') + ':** ' + authority};
    }),
    purpose:locale.purpose, ownership:locale.ownership, culture:locale.culture,
    decisions:locale.decisionIntro + '\n\n**Decisions leaders can generally make independently:**\n' + locale.independent.map(line => '- ' + line).join('\n') + '\n\n**Decisions requiring leadership alignment:**\n' + locale.aligned.map(line => '- ' + line).join('\n') + '\n\n' + locale.decisionNote,
    collaboration:locale.principles.map(([title,body]) => '**' + title + '** ' + body).join('\n\n') + '\n\n### Weekly Leadership Check-in'
  } : original;
  const selector = document.getElementById('leadership-language');
  selector.value = language;
  selector.setAttribute('aria-label',t('Language'));
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
  document.title = 'BaDa — ' + t('Leadership');
  selector.addEventListener('change', () => {
    window.BADA_LANGUAGE.set(selector.value);
    location.reload();
  });
  const escape = (text) => text.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const inline = (text) => escape(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  function markdown(text) {
    return text.split(/\n\s*\n/).map(block => {
      if (block.startsWith('- ')) return '<ul>' + block.split('\n').map(line => '<li>' + inline(line.replace(/^- /, '')) + '</li>').join('') + '</ul>';
      return '<p>' + inline(block).replace(/  \n/g, '<br>').replace(/\n/g, ' ') + '</p>';
    }).join('');
  }
  const categories = ['strategy','people','people','strategy','operations','operations','people','operations','people','people'];
  const englishShortNames = ['War Commander','Member Relations & Discipline','Diplomacy & External Relations','Season Planning & Intelligence','VS & Performance','PvP Events','Recruitment & Transfers','Daily Events & Operations','Communications & Community','Player Development & Coaching'];
  const shortNames = locale ? locale.roles.map(role => role[0]) : englishShortNames;
  const nameLists = body => ({
    main: (body.match(/^\*\*Main:\*\* (.+)$/m)?.[1] || '').trim(),
    support: (body.match(/^\*\*Support:\*\* (.+)$/m)?.[1] || '').trim()
  });
  const roles = data.roles.map((role, index) => {
    const owners = nameLists(role.body);
    const paragraphs = role.body.replace(/^\*\*(Main|Support):\*\* .+\n?/gm, '').trim().split(/\n\s*\n/);
    return {...role, ...owners, index, category: categories[index], intro: paragraphs.shift(), rest: paragraphs.join('\n\n')};
  });
  document.getElementById('purpose-content').innerHTML = markdown(data.purpose);
  document.getElementById('ownership-content').innerHTML = markdown(data.ownership);
  const initial = name => name === '100T' ? '1T' : name.split(/\s+/).map(word => word[0]).slice(0, 2).join('').toUpperCase();
  const findRole = title => roles.find(role => (role.englishTitle || role.title) === title || (role.englishTitle || role.title).startsWith(title));
  const roleLinks = text => text === '—' ? '<span aria-label="No support role assigned">—</span>' : text.split('; ').map(title => {
    const role = findRole(title);
    return role ? `<a class="table-role" href="#role-${role.index}" data-role="${role.index}">${escape(role.title)}</a>` : `<span class="table-role">${escape(title)}</span>`;
  }).join('');
  document.getElementById('team-body').innerHTML = data.team.map((leader, index) => `<tr><td><button class="leader-button" data-leader="${escape(leader.name)}" title="${escape(t('View roles for'))} ${escape(leader.name)}"><span class="avatar tone-${index % 3}" aria-hidden="true">${escape(initial(leader.name))}</span><span class="leader-name">${escape(leader.name)}</span></button></td><td>${roleLinks(leader.main)}</td><td>${roleLinks(leader.support)}</td></tr>`).join('');
  document.getElementById('role-grid').innerHTML = roles.map(role => {
    const rest = role.rest.split(/\n\s*\n/);
    const body = rest.map(block => {
      if (block.startsWith('**Responsibilities:**')) return '<h4>Responsibilities</h4>' + markdown(block.replace(/^\*\*Responsibilities:\*\*\n?/, ''));
      if (block.startsWith('**Authority:**') || block.startsWith('**Coordination:**')) return '<div class="authority-box">' + markdown(block) + '</div>';
      return markdown(block);
    }).join('');
    return `<details open class="role-card ${role.category}" id="role-${role.index}" data-index="${role.index}"><summary><div class="card-top"><span class="card-number">${String(role.index + 1).padStart(2, '0')} / ${t(role.category.toUpperCase())}</span></div><h3>${escape(shortNames[role.index])}</h3><p class="role-description">${inline(role.intro)}</p>${role.main ? `<div class="card-owners"><span class="role-badge main-badge">MAIN</span><span>${escape(role.main)}</span></div>` : ''}${role.support ? `<div class="card-owners"><span class="role-badge support-badge">SUPPORT</span><span>${escape(role.support)}</span></div>` : ''}<div class="card-open"><span>Responsibilities & ${role.main ? 'authority' : 'coordination'}</span><span aria-hidden="true">+</span></div></summary><div class="role-body"><h4>${escape(role.title)}</h4>${body}</div></details>`;
  }).join('');

  const decisions = data.decisions;
  document.getElementById('decisions-intro').innerHTML = markdown(decisions.split('**Decisions leaders')[0].trim());
  document.getElementById('independent-list').innerHTML = decisions.split('**Decisions leaders can generally make independently:**')[1].split('**Decisions requiring leadership alignment:**')[0].trim().split('\n').filter(line => line.startsWith('- ')).map(line => '<li>' + inline(line.slice(2)) + '</li>').join('');
  const aligned = decisions.split('**Decisions requiring leadership alignment:**')[1].trim();
  document.getElementById('aligned-list').innerHTML = aligned.split('\n').filter(line => line.startsWith('- ')).map(line => '<li>' + inline(line.slice(2)) + '</li>').join('');
  document.getElementById('decision-note').textContent = aligned.split('\n\n').slice(1).join('\n\n');
  const principles = data.collaboration.split('### Weekly Leadership Check-in')[0].split(/\n\s*\n/).filter(block => block.startsWith('**'));
  document.getElementById('principles').innerHTML = principles.map((block, index) => {
    const [,title,body] = block.match(/^\*\*(.*?)\*\*\s*([\s\S]*)$/);
    return `<article class="principle"><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escape(title)}</h3><p>${inline(body)}</p></div></article>`;
  }).join('');
  document.getElementById('culture-content').innerHTML = markdown(data.culture.replace(/\*\*Bada Bing, Bada Boom!\*\*/, '').trim());

  const search = document.getElementById('role-search');
  const cards = [...document.querySelectorAll('.role-card')];
  let activeCategory = 'all';
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function updateRoles() {
    const query = normalize(search.value.trim());
    let count = 0;
    cards.forEach((card, index) => {
      const role = roles[index];
      const matches = (activeCategory === 'all' || role.category === activeCategory) && normalize(role.title + ' ' + role.body + ' ' + shortNames[index]).includes(query);
      card.hidden = !matches;
      if (matches) count++;
    });
    document.getElementById('empty-state').hidden = count > 0;
    document.getElementById('results-count').textContent = t('Showing {n} of {total} roles').replace('{n}',count).replace('{total}',roles.length);
    syncExpand();
  }
  function syncExpand() {
    const visible = cards.filter(card => !card.hidden);
    const expanded = visible.length > 0 && visible.every(card => card.open);
    const button = document.getElementById('expand-all');
    button.innerHTML = `${t(expanded ? 'Collapse all' : 'Expand all')} <span>${expanded ? '−' : '+'}</span>`;
    button.disabled = visible.length === 0;
  }
  function selectCategory(category) {
    activeCategory = category;
    document.querySelectorAll('.filter').forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  search.addEventListener('input', updateRoles);
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { selectCategory(button.dataset.filter); updateRoles(); }));
  document.getElementById('expand-all').addEventListener('click', () => {
    const visible = cards.filter(card => !card.hidden);
    const expand = !visible.every(card => card.open);
    visible.forEach(card => { card.open = expand; });
    syncExpand();
  });
  cards.forEach(card => card.addEventListener('toggle', syncExpand));
  document.querySelectorAll('[data-leader]').forEach(button => button.addEventListener('click', () => {
    selectCategory('all'); search.value = button.dataset.leader; updateRoles();
    document.getElementById('roles').scrollIntoView({behavior:'smooth'});
    search.focus({preventScroll:true});
  }));
  document.querySelectorAll('[data-role]').forEach(link => link.addEventListener('click', () => {
    selectCategory('all'); search.value = ''; updateRoles(); cards[Number(link.dataset.role)].open = true;
  }));
  const navLinks = [...document.querySelectorAll('.nav-link')];
  function markActive(id) {
    navLinks.forEach(link => {
      const selected = link.hash === '#' + id;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }
  navLinks.forEach(link => link.addEventListener('click', () => markActive(link.hash.slice(1))));
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => markActive(entry.target.id));
  }, {rootMargin:'-10% 0px -65% 0px', threshold:0});
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
      event.preventDefault(); document.getElementById('roles').scrollIntoView(); search.focus({preventScroll:true});
    }
  });
  let detailsState = [];
  window.addEventListener('beforeprint', () => {
    detailsState = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
    detailsState.forEach(([detail]) => {detail.open = true;});
  });
  window.addEventListener('afterprint', () => detailsState.forEach(([detail, open]) => {detail.open = open;}));
  document.getElementById('print-button').addEventListener('click', () => window.print());
  updateRoles();
  // Localize static text nodes without replacing links, details, or controls.
  const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement.closest('script,style,option')) return;
    const source = node.textContent.trim();
    if (dictionary[source]) node.textContent = node.textContent.replace(source,t(source));
  });
  document.querySelectorAll('[placeholder],[aria-label]').forEach(element => {
    for (const attribute of ['placeholder','aria-label']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute,t(element.getAttribute(attribute)));
    }
  });
  if (/^#role-\d+$/.test(location.hash)) {
    const target = document.querySelector(location.hash);
    if (target) { target.open = true; requestAnimationFrame(() => target.scrollIntoView()); }
  }
})();
