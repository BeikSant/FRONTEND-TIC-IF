import{c as y,Q as E,a as m,b as p}from"./QLayout.36a3868e.js";import{Q as w}from"./QFooter.9c503c6c.js";import{c as I,b as x,Q as A}from"./QCard.b7541241.js";import{Q as C,a as v}from"./QForm.ddaefe14.js";import{r as u,C as Q,E as N,O as R,J as a,G as l,K as e,R as D,H as O,M as S,Q as f}from"./index.bcd47ac5.js";import"./QResizeObserver.2a9dfcac.js";const q=e("div",{class:"row"},[e("div",{class:"col-12"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null,"SISTEMA DE GESTI\xD3N DEL INFORME FINAL DE CUMPLIMIENTO DEL TRABAJO ACAD\xC9MICO")])])],-1),L=e("div",{class:"col-12",align:"center"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null," UNIVERSIDAD NACIONAL DE LOJA - CARRERA DE COMPUTACI\xD3N")])],-1),V={class:"font flex flex-center fixed-center"},k=e("div",{class:"row no-padding no-margin header-login items-center",align:"center"},[e("div",{class:"col-12"},[e("h6",{class:"q-ma-none q-pa-md"},[e("b",null,"INICIO DE SESI\xD3N")])])],-1),T={class:"q-pa-md"},F={class:"q-pt-none q-mt-none",align:"right"},z={__name:"LoginPage",setup(M){const c=x(),o=u(!0),n=u(null),r=u(null),_=Q(),d=O(),g=async()=>{const i=await _.login(n.value,r.value);return i.status!=200?c.notify({color:"red-5",textColor:"white",icon:"warning",message:i.message}):(c.notify({color:"green-5",textColor:"white",icon:"mdi-account-check",message:"Acceso correcto"}),d.push({path:"/"}))},h=()=>{n.value=null,r.value=null},b=()=>d.push({path:"/recuperar/cuenta"});return(i,s)=>(N(),R(D,null,[a(y,{view:"hHh lpR fFf"},{default:l(()=>[a(E,{class:"bg-primary text-white"},{default:l(()=>[a(m,null,{default:l(()=>[a(p,{align:"center"},{default:l(()=>[q]),_:1})]),_:1})]),_:1}),a(w,null,{default:l(()=>[a(m,null,{default:l(()=>[a(p,null,{default:l(()=>[L]),_:1})]),_:1})]),_:1})]),_:1}),e("div",V,[a(I,{class:"",style:{"min-width":"350px"}},{default:l(()=>[k,a(A,{class:"no-marggin no-padding"}),e("div",T,[a(C,{onSubmit:g,onReset:h,class:"q-gutter-md"},{default:l(()=>[a(v,{class:"q-pt-md",filled:"",modelValue:n.value,"onUpdate:modelValue":s[0]||(s[0]=t=>n.value=t),label:"Email *","lazy-rules":"",rules:[t=>t&&t.length>0||"El campo se encuentra vacio",t=>t&&/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(t)||"Formato email no v\xE1lido"]},null,8,["modelValue","rules"]),a(v,{filled:"",type:o.value?"password":"text",modelValue:r.value,"onUpdate:modelValue":s[2]||(s[2]=t=>r.value=t),label:"Contrase\xF1a *","lazy-rules":"",rules:[t=>t&&t.length>0||"El campo se encuentra vacio"]},{append:l(()=>[a(S,{name:o.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:s[1]||(s[1]=t=>o.value=!o.value)},null,8,["name"])]),_:1},8,["type","modelValue","rules"]),e("div",F,[e("a",{class:"text-caption recuperar-enlace",clickable:"",onClick:s[3]||(s[3]=t=>b())},"\xBFOlvidaste tu contrase\xF1a?")]),e("div",null,[a(f,{label:"Ingresar",type:"submit",color:"primary"}),a(f,{label:"Borrar",type:"reset",color:"primary",flat:"",class:"q-ml-sm"})])]),_:1})])]),_:1})])],64))}};export{z as default};
