define(['utils/appFunc','utils/xhr','VM','SM','FD'],function(appFunc,xhr,VM,SM,FD){

    var Ctrl = {

        init: function(){

            var bindings = [
               {
                    element: '#btn-done',
                    event:   'click',
                    handler: Ctrl.toPassword
                }];
                VM.module('forgetView').init({
                    bindings:bindings
                });
        },                
        toPassword : function(){
            var address = $$("#user-address-change").val();
            if(address!==""){
                  xhr.simpleCall({
                      func:"new-password",
                      data:{email:address},
                      method:"GET"
                  },function(result){                   
                      setTimeout(function(){
                          EM.alert(result.msg,function(){
                              if(result.success){
                                mainView.loadPage('page/login.html?from=logout');
                            } 
                          });                                                    
                      },300);
                  });  
            }else{
                EM.alert("用户邮箱地址不能为空");
                return;
            }
            
        }

    };

    return Ctrl;
});