/** Puntos de venta originales del repositorio. No se inventan horarios ni números de lote. */
const PUNTOS = Object.freeze([
  {day:3, name:'Miércoles', street:'Av. Fresia', locality:'Col. Tepenepantla, 56337 Chimalhuacán, Méx.', note:'De Av. Corregidora hacia arriba, del lado derecho.', maps:'https://maps.app.goo.gl/GGbEVd7QthMhqy4E7'},
  {day:4, name:'Jueves', street:'Av. de la Constitución 1917 núm. 31', locality:'Venustiano Carranza, 56377 Ejido de Chicoloapan, Méx.', note:'Cerca de la tiendita «El Cacho y La Mari».', maps:'https://maps.app.goo.gl/q2r1huoDmkkPvYGN6'},
  {day:5, name:'Viernes', street:'Av. Fresno 832', locality:'Col. Copalera, 56337 Chimalhuacán, Méx.', note:'A la vuelta de la iglesia San José del Camino.', maps:'https://maps.app.goo.gl/ubGWqbQkadEjrwxW7'},
  {day:0, name:'Domingo', street:'Av. Fresia', locality:'Col. Tepenepantla, 56337 Chimalhuacán, Méx.', note:'De Av. Corregidora hacia arriba, del lado derecho.', maps:'https://maps.app.goo.gl/NMPvs71MTXVzo8e37'}
]);

// Fecha de la zona del negocio, independientemente del huso configurado en el teléfono.
function getTodayInMexico() {
  const now = new Date();
  const weekDay = new Intl.DateTimeFormat('en-US',{timeZone:'America/Mexico_City',weekday:'long'}).format(now);
  const dayNumber = {Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6}[weekDay];
  const date = new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);
  return {dayNumber,date:date.charAt(0).toUpperCase()+date.slice(1)};
}

function updateHome(){
  const {dayNumber,date} = getTodayInMexico();
  const current = PUNTOS.find(p=>p.day===dayNumber);
  const next = PUNTOS.map(p=>({...p,wait:(p.day-dayNumber+7)%7})).filter(p=>p.wait>0).sort((a,b)=>a.wait-b.wait)[0];
  const dateEl=document.querySelector('#today-date');
  const streetEl=document.querySelector('#today-street');
  const localityEl=document.querySelector('#today-address');
  const noteEl=document.querySelector('#today-note');
  const mapEl=document.querySelector('#today-maps');
  const whereEl=document.querySelector('#where-today');
  const subtitle=document.querySelector('#today-subtitle');
  if(!dateEl||!streetEl||!localityEl||!noteEl||!mapEl||!whereEl||!subtitle)return;
  dateEl.textContent=date;
  const active=current || next;
  if(!active)return;
  streetEl.textContent=active.street;
  localityEl.textContent=active.locality;
  noteEl.textContent=active.note;
  if(current){
    subtitle.textContent='Ubicación de hoy';
    mapEl.href=current.maps;
    mapEl.hidden=false;
    whereEl.href=current.maps;
    whereEl.target='_blank';
    whereEl.rel='noopener noreferrer';
    whereEl.querySelector('.button-text').textContent='Dónde estamos hoy';
  }else{
    subtitle.textContent='Próximo día de venta: '+next.name;
    mapEl.href=next.maps;
    mapEl.hidden=false;
    mapEl.querySelector('.maps-label').textContent='Ver próxima ubicación en Maps';
    // Días sin venta: no fingimos que hay un punto abierto hoy.
    whereEl.href='sucursales.html';
    whereEl.removeAttribute('target');
    whereEl.removeAttribute('rel');
    whereEl.querySelector('.button-text').textContent='Próxima ubicación';
  }
}

function highlightDay(){
  const {dayNumber}=getTodayInMexico();
  document.querySelectorAll('[data-day]').forEach(card=>{
    if(Number(card.dataset.day)===dayNumber)card.classList.add('is-today');
  });
}
document.addEventListener('DOMContentLoaded',()=>{updateHome();highlightDay();});