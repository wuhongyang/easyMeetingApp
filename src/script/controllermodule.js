/** E-Meeting V1.0.1411171 Build On 2014-11-17 14:17 By hu.feige@gmail.com
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
　　　　　　　　　　　　　　　　　　　　　　　　　　　　　丶丶亅亅亅丶　　　　　　　　
　　　　　　　　　　　丶乙瓦瓦十丶　　　　　　　　　乙車鬼毋車毋己毋車毋車乙　　　　　
　　　　　　　　　亅日馬馬龠車己瓦乙亅十十十十十乙日鬼鬼日乙己瓦車車毋毋車車亅　　　　
　　　丶丶　　十己鬼馬鬼乙己己日己己日日日日瓦毋日瓦鬼車毋日毋瓦毋馬瓦瓦日毋己　　　　
　　毋龠馬瓦車龠龠車乙　　己己日日毋車毋瓦瓦瓦車瓦毋車龠龍鬼毋毋日日乙亅己毋亅　　　　
　亅龍毋己己己乙亅　　　　己瓦瓦車毋車毋日瓦毋瓦車車鬼鬼瓦馬毋瓦瓦己　　　　　　　　　
　丶丶　　　　　　亅十亅乙瓦毋己毋毋乙毋車瓦毋毋毋車車十十馬車乙瓦車亅　　　　　　　　
　　　　　　　　丶己毋瓦瓦毋日毋車龠十亅己車車毋瓦日乙亅十日鬼毋己己己亅　　　　　　　
　　　　丶日十亅十車瓦瓦日瓦毋車鬼己　　　亅十己瓦日己亅　亅毋鬼瓦日己日己十丶　　　　
　　　　亅毋瓦乙瓦乙丶丶亅日車己丶　　　　　　　　丶　　　　　亅己己十日車鬼己十亅亅丶
　　　　　　己亅丶　　　　　　　　　　　　　　　　　　　　　　　　　　　丶十乙毋日日亅
 **/

define([
'controller/aboutCtrl',
'controller/appCtrl',
'controller/createaCtrl',
'controller/createbCtrl',
'controller/forgetCtrl',
'controller/historyCtrl',
'controller/loginCtrl',
'controller/logoutCtrl',
'controller/meetingCtrl',
'controller/myContactsCtrl',
'controller/passwordEditorCtrl',
'controller/userConfigCtrl'],function(aboutCtrl,appCtrl,createaCtrl,createbCtrl,forgetCtrl,historyCtrl,loginCtrl,logoutCtrl,meetingCtrl,myContactsCtrl,passwordEditorCtrl,userConfigCtrl){
var module = {};
module['aboutCtrl']=aboutCtrl;
module['appCtrl']=appCtrl;
module['createaCtrl']=createaCtrl;
module['createbCtrl']=createbCtrl;
module['forgetCtrl']=forgetCtrl;
module['historyCtrl']=historyCtrl;
module['loginCtrl']=loginCtrl;
module['logoutCtrl']=logoutCtrl;
module['meetingCtrl']=meetingCtrl;
module['myContactsCtrl']=myContactsCtrl;
module['passwordEditorCtrl']=passwordEditorCtrl;
module['userConfigCtrl']=userConfigCtrl;
module.module = function(m){return module[m];}
return module;
});