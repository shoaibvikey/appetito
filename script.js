const menuToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('.primary-navigation');
if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNavigation.classList.toggle('is-open', !isOpen);
  });
  primaryNavigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryNavigation.classList.remove('is-open');
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const priceLabels = document.querySelectorAll('.menu-content .item-heading > span');
const proteinArt = {
  chicken: '<svg viewBox="0 0 28 20"><path d="M3 12.5C1.7 9.3 3.3 5.5 6.8 3.3c3.4-2.2 7.6-1.2 9.5 1.7 1.4 2.2 1.2 5.6-.7 7.9-2.7 3.3-9.9 3.6-12.6-.4Z" fill="#dca34b" stroke="#403b32" stroke-width="1.4" stroke-linejoin="round"/><path d="m15 6 4-3" fill="none" stroke="#403b32" stroke-width="4.1" stroke-linecap="round"/><path d="m15 6 4-3" fill="none" stroke="#fffaf1" stroke-width="2.3" stroke-linecap="round"/><circle cx="18.5" cy="2.5" r="2" fill="#fffaf1" stroke="#403b32" stroke-width="1.1"/><circle cx="21" cy="1.8" r="1.7" fill="#fffaf1" stroke="#403b32" stroke-width="1.1"/><circle cx="21.5" cy="4" r="1.7" fill="#fffaf1" stroke="#403b32" stroke-width="1.1"/><path d="M6 7q3-3 6-1" fill="none" stroke="#f8d989" stroke-width="1.2" stroke-linecap="round"/></svg>',
  egg: '<svg viewBox="0 0 24 24"><path d="M12 2c4 0 8 7 8 12a8 8 0 0 1-16 0c0-5 4-12 8-12Z" fill="#fffaf1" stroke="#403b32" stroke-width="1.5"/><circle cx="12" cy="14" r="3.5" fill="#e6b84e" stroke="#c98b48" stroke-width="1"/><circle cx="10.8" cy="12.8" r=".8" fill="#fff2d4"/></svg>',
  prawns: '<svg viewBox="0 0 28 22"><path d="M6 16C2.5 12.8 3.2 6.6 8 4.3c4.5-2.2 9 .5 10 4.2 1 3.5-1.2 6.5-4.4 7-2.7.4-4.6-1.6-3.5-3.5.6-1 1.8-1.4 2.8-.8" fill="none" stroke="#403b32" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 16C2.5 12.8 3.2 6.6 8 4.3c4.5-2.2 9 .5 10 4.2 1 3.5-1.2 6.5-4.4 7-2.7.4-4.6-1.6-3.5-3.5.6-1 1.8-1.4 2.8-.8" fill="none" stroke="#df8970" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 16-3 3 1-5m2-6 4 2m1-5 4 3m3 2-4 1m-7 7-2 3m6-4-1 4m10-11 5-5m-4 7 7-2" fill="none" stroke="#403b32" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="7" r=".8" fill="#403b32"/><path d="m5 8 2 2m4-5 2 3m4 1-3 2" stroke="#a95848" stroke-width="1" stroke-linecap="round"/></svg>'
};
priceLabels.forEach((price) => {
  const original = price.textContent;
  const labels = [...original.matchAll(/\b(Vegan|Veg|Chicken|Egg|Prawns?|Shrimp)\b/gi)];
  if (!labels.length) return;
  const content = document.createDocumentFragment();
  let cursor = 0;
  labels.forEach((match) => {
    content.append(document.createTextNode(original.slice(cursor, match.index)));
    const label = match[0].toLowerCase();
    const kind = label === 'chicken' ? 'chicken' : label === 'egg' ? 'egg' : /prawns?|shrimp/.test(label) ? 'prawns' : label === 'vegan' ? 'vegan' : 'vegetarian';
    if (kind === 'vegetarian' || kind === 'vegan') {
      const dot = document.createElement('i');
      dot.className = `protein-dot ${kind}`;
      dot.setAttribute('aria-hidden', 'true');
      content.append(dot);
    } else {
      const art = document.createElement('span');
      art.className = `protein-art protein-${kind}`;
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = proteinArt[kind];
      content.append(art);
    }
    const spokenLabel = document.createElement('b');
    spokenLabel.className = 'menu-sr-only';
    spokenLabel.textContent = kind === 'vegetarian' ? 'Vegetarian' : kind === 'vegan' ? 'Vegan' : kind === 'prawns' ? 'Prawns' : match[0];
    content.append(spokenLabel);
    cursor = match.index + match[0].length;
  });
  content.append(document.createTextNode(original.slice(cursor)));
  price.replaceChildren(content);
});
const search = document.querySelector('#menu-search');
if (search) {
  const items = [...document.querySelectorAll('.menu-item')];
  const sections = [...document.querySelectorAll('[data-menu-section]')];
  const status = document.querySelector('.search-status');
  const searchMenu = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
      item.hidden = !matches;
      if (matches) visible++;
    });
    sections.forEach((section) => {
      section.hidden = ![...section.querySelectorAll('.menu-item')].some((item) => !item.hidden);
    });
    status.textContent = query ? `${visible} menu ${visible === 1 ? 'item' : 'items'} found for “${search.value.trim()}”.` : '';
  };
  search.addEventListener('input', searchMenu);
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; searchMenu(); search.blur(); }
  });
}

// Distinct, menu-specific SVG artwork for every dish and drink card.
const menuArtwork = [...document.querySelectorAll('.menu-content .menu-item')];
const artPalettes = [
  {tomato:'#d97051',gold:'#e6b84e',green:'#718b4d',cream:'#f3e5c5',brown:'#79533d',blue:'#8caeb2',pink:'#ce8490'},
  {tomato:'#cc694d',gold:'#dcae52',green:'#648c61',cream:'#eee0c8',brown:'#76523f',blue:'#83a8ae',pink:'#d58d83'},
  {tomato:'#df805f',gold:'#eac85c',green:'#82965b',cream:'#f5e9d2',brown:'#795744',blue:'#7ea5a1',pink:'#c9808c'},
  {tomato:'#c9634e',gold:'#ddb653',green:'#6f9160',cream:'#eee4d0',brown:'#684b3d',blue:'#8ba5b6',pink:'#d48b78'},
  {tomato:'#d9795b',gold:'#e3b85b',green:'#678451',cream:'#f4e6c9',brown:'#835b3d',blue:'#83a4b0',pink:'#cc7b87'}
];
const artInk = '#403b32';
function artHash(value){let h=2166136261;for(const ch of value){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function artRandom(seed){let n=seed>>>0;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296}}
function artPlate(p){return `<ellipse cx="28" cy="35" rx="24" ry="16" fill="#fffaf1" stroke="${artInk}" stroke-width="1.5"/><ellipse cx="28" cy="35" rx="19.5" ry="11.5" fill="none" stroke="#ded7c9" stroke-width="1"/>`}
function artToppings(rand,p,count=5){const colors=[p.tomato,p.green,p.gold,p.brown,p.blue];let out='';for(let i=0;i<count;i++){const x=15+rand()*26,y=23+rand()*18,r=1.1+rand()*1.4;if(i%4===0){out+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}q${(r*1.5).toFixed(1)} -${(r*2).toFixed(1)} ${(r*3).toFixed(1)} -${(r*1.2).toFixed(1)}q-${r.toFixed(1)} ${(r*2).toFixed(1)} -${(r*3).toFixed(1)} ${r.toFixed(1)}Z" fill="${colors[i%colors.length]}"/>`}else{out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${colors[i%colors.length]}"/>`}}return out}
function bowlShape(p,fill=p.cream){return `<path d="M7 28q21 7 42 0l-4 14q-2 8-17 9-15-1-17-9L7 28Z" fill="${fill}" stroke="${artInk}" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 28q21 7 42 0" fill="none" stroke="${artInk}" stroke-width="1.6"/>`}
function artType(item){
  const section=item.closest('[data-menu-section]')?.id||'';
  const title=item.querySelector('.item-heading h3')?.textContent.trim()||'';
  const name=title.toLowerCase();
  const sub=item.closest('.menu-subsection')?.querySelector('.subsection-title')?.textContent.trim().toLowerCase()||'';
  if(section==='pizza')return'pizza';
  if(section==='drinks')return'drink';
  if(section==='pastas')return'pasta';
  if(section==='desserts')return'dessert';
  if(section==='burgers')return'burger';
  if(section==='dim-sum')return'dimsum';
  if(section==='salads-soups')return /soup|manchow|wonton|hot & sour|mushroom/i.test(name)?'soup':'salad';
  if(section==='rice-noodles')return sub.includes('noodle')?'noodles':'rice';
  if(/fries/.test(name))return'fries';
  if(/nachos/.test(name))return'nachos';
  if(/corn/.test(name))return'corn';
  if(/spring rolls|rolls|cigarillos/.test(name))return'rolls';
  if(/cheese sticks|sticks/.test(name))return'sticks';
  if(/fish|ikan/.test(name))return'fish';
  if(/prawns|prawn|shrimp/.test(name))return'prawn';
  if(/wings|chicken/.test(name))return'chicken';
  if(/dim sum|dumpling|wonton/.test(name))return'dimsum';
  if(/pasta|penne|spaghetti|fettuccini|tortellini|lasagna|aglio/.test(name))return'pasta';
  if(/tiramisu|affogato|brownie|cheesecake|panna cotta|ice cream/.test(name))return'dessert';
  if(/soup|khow suey|ramen/.test(name))return'soup';
  if(/salad|lettuce|greens|falafel/.test(name))return'salad';
  if(/rice/.test(name)||sub.includes('rice'))return'rice';
  if(/noodles|hakka|chilli garlic/.test(name)||sub.includes('noodle'))return'noodles';
  if(/mezze|platter/.test(name))return'platter';
  if(/enchilada|quesadilla|wrap|taquito|pita|burrito/.test(name))return'wrap';
  if(/curry|dal|risotto|kadai|makhani|paneer/.test(name))return'curry';
  if(/vegetable|veggie|lotus stem|broccoli/.test(name))return'vegetables';
  if(/chicken/.test(name))return'chicken';
  return'plate';
}
function artFor(item,index){
  const title=item.querySelector('.item-heading h3')?.textContent.trim()||`dish-${index}`;
  const seed=artHash(`${title}-${index}`),rand=artRandom(seed),p=artPalettes[seed%artPalettes.length];
  const type=artType(item),dots=artToppings(rand,p,4+seed%4);
  let drawing='';
  if(type==='pizza'){
    drawing=`<circle cx="28" cy="29" r="23" fill="${p.gold}" stroke="${artInk}" stroke-width="1.6"/><circle cx="28" cy="29" r="18.5" fill="${p.tomato}"/><circle cx="28" cy="29" r="15" fill="${p.cream}"/>${dots}<path d="M11 23q3-8 9-10m17 1q6 3 8 9" fill="none" stroke="#c68a49" stroke-width="1.5" stroke-linecap="round"/>`;
  }else if(type==='pasta'){
    drawing=`${artPlate(p)}<path d="M13 33c4-13 18-10 13 0s13 11 17 0-9-12-12-3 6 15 14 8M14 39c8 5 12-3 18-3s8 7 14 4M17 26c3-5 8-4 10 0" fill="none" stroke="${p.gold}" stroke-width="2.5" stroke-linecap="round"/><path d="M16 31q4-3 7 0m14 11q4-3 7 0" fill="none" stroke="${p.tomato}" stroke-width="1.5" stroke-linecap="round"/>${dots}`;
  }else if(type==='burger'){
    drawing=`${artPlate(p)}<path d="M12 30c0-8 7-13 16-13s16 5 16 13v2H12v-2Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.5"/><path d="m16 23 2-1m6-3 1 2m7-2 2 2m5 1 2-1" stroke="#fff4ce" stroke-width="1.5" stroke-linecap="round"/><path d="M12 32h32l-3 4-4-2-4 3-5-3-5 3-4-3-4 2-3-4Z" fill="${p.green}" stroke="${artInk}" stroke-width="1.2"/><path d="M13 36h30v5H13Z" fill="${p.brown}" stroke="${artInk}" stroke-width="1.2"/><path d="m14 39 9 4h15l5-4" fill="${p.gold}" stroke="${artInk}" stroke-width="1.2"/><path d="M13 44q15 7 30 0v-2H13Z" fill="#e8b878" stroke="${artInk}" stroke-width="1.4"/>`;
  }else if(type==='salad'||type==='vegetables'){
    const leaves=Array.from({length:7},(_,i)=>{const x=14+rand()*27,y=23+rand()*17,rot=Math.round(rand()*110-55),c=i%2?p.green:'#8da568';return`<path d="M${x.toFixed(1)} ${y.toFixed(1)}q-5-8 1-10 7 4-1 10Zm0 0 1-5" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}" stroke="${artInk}" stroke-width=".8"/>`}).join('');
    drawing=`${artPlate(p)}${leaves}${dots}`;
  }else if(type==='soup'){
    drawing=`<path d="M7 29q21 8 42 0l-3 13q-2 8-18 9Q12 49 10 42L7 29Z" fill="${p.cream}" stroke="${artInk}" stroke-width="1.6"/><ellipse cx="28" cy="29" rx="21" ry="6" fill="${p.tomato}" stroke="${artInk}" stroke-width="1.4"/><path d="M17 18q-4-4 0-8m10 8q-4-4 0-8m10 8q-4-4 0-8" fill="none" stroke="${p.gold}" stroke-width="1.5" stroke-linecap="round"/>${dots}`;
  }else if(type==='rice'){
    const grains=Array.from({length:13},()=>`<path d="M${(14+rand()*28).toFixed(1)} ${(23+rand()*9).toFixed(1)}l2 1" stroke="#fffaf0" stroke-width="1.2" stroke-linecap="round"/>`).join('');
    drawing=`${bowlShape(p)}<ellipse cx="28" cy="28" rx="19" ry="7" fill="#fffaf0" stroke="${artInk}" stroke-width="1.2"/>${grains}${dots}`;
  }else if(type==='noodles'){
    drawing=`${bowlShape(p)}<ellipse cx="28" cy="28" rx="19" ry="7" fill="${p.gold}" stroke="${artInk}" stroke-width="1.2"/><path d="M13 27c3-10 8 6 12-2s7 7 11-1 6 5 9 1M16 28c3 8 6-5 10 2s7-7 10 0 6-4 8-2M32 6l13 16M38 5l12 15" fill="none" stroke="${p.brown}" stroke-width="1.8" stroke-linecap="round"/>${dots}`;
  }else if(type==='dimsum'){
    drawing=`<rect x="6" y="18" width="44" height="29" rx="12" fill="#e9d6ad" stroke="${artInk}" stroke-width="1.5"/><path d="M9 39h38M11 44h34" stroke="#bd9867" stroke-width="1"/><ellipse cx="17" cy="27" rx="7" ry="8" fill="${p.cream}" stroke="${artInk}" stroke-width="1.2"/><ellipse cx="29" cy="25" rx="7" ry="8" fill="#fff7e6" stroke="${artInk}" stroke-width="1.2"/><ellipse cx="40" cy="28" rx="7" ry="8" fill="${p.cream}" stroke="${artInk}" stroke-width="1.2"/><path d="m14 23 3 3 3-3m6-2 3 3 3-3m5 3 3 3 3-3" fill="none" stroke="${p.gold}" stroke-width="1.2" stroke-linecap="round"/>`;
  }else if(type==='drink'){
    const n=item.querySelector('.item-heading h3')?.textContent.trim().toLowerCase()||'';
    const coffee=/coffee|espresso|americano|cappuccino|latte|mocha|tea|matcha/.test(n)&&!/iced|cold|shake/.test(n);
    const shake=/shake|colada/.test(n);
    const liquid=/mango|mandarin|orange|pineapple/.test(n)?p.gold:/matcha|mojito|lime|elderflower|jasmine|green tea/.test(n)?p.green:/berry|strawberry|watermelon|plum/.test(n)?p.pink:p.blue;
    if(coffee){drawing=`<path d="M12 20h30v21q0 7-7 7H19q-7 0-7-7V20Z" fill="${p.cream}" stroke="${artInk}" stroke-width="1.6"/><path d="M42 25h4a6 6 0 0 1 0 12h-4" fill="none" stroke="${artInk}" stroke-width="1.6"/><ellipse cx="27" cy="21" rx="15" ry="5" fill="${liquid}" stroke="${artInk}" stroke-width="1.4"/><path d="M20 21q7-6 14 0-7 5-14 0Z" fill="#fff2d3"/>`;}
    else if(shake){drawing=`<path d="m13 18 30 0-4 30H17l-4-30Z" fill="${liquid}" stroke="${artInk}" stroke-width="1.6"/><path d="M12 18q16-8 32 0l-2 5H14l-2-5Z" fill="#fff6e7" stroke="${artInk}" stroke-width="1.4"/><path d="m31 5 8 15" stroke="${artInk}" stroke-width="1.7" stroke-linecap="round"/><circle cx="28" cy="17" r="2" fill="${p.pink}"/>`;}
    else{drawing=`<path d="m15 17 27 0-4 32H19l-4-32Z" fill="${liquid}" stroke="${artInk}" stroke-width="1.6"/><path d="M13 17h31M28 5l7 14" fill="none" stroke="${artInk}" stroke-width="1.7" stroke-linecap="round"/><circle cx="24" cy="27" r="4" fill="#fffaf1" fill-opacity=".72"/><circle cx="34" cy="36" r="4" fill="#fffaf1" fill-opacity=".72"/><path d="M18 22h21" stroke="#fffaf1" stroke-width="1.2"/>${/mojito|lime|mango|mandarin|orange|pineapple/.test(n)?`<circle cx="43" cy="14" r="5" fill="${p.gold}" stroke="${artInk}" stroke-width="1.2"/><path d="M43 10v8m-4-4h8" stroke="#fffaf1" stroke-width="1"/>`:''}`;}
  }else if(type==='dessert'){
    const n=item.querySelector('.item-heading h3')?.textContent.trim().toLowerCase()||'';
    if(/ice cream|affogato/.test(n)){drawing=`${artPlate(p)}<path d="m18 36 10 14 10-14H18Z" fill="#d8a16c" stroke="${artInk}" stroke-width="1.3"/><circle cx="28" cy="27" r="10" fill="#fff5dc" stroke="${artInk}" stroke-width="1.3"/><path d="M25 26q3-4 6 0" fill="none" stroke="${p.brown}" stroke-width="1.4" stroke-linecap="round"/><path d="M34 18q6-4 9 2" stroke="${p.brown}" stroke-width="1.5" fill="none"/>`;}
    else if(/cheesecake|panna cotta/.test(n)){drawing=`${artPlate(p)}<path d="M15 25h25v18H15z" fill="${p.cream}" stroke="${artInk}" stroke-width="1.4"/><path d="M15 25h25v5H15z" fill="${p.gold}"/><path d="M15 37h25v6H15z" fill="#fff8e8"/><circle cx="34" cy="22" r="3" fill="${p.tomato}"/><path d="M18 45h20" stroke="${p.brown}" stroke-width="1.5" stroke-linecap="round"/>`;}
    else{drawing=`${artPlate(p)}<path d="M14 42 27 20l14 22H14Z" fill="${p.brown}" stroke="${artInk}" stroke-width="1.4"/><path d="m18 36 19 0m-14-6 11 0m-5-10 9 20" stroke="#f5e4c8" stroke-width="2"/><circle cx="27" cy="18" r="3" fill="${p.pink}"/>`;}
  }else if(type==='fries'){
    drawing=`<path d="m14 26 2-15m7 14 1-18m7 18 2-17m7 17 3-14" stroke="${p.gold}" stroke-width="4" stroke-linecap="round"/><path d="m9 25 39 1-4 25H13L9 25Z" fill="${p.tomato}" stroke="${artInk}" stroke-width="1.6"/><path d="m13 32 32 1m-29 10 26 1" stroke="#fff1db" stroke-width="1.4"/>`;
  }else if(type==='nachos'){
    drawing=`${artPlate(p)}<path d="m12 39 9-20 11 20H12Zm13 2 9-20 11 20H25Zm-7-13 8-16 8 16H18Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.2"/>${dots}`;
  }else if(type==='corn'){
    drawing=`${artPlate(p)}<path d="M15 23q13-12 26 0v17q-13 12-26 0V23Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.5"/>${Array.from({length:12},(_,i)=>`<circle cx="${19+(i%3)*6}" cy="${25+Math.floor(i/3)*4}" r="1.2" fill="#fff0b1"/>`).join('')}<path d="M15 36q-6 1-5 9 6 0 9-4m18-3q8 1 7 9-6 0-10-4" fill="${p.green}" stroke="${artInk}" stroke-width="1.2"/>`;
  }else if(type==='rolls'||type==='sticks'){
    drawing=`${artPlate(p)}<g transform="rotate(-18 28 34)"><rect x="13" y="20" width="30" height="7" rx="3.5" fill="${type==='sticks'?p.cream:p.gold}" stroke="${artInk}" stroke-width="1.3"/><rect x="11" y="30" width="32" height="7" rx="3.5" fill="${p.gold}" stroke="${artInk}" stroke-width="1.3"/><rect x="14" y="40" width="28" height="7" rx="3.5" fill="${type==='sticks'?p.cream:p.tomato}" stroke="${artInk}" stroke-width="1.3"/></g><circle cx="46" cy="23" r="3" fill="${p.green}"/>`;
  }else if(type==='fish'){
    drawing=`${artPlate(p)}<path d="M11 34q14-17 29 0-15 17-29 0Zm29 0 8-7v14l-8-7Z" fill="${p.blue}" stroke="${artInk}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="32" r="1.3" fill="${artInk}"/><path d="M25 27q5 7 0 14" fill="none" stroke="#fffaf1" stroke-width="1.2"/>`;
  }else if(type==='prawn'){
    drawing=`${artPlate(p)}<path d="M16 40q-9-13 2-20 11-7 18 3 5 8-2 14-5 5-14 1" fill="none" stroke="${p.pink}" stroke-width="7" stroke-linecap="round"/><path d="M16 40q-9-13 2-20 11-7 18 3 5 8-2 14-5 5-14 1m3-17 2 7m5-7 2 7m4-4 2 6m-17 7-6 5m12-3-2 6" fill="none" stroke="${artInk}" stroke-width="1.2" stroke-linecap="round"/><circle cx="16" cy="19" r="1.3" fill="${artInk}"/>`;
  }else if(type==='chicken'){
    drawing=`${artPlate(p)}<path d="M18 24q8-8 16 0l6 9q4 7-4 11-7 4-12-3l-8-8q-4-5 2-9Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.5"/><path d="m19 40-6 7m8-5-6 7m5-7 4 4" stroke="#fff4e1" stroke-width="2.5" stroke-linecap="round"/><path d="M27 25q6 4 9 11" fill="none" stroke="#fff1ce" stroke-width="1.2"/>`;
  }else if(type==='curry'){
    drawing=`<ellipse cx="28" cy="30" rx="22" ry="9" fill="${p.tomato}" stroke="${artInk}" stroke-width="1.4"/><path d="M7 30q2 16 21 19 19-3 21-19" fill="${p.cream}" stroke="${artInk}" stroke-width="1.6"/><ellipse cx="28" cy="30" rx="19" ry="6" fill="${p.gold}"/>${Array.from({length:4},()=>{const x=16+rand()*24,y=27+rand()*6;return`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="5" height="4" rx="1" fill="${p.cream}" stroke="${artInk}" stroke-width=".7" transform="rotate(${Math.round(rand()*35-17)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}).join('')}${dots}`;
  }else if(type==='wrap'){
    drawing=`${artPlate(p)}<path d="M12 40 25 17l20 22q-16 8-33 1Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.5" stroke-linejoin="round"/><path d="m17 37 10-15 14 16q-12 5-24-1Z" fill="${p.green}"/><circle cx="26" cy="31" r="2" fill="${p.tomato}"/><circle cx="34" cy="34" r="2" fill="${p.tomato}"/>`;
  }else if(type==='platter'){
    drawing=`${artPlate(p)}<circle cx="20" cy="31" r="7" fill="${p.tomato}"/><circle cx="36" cy="29" r="7" fill="${p.gold}"/><circle cx="28" cy="40" r="6" fill="${p.green}"/><path d="M16 30h8m8-2h8m-15 12h7" stroke="#fff6df" stroke-width="1.2" stroke-linecap="round"/>`;
  }else{
    drawing=`${artPlate(p)}<path d="M15 31q7-12 16-2l-3 12q-9 6-16-1l3-9Z" fill="${p.gold}" stroke="${artInk}" stroke-width="1.4"/><path d="M32 38q1-13 8-13 8 5 2 15l-8 3Z" fill="${p.green}" stroke="${artInk}" stroke-width="1.2"/>${dots}`;
  }
  return `<svg class="item-illustration item-art-${type}" viewBox="0 0 56 56" aria-hidden="true" focusable="false">${drawing}</svg>`;
}
menuArtwork.forEach((item,index)=>{if(!item.querySelector('.item-illustration'))item.insertAdjacentHTML('afterbegin',artFor(item,index))});

menuArtwork.forEach((item) => {
  const isSignature = [...item.querySelectorAll('small')].some((label) => /\bsignature\b/i.test(label.textContent));
  if (!isSignature || item.classList.contains('has-chef-cap')) return;
  item.classList.add('has-chef-cap');
  item.insertAdjacentHTML('afterbegin', '<svg class="signature-cap" viewBox="0 0 28 28" aria-hidden="true" focusable="false"><path d="M6.5 15c-2.2-.2-3.5-1.7-3.5-3.7 0-2.1 1.7-3.7 3.8-3.7.4-3 4.4-4.5 6.5-1.8 2.1-2.9 7-1.5 7.1 2 .3-.1.6-.2 1-.2 2.2 0 3.9 1.7 3.9 3.8 0 1.9-1.3 3.4-3.2 3.7v7H6.5v-7.1Z" fill="#fbfaf6" stroke="#403b32" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 17h15.6M7 20h14.7" fill="none" stroke="#db6e4f" stroke-width="1.5" stroke-linecap="round"/></svg>');
});


const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  const bookingDate = bookingForm.querySelector('[name="date"]');
  const bookingStatus = bookingForm.querySelector('#booking-status');
  const whatsappLink = bookingForm.querySelector('#booking-whatsapp-link');
  if (bookingDate) {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    bookingDate.min = localToday;
  }
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const message = [
      'Hi Appetito Club, I would like to request a table booking.',
      '',
      `Name: ${formData.get('name')}`,
      `Phone: ${formData.get('phone')}`,
      `Date: ${formData.get('date')}`,
      `Time: ${formData.get('time')}`,
      `Guests: ${formData.get('guests')}`,
      `Seating: ${formData.get('seating')}`,
      formData.get('notes') ? `Special requests: ${formData.get('notes')}` : '',
      '',
      'Please let me know if this time is available.'
    ].filter(Boolean).join('\n');
    whatsappLink.href = `https://wa.me/918860023344?text=${encodeURIComponent(message)}`;
    whatsappLink.hidden = false;
    bookingStatus.textContent = 'Your message is ready. Review it in WhatsApp and tap Send. Your booking is confirmed only after the restaurant replies.';
  });
}
