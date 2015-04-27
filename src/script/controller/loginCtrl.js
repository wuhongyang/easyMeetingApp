define(['utils/appFunc','utils/xhr','VM','GS','i18n!nls/lang','FD'],function(appFunc,xhr,VM,GS,i18n,FD){
    var _userList;
    var loginCtrl = {
        userList : [],
        init: function(){

            var bindings = [{
                element: '.login-submit',
                event: 'click',
                handler: loginCtrl.loginSubmit
            },
            {
                element:'#btn-auto-login',
                event:'click',
                handler: loginCtrl.autoLogin
            },{
                element:'.page-login',
                event:'click',
                handler: loginCtrl.hideUserList
            },
            {
                element:'#login-name',
                event:'input',
                handler: loginCtrl.nameChange
            },{
                element:'#login-user-list',
                event:'click',
                selector:"li",
                handler: loginCtrl.selectUserList
            }
            ];

            VM['loginView'].init({
                bindings:bindings
            });
            GS.init();
            //更新自动选择状态
            loginCtrl.updataUI(GS.getAutoLogin());
            //清理定时任务
            FD.clear();
            loginCtrl.userList = appFunc.localData.get('userList');
            if (loginCtrl.userList){
                loginCtrl.userList = JSON.parse(loginCtrl.userList) || [];
            }else{
                loginCtrl.userList = []
            }
        },
        selectUserList : function(event){
            event.preventDefault();
            var id = $$(event.target).parents('li').data('id');
            var value;
            if(/^@/.test(id)){
                value = $$('#login-name').val();
                if(value.indexOf('@') > -1){
                    value = value.replace(/@.*$/,id);
                }else{
                    value = value.concat(id);
                }
                $$('#login-name').val(value);
            }else{
                $$('#login-name').val(id);
            }
            
            loginCtrl.hideUserList();

            return false;
        },
        hideUserList : function(){
            VM.loginView.hideUserList();
            _userList = null;
        },
        nameChange: function(event) {

            var name = event.target.value;
            var list;
            list = _.filter(loginCtrl.userList, function(item) {
                return item.indexOf(name) > -1
            });

            if (_.difference(list, _userList).length) {
                _userList = list;
            }


            VM.loginView.showUserList(list);

        },

        loginSubmit: function(){
            var loginName = $$('#login-name').val();
            var password = $$('#password').val();
            var data = {
                        "username":loginName,
                        "password":password
                    }
            if(loginName === '' || password === ''){
                EM.alert(i18n.login.err_empty_input);
            }else if(!appFunc.isEmail(loginName)){
                EM.alert(i18n.login.err_illegal_email);
            }else{
                EM.showPreloader(i18n.login.login);
                loginCtrl.doLogin(data);
            }
        },
        doLogin : function(data){
                xhr.simpleCall({
                    "func":'user_login',
                    "method":"POST",
                    "data":data,
                    "complete":function(xhr){
                        if(xhr.status===400){
                            EM.alert('用户名或密码不正确！',function(){
                              EM.hidePreloader();
                              if(EM.mainView.activePage.name != "login"){
                                setTimeout(function(){
                                    mainView.loadPage('page/login.html');
                                },400);
                              }
                            });
                           //EM.hidePreloader();
                        }
                    }
                },function(response){
                    setTimeout(function(){
                        var user ;
                        if(response.success === true){
                            user = GS.getCurrentUser();
                            //清理用户缓存
                            if( user && data.username !== user.email){
                                appFunc.clearUserData();
                                //appFunc.localData.set('autologin',GS.getAutoLogin()?'1':'0');
                            }
                            //存储用户基本信息
                            data.jid = response.data['JSESSIONID'];
                            GS.setCurrentUserSid(data);
                            appFunc.localData.set('jid',response.data['JSESSIONID']);
                            
                            loginCtrl.updateUserList(data.username);

                            
                            //获取用户信息
                            xhr.simpleCall({
                                "func":'currentuser'
                            },function(response){
                                if(response && response.success){
                                    GS.setCurrentUser(response.data);
                                }
                            });
                            mainView.loadPage('index.html?form=login');
                        }else{
                            EM.alert(response.msg);
                        }
                    },500);
                });
        },
        updateUserList : function(user){
            var userList = loginCtrl.userList;
            if(!user){
                return false;
            }
            if(_.indexOf(userList,user) > -1){
                return false;
            }

            if(userList.length >= 3){
                userList.shift();
            }
            userList.push(user);
            appFunc.localData.set('userList', userList);
            userList = null;
        },

        autoLogin : function(){

            GS.setAutoLogin();
            loginCtrl.updataUI(GS.getAutoLogin());
        },

        updataUI :function(flag){
            if(!!flag){
                $$('.page-login').addClass('auto');
            }else{
                $$('.page-login').removeClass('auto');
            }
        }

    };

    (function(){
            loginCtrl.userList = appFunc.localData.get('userList');
            if (loginCtrl.userList){
                loginCtrl.userList = JSON.parse(loginCtrl.userList) || [];
            }else{
                loginCtrl.userList = []
            }
        })();
    return loginCtrl;
});