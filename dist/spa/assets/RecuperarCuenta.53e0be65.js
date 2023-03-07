import{c as m,Q as p,a as r,b as c}from"./QLayout.36a3868e.js";import{Q as _}from"./QFooter.9c503c6c.js";import{c as f,b as h,Q as g}from"./QCard.b7541241.js";import{r as v,E,O as A,J as a,G as t,K as e,R as b,H as x,M as Q,Q as C,D as R}from"./index.bcd47ac5.js";import{Q as w,a as y}from"./QForm.ddaefe14.js";import"./QResizeObserver.2a9dfcac.js";const I=e("div",{class:"row"},[e("div",{class:"col-12"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null,"SISTEMA DE GESTI\xD3N DEL INFORME FINAL DE CUMPLIMIENTO DEL TRABAJO ACAD\xC9MICO")])])],-1),N=e("div",{class:"col-12",align:"center"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null," UNIVERSIDAD NACIONAL DE LOJA - CARRERA DE COMPUTACI\xD3N")])],-1),D={class:"font flex flex-center fixed-center"},T=e("div",{class:"row no-padding no-margin header-login items-center",align:"center"},[e("div",{class:"col-12"},[e("h6",{class:"q-ma-none q-pa-md"},[e("b",null,"RECUPERAR CONTRASE\xD1A")])])],-1),q={class:"q-pa-md"},O=e("div",{class:"q-mb-none q-pb-none"}," Email institucional: ",-1),U={__name:"RecuperarCuenta",setup(S){const o=h(),n=v(null),u=x(),d=async()=>{await R.generarTokenRecuperacion(n.value,l=>{if(l.status!=200&&l.status!=201)return o.notify({color:"red-5",textColor:"white",icon:"mdi-email-alert",message:l.message});if(l.status==201)return o.notify({color:"green-5",textColor:"white",icon:"mdi-email-check",message:"Se envi\xF3 un email de recuperaci\xF3n a su correo"}),u.push({path:"/"});l.status==200&&o.notify({color:"orange-5",textColor:"white",icon:"mdi-email-search",message:"Ya se ha enviado un email de recuperaci\xF3n a su correo"})})};return(l,i)=>(E(),A(b,null,[a(m,{view:"hHh lpR fFf"},{default:t(()=>[a(p,{class:"bg-primary text-white"},{default:t(()=>[a(r,null,{default:t(()=>[a(c,{align:"center"},{default:t(()=>[I]),_:1})]),_:1})]),_:1}),a(_,null,{default:t(()=>[a(r,null,{default:t(()=>[a(c,null,{default:t(()=>[N]),_:1})]),_:1})]),_:1})]),_:1}),e("div",D,[a(f,{class:"",style:{"min-width":"350px"}},{default:t(()=>[T,a(g,{class:"no-marggin no-padding"}),e("div",q,[a(w,{onSubmit:d,class:"q-gutter-md"},{default:t(()=>[O,a(y,{class:"q-pt-none q-mt-xs",filled:"",modelValue:n.value,"onUpdate:modelValue":i[0]||(i[0]=s=>n.value=s),label:"Email *","lazy-rules":"",hint:"Ingrese el email institucional para recuperar su cuenta",rules:[s=>s&&s.length>0||"El campo se encuentra vacio",s=>s&&/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(s)||"Formato email no v\xE1lido"]},{prepend:t(()=>[a(Q,{name:"mail"})]),_:1},8,["modelValue","rules"]),e("div",null,[a(C,{label:"Enviar",type:"submit",color:"primary"})])]),_:1})])]),_:1})])],64))}};export{U as default};
