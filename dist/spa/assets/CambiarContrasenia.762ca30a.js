import{c as _,Q as v,a as u,b as c}from"./QLayout.36a3868e.js";import{Q as f}from"./QFooter.9c503c6c.js";import{c as g,b,Q as C}from"./QCard.b7541241.js";import{r as d,E as h,O as w,J as a,G as t,K as e,R as y,H as A,M as E,Q,D as x}from"./index.bcd47ac5.js";import{Q as I,a as N}from"./QForm.ddaefe14.js";import"./QResizeObserver.2a9dfcac.js";const R=e("div",{class:"row"},[e("div",{class:"col-12"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null,"SISTEMA DE GESTI\xD3N DEL INFORME FINAL DE CUMPLIMIENTO DEL TRABAJO ACAD\xC9MICO")])])],-1),D=e("div",{class:"col-12",align:"center"},[e("div",{class:"text-caption",style:{"max-width":"100%","white-space":"break-spaces"}},[e("b",null," UNIVERSIDAD NACIONAL DE LOJA - CARRERA DE COMPUTACI\xD3N")])],-1),O={class:"font flex flex-center fixed-center"},T=e("div",{class:"row no-padding no-margin header-login items-center",align:"center"},[e("div",{class:"col-12"},[e("h6",{class:"q-ma-none q-pa-md"},[e("b",null,"CAMBIAR CONTRASE\xD1A")])])],-1),M={class:"q-pa-md"},q=e("div",{class:"q-mb-none q-pb-none"}," Nueva Contrase\xF1a: ",-1),U={__name:"CambiarContrasenia",setup(L){const i=b(),o=d(null),n=d(!0),m=A(),p=async r=>{console.log(r,o.value),await x.recuperarPassword(r,o.value,s=>(console.log(s.status),s.status!=200&&s.status!=201?i.notify({color:"red-5",textColor:"white",icon:"mdi-email-alert",message:s.message}):(i.notify({color:"green-5",textColor:"white",icon:"mdi-email-check",message:s.data.message}),m.push({path:"/"}))))};return(r,s)=>(h(),w(y,null,[a(_,{view:"hHh lpR fFf"},{default:t(()=>[a(v,{class:"bg-primary text-white"},{default:t(()=>[a(u,null,{default:t(()=>[a(c,{align:"center"},{default:t(()=>[R]),_:1})]),_:1})]),_:1}),a(f,null,{default:t(()=>[a(u,null,{default:t(()=>[a(c,null,{default:t(()=>[D]),_:1})]),_:1})]),_:1})]),_:1}),e("div",O,[a(g,{class:"",style:{"min-width":"350px"}},{default:t(()=>[T,a(C,{class:"no-marggin no-padding"}),e("div",M,[a(I,{onSubmit:s[2]||(s[2]=l=>p(r.$route.params.token)),class:"q-gutter-md"},{default:t(()=>[q,a(N,{filled:"",type:n.value?"password":"text",modelValue:o.value,"onUpdate:modelValue":s[1]||(s[1]=l=>o.value=l),label:"Contrase\xF1a *","lazy-rules":"",rules:[l=>l&&l.length>0||"El campo se encuentra vacio"],hint:"Ingrese una nueva contrase\xF1a para recuperar su cuenta"},{append:t(()=>[a(E,{name:n.value?"visibility_off":"visibility",class:"cursor-pointer",onClick:s[0]||(s[0]=l=>n.value=!n.value)},null,8,["name"])]),_:1},8,["type","modelValue","rules"]),e("div",null,[a(Q,{label:"Enviar",type:"submit",color:"primary"})])]),_:1})])]),_:1})])],64))}};export{U as default};
