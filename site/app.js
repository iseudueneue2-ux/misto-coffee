'use strict';
const menu = [
  {id:'espresso',name:'Еспресо',category:'coffee',price:55,size:'30 мл',description:'Насичений смак і довгий післясмак.',image:'espresso'},
  {id:'cappuccino',name:'Капучино',category:'coffee',price:85,size:'250 мл',description:'Баланс еспресо та ніжної молочної піни.',image:'hero'},
  {id:'latte',name:'Лате',category:'coffee',price:95,size:'300 мл',description:'Більше молока. Більше ніжності.',image:'latte'},
  {id:'flatwhite',name:'Флет-вайт',category:'coffee',price:90,size:'180 мл',description:'Подвійний еспресо під оксамитовою піною.',image:'latte'},
  {id:'croissant',name:'Круасан',category:'pastry',price:75,size:'90 г · містить глютен і молоко',description:'Листковий, вершковий, до останньої крихти.',image:'croissant'},
  {id:'cookie',name:'Шоколадне печиво',category:'pastry',price:60,size:'70 г · містить глютен, молоко та яйця',description:'М’яка серединка та шматочки шоколаду.',image:'cookie'},
];
const key = 'misto-coffee-cart-v1';
let cart = {};
try {
  const stored = JSON.parse(localStorage.getItem(key) || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    for (const item of menu) if (Number.isInteger(stored[item.id]) && stored[item.id] > 0) cart[item.id] = Math.min(stored[item.id], 20);
  }
} catch { /* Private mode or invalid saved data: start with an empty cart. */ }
const products = document.getElementById('products');
const dialog = document.getElementById('cart-dialog');
const cartItems = document.getElementById('cart-items');
const toast = document.getElementById('toast');
let selected = 'all';
let toastTimer;
function money(value) { return `${value.toLocaleString('uk-UA')} грн`; }
function persist() { try {localStorage.setItem(key,JSON.stringify(cart));} catch {/* Cart remains usable in memory. */} }
function notify(message) {
  clearTimeout(toastTimer); toast.textContent = message; toast.hidden = false;
  toastTimer = setTimeout(() => {toast.hidden = true;}, 3000);
}
function renderMenu() {
  const visible = menu.filter(item => selected === 'all' || item.category === selected);
  const sort = document.getElementById('sort').value;
  if (sort === 'price-asc') visible.sort((a,b)=>a.price-b.price);
  if (sort === 'price-desc') visible.sort((a,b)=>b.price-a.price);
  products.innerHTML = visible.map(item=>`<article class="product"><img class="product-photo" src="assets/${item.image}.jpg" alt="${item.name}: приклад подачі" width="650" height="500" loading="lazy"><div class="product-line"><h3>${item.name}</h3><span class="product-price">${money(item.price)}</span></div><p class="product-description">${item.description}</p><div class="product-footer"><span class="product-size">${item.size}</span><button class="add-button" data-add="${item.id}" aria-label="Додати ${item.name} у кошик">Додати <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div></article>`).join('');
  document.getElementById('filter-status').textContent = `Показано позицій: ${visible.length}.`;
}
function renderCart() {
  const entries = menu.filter(item=>cart[item.id]);
  const count = entries.reduce((sum,item)=>sum+cart[item.id],0);
  const total = entries.reduce((sum,item)=>sum+cart[item.id]*item.price,0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('open-cart').setAttribute('aria-label', `Відкрити кошик, товарів: ${count}`);
  document.getElementById('cart-total').textContent = money(total);
  document.getElementById('save-order').disabled = !count;
  document.getElementById('clear-cart').disabled = !count;
  cartItems.innerHTML = entries.length ? entries.map(item=>`<article class="cart-item"><img src="assets/${item.image}.jpg" alt="" width="64" height="74"><div><h3>${item.name}</h3><p>${money(item.price * cart[item.id])}</p></div><div class="quantity"><button data-change="${item.id}" data-step="-1" aria-label="Зменшити кількість: ${item.name}">−</button><span aria-label="Кількість">${cart[item.id]}</span><button data-change="${item.id}" data-step="1" aria-label="Збільшити кількість: ${item.name}" ${cart[item.id]>=20?'disabled':''}>+</button></div></article>`).join('') : '<p class="cart-empty">Тут поки порожньо.<br>Оберіть каву або щось до неї в меню.</p>';
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  selected = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  renderMenu();
}));
document.getElementById('sort').addEventListener('change',renderMenu);
products.addEventListener('click',event=>{
  const button = event.target.closest('[data-add]'); if(!button) return;
  const id = button.dataset.add;
  const item = menu.find(item=>item.id===id);
  if ((cart[id]||0)>=20) {notify('До 20 одиниць однієї позиції в демо.');return;}
  cart[id]=(cart[id]||0)+1;persist();renderCart();notify(`${item.name} додано у кошик`);
});
document.getElementById('open-cart').addEventListener('click',()=>{
  document.getElementById('cart-status').textContent='';
  renderCart();dialog.showModal();
});
document.getElementById('close-cart').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
cartItems.addEventListener('click',event=>{
  const button=event.target.closest('[data-change]');if(!button)return;
  const id=button.dataset.change,step=Number(button.dataset.step);
  cart[id]=Math.max(0,Math.min(20,(cart[id]||0)+step));if(!cart[id])delete cart[id];
  persist();renderCart();
  const replacement=cartItems.querySelector(`[data-change="${id}"][data-step="${step}"]`);
  if(replacement&&!replacement.disabled)replacement.focus();else document.getElementById('close-cart').focus();
  document.getElementById('cart-status').textContent='Кошик оновлено.';
});
document.getElementById('clear-cart').addEventListener('click',()=>{cart={};persist();renderCart();document.getElementById('cart-status').textContent='Кошик очищено.';document.getElementById('close-cart').focus();});
document.getElementById('save-order').addEventListener('click',()=>{
  const entries=menu.filter(item=>cart[item.id]);if(!entries.length)return;
  const total=entries.reduce((sum,item)=>sum+cart[item.id]*item.price,0);
  const content='Misto Coffee — демонстраційний список\n\n'+entries.map(item=>`${item.name} × ${cart[item.id]} — ${money(item.price*cart[item.id])}`).join('\n')+`\n\nРазом: ${money(total)}\n\nЦе демо. Замовлення не надсилалося, оплати немає.\n`;
  const url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='misto-order.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.getElementById('cart-status').textContent='Список підготовлено для завантаження. Кошик збережено.';
});
renderMenu();renderCart();
