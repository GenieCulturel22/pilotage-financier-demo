(function(root){
 'use strict';
 const cents=n=>Math.round((n+Number.EPSILON)*100);
 function monthIndex(date,monthly){const m=String(date).match(/^(\d{4})-(\d{2})-\d{2}$/);if(!m)return -1;return monthly.findIndex(x=>{let p=x.label.split('.');return p[2]===m[1]&&p[1]===m[2]});}
 function simulate(monthly,events){
  let cash=0,vat=0;
  const deltas=monthly.map(()=>({cash:0,vat:0}));
  for(const e of events){
   if(!Number.isFinite(e.amount)||!Number.isFinite(e.rate)||e.rate<0||e.rate>1)throw Error('Montant ou taux invalide');
   const i=monthIndex(e.date,monthly);if(i<0)throw Error('Date hors horizon');
   deltas[i].cash+=cents(e.amount);deltas[i].vat+=cents(e.amount*e.rate);
  }
  return monthly.map((m,i)=>{cash+=deltas[i].cash;vat+=deltas[i].vat;return {...m,simClose:(cents(m.close)+cash)/100,simAfterVat:(cents(m.afterVat)+cash-vat)/100,delta:cash/100,reserveDelta:vat/100};});
 }
 const api={simulate,monthIndex,cents};root.FinanceDemo=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
