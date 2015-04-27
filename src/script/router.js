define(['GS','VM','CM'],function(GS,VM,CM) {

    var router = {

        init: function() {
            
            $$(document).on('pageBeforeInit', function (e) {
                var page = e.detail.page;
                router.pageBeforeInit(page);
            });

            $$(document).on('pageAfterAnimation', function (e) {
                var page = e.detail.page;
                router.pageAfterAnimation(page);
            });
            $$(document).on('pageBeforeRemove', function (e) {
                var page = e.detail.page;
                router.pageBeforeRemove(page);
            });
            router.checkLogin();
        },

        checkLogin : function(flag){

            var isLogin = GS.isLogin();
            if(isLogin){
                if(flag || new Date().getTime() - isLogin.time >= 28* 60 * 1000){
                    CM.loginCtrl.doLogin(isLogin);
                }else{
                    mainView.loadPage('index.html',false);
                    $$('div.views').removeClass('hidden-navbar');
                    $$('div.views').removeClass('hidden-toolbar');
                }
                
            }else{
                mainView.loadPage('page/login.html');
            }
        },

        pageBeforeRemove: function(page){
            var name = page.name;
            name = name === "ourView" ? "app" : name;
            if(CM[name+'Ctrl']){
                CM[name+'Ctrl'].destroy && CM[name+'Ctrl'].destroy(page);
            }

        },
        pageAfterAnimation: function(page){
            var name = page.name;
            var from = page.from;
            var query = page.query;
            var swipeBack = page.swipeBack;

            name = name === "ourView" ? "app" : name;
            if(name === 'app'){
                //if(query.from && query.from === 'meeting'){
                    CM['appCtrl'].clearHistory();
                //}
            }else if(name === "meeting"){
                CM['appCtrl'].clearHistory();
                mainView.history.push('page/meeting.html');
            }else if(name === "login"){
                if(query.from === 'logout'){
                    CM['appCtrl'].clearHistory();
                    mainView.history.push('page/userConfig.html');
                }
            }
            name  = name + "Ctrl"
            CM[name] && CM[name].onPageShow && CM[name].onPageShow(page);
            name      = null;
            swipeBack = null;
            query     = null;
            from      = null;
        },

        pageBeforeInit: function(page) {
            var name  = page.name;
            var query = page.query;
            var from  = page.from;

            if(from   === "left"){
                return ;
            }
            name = name === "ourView" ? "app" : name;
            if(CM[name+'Ctrl']){
                CM[name+'Ctrl'].init(query);
            }
        },
        /**
         * 页面渲染前置处理
         * @param  {DOM String} content [源html数据]
         * @param  {String} url         [源路径]
         * @return {DOM String}         [模板渲染后的 DOM String]
         */
        preprocess: function(content,url){
            if(!url) return false;
            url = url.split('?')[0] ;

            var viewName;
            if(url === 'index.html'){
                viewName = 'appView';
            }else if(/(\w+)\.html$/.test(url)){
                viewName = RegExp.$1 + 'View';
            }else{
                return content;
            }
            
            if(VM[viewName] && VM[viewName].i18next){
                return VM[viewName].i18next(content);//调用视图渲染
            }
            return content;

        },
        globalMessage : function(event){
            var data  = event.data;
            switch(data.key){
                case 'contacts':
                case 'contactsAll':
                CM.createbCtrl.onGlobalMessage(data);
                break;
                case 'terminals-status':
                CM.meetingCtrl.onGlobalMessage(data);
                break;
                case 'doLogin':
                setTimeout(function(){
                    router.checkLogin(true);
                },300);
                
                break;
            }
            if (/^(\w+)_.+/.test(data.key)) {
                CM[RegExp.$1] && CM[RegExp.$1].onGlobalMessage && CM[RegExp.$1].onGlobalMessage(data);
            }
        }

    };

    return router;
});