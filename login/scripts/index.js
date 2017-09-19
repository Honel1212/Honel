function checkName(){
 //获取到了用户名的值
var userName = document.getElementById("username").value;
var userSpan = document.getElementById("userId");
var reg = /^[a-z][a-z0-9]{5}$/i;
 if(reg.test(userName)){
 //符合规则 
     userSpan.innerHTML="正确".fontcolor("green");
           return true;
       }else{
           //不符合规则
           userSpan.innerHTML="错误".fontcolor("red");
           return false;
       }   
    }
 //校验密码  6位
   function checkPass(){
       var  password  = document.getElementById("pwd").value;
       if(password.length>0){
           var reg = /^\w{6}$/;
           var passSPan = document.getElementById("passId");
           if(reg.test(password)){
              //符合规则 
              passSPan.innerHTML="正确".fontcolor("green");
              return true;
           }else{
              //不符合规则
              passSPan.innerHTML="错误".fontcolor("red");
              return false;
           }
       }
    }
   //检验密码是否正确
   function ensurepass(){
       var  password1 = document.getElementById("pwd").value; //第一次输入的密码
       var password2 = document.getElementById("ensurepwd").value;
       if(password2.length>0){
           var enSpan  = document.getElementById("ensure");
           if(password1.valueOf()==password2.valueOf()){
              enSpan.innerHTML="正确".fontcolor("green");
              return true;
           }else{
              enSpan.innerHTML="错误".fontcolor("red");
              return false;
           }   
       }
    }