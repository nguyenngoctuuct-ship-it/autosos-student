const services=[
  {id:'battery',icon:'🔋',name:'Hết ắc quy',desc:'Kiểm tra, kích bình hoặc thay ắc quy tại chỗ.',price:150000},
  {id:'tire',icon:'🛞',name:'Vá hoặc thay lốp',desc:'Hỗ trợ vá lốp, thay lốp dự phòng an toàn.',price:120000},
  {id:'fuel',icon:'⛽',name:'Hết nhiên liệu',desc:'Cung cấp nhiên liệu tối thiểu để tiếp tục hành trình.',price:150000},
  {id:'start',icon:'⚡',name:'Xe không khởi động',desc:'Kiểm tra nhanh điện, đề, hệ thống khởi động.',price:200000},
  {id:'brake',icon:'🛑',name:'Bó cứng phanh',desc:'Đánh giá an toàn và hỗ trợ xử lý ban đầu.',price:250000},
  {id:'tow',icon:'🚚',name:'Kéo xe về garage',desc:'Điều phối phương tiện kéo xe đến nơi sửa chữa.',price:500000}
];
const configuredEndpoint=new URLSearchParams(location.search).get('sheet_endpoint');
if(configuredEndpoint){localStorage.setItem('autosos_sheet_endpoint',configuredEndpoint);history.replaceState({},'',location.pathname+location.hash);}
const defaultSheetEndpoint='https://script.google.com/macros/s/AKfycbxFC1LPsozxLgDP0X62c1I9XsJssSNaQOIpNd-vAJ7k0YfuJKW2iBAeMnA50oHzvrg/exec';
const fmt=n=>new Intl.NumberFormat('vi-VN').format(n)+' đ';
const grid=document.querySelector('#serviceGrid'),table=document.querySelector('#priceTable'),select=document.querySelector('#serviceSelect');
services.forEach(s=>{const icon=s.id==='tire'?'<span class="service-icon tire-icon" aria-label="Lốp xe"></span>':`<span class="service-icon">${s.icon}</span>`;grid.insertAdjacentHTML('beforeend',`<button class="service" data-service="${s.id}">${icon}<h3>${s.name}</h3><p>${s.desc}</p><span class="price">Từ ${fmt(s.price)}</span></button>`);table.insertAdjacentHTML('beforeend',`<div class="price-row"><span>${s.name}</span><span>Từ ${fmt(s.price)}</span></div>`);select.insertAdjacentHTML('beforeend',`<option value="${s.id}">${s.name} — từ ${fmt(s.price)}</option>`)});
const requestDialog=document.querySelector('#requestDialog'),quoteDialog=document.querySelector('#quoteDialog'),successDialog=document.querySelector('#successDialog');
document.querySelectorAll('[data-open-form]').forEach(b=>b.addEventListener('click',()=>requestDialog.showModal()));
grid.addEventListener('click',e=>{const b=e.target.closest('[data-service]');if(!b)return;select.value=b.dataset.service;requestDialog.showModal()});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
let payload;
document.querySelector('#requestForm').addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(e.currentTarget),s=services.find(x=>x.id===fd.get('service'));payload={time:new Date().toLocaleString('vi-VN'),name:fd.get('name'),phone:fd.get('phone'),location:fd.get('location'),service:s.name,price:s.price,note:fd.get('note'),status:'Đã báo giá'};document.querySelector('#quoteService').textContent=s.name;document.querySelector('#quotePrice').textContent='Từ '+fmt(s.price);document.querySelector('#quoteName').textContent=payload.name;requestDialog.close();quoteDialog.showModal()});
document.querySelector('#confirmQuote').addEventListener('click',async()=>{payload.agreed='Đồng ý';payload.technician='Nguyễn Văn Quang';payload.technicianPhone='0988686868';payload.status='Đã xác nhận';const endpoint=localStorage.getItem('autosos_sheet_endpoint')||defaultSheetEndpoint;try{await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});}catch(err){console.warn('Không thể gửi Sheet',err)}quoteDialog.close();successDialog.showModal()});
