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
  const current=PUNTOS.find(p=>p.day===dayNumber);
  const next=PUNTOS.map(p=>({...p,wait:(p.day-dayNumber+7)%7}))
    .filter(p=>p.wait>0).sort((a,b)=>a.wait-b.wait)[0];
  const card=document.querySelector('#today-card');
  const dateEl=document.querySelector('#today-date');
  const subtitle=document.querySelector('#today-subtitle');
  const streetEl=document.querySelector('#today-street');
  const localityEl=document.querySelector('#today-address');
  const noteEl=document.querySelector('#today-note');
  const mapEl=document.querySelector('#today-maps');
  const closure=document.querySelector('#no-service');
  const closedDay=document.querySelector('#closed-weekday');
  const nextDay=document.querySelector('#next-sale-day');
  if(!card||!dateEl||!subtitle||!streetEl||!localityEl||!noteEl||
     !mapEl||!closure||!closedDay||!nextDay)return;

  dateEl.textContent=date;
  const datePill=dateEl.closest('.date-pill');
  if(current){
    card.classList.remove('is-closed');
    subtitle.textContent='Ubicación de hoy';
    subtitle.hidden=false;
    datePill.hidden=false;
    streetEl.hidden=false;
    localityEl.hidden=false;
    noteEl.hidden=false;
    mapEl.hidden=false;
    closure.hidden=true;
    streetEl.textContent=current.street;
    localityEl.textContent=current.locality;
    noteEl.textContent=current.note;
    mapEl.href=current.maps;
    mapEl.querySelector('.maps-label').textContent='Abrir con Maps';
  }else if(next){
    card.classList.add('is-closed');
    subtitle.hidden=true;
    datePill.hidden=true;
    streetEl.hidden=true;
    localityEl.hidden=true;
    noteEl.hidden=true;
    mapEl.hidden=true;
    mapEl.removeAttribute('href');
    closure.hidden=false;
    const weekDays=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    closedDay.textContent=weekDays[dayNumber];
    nextDay.textContent=next.name.toLocaleUpperCase('es-MX');
  }
}

function highlightDay(){
  const {dayNumber}=getTodayInMexico();
  document.querySelectorAll('[data-day]').forEach(card=>{
    if(Number(card.dataset.day)===dayNumber)card.classList.add('is-today');
  });
}
document.addEventListener('DOMContentLoaded',()=>{updateHome();highlightDay();});