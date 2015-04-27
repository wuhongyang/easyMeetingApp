(function() {
    var lang = localStorage.getItem('lang') || 'zh-cn';
    require.config({
        locale: lang,
        paths: {
            text:'../vendors/require/text',
            i18n:'../vendors/require/i18n',
            Framework7:'../vendors/framework7/framework7',
            mustache:'../vendors/mustache/mustache',
            backbone:'../vendors/backbone/backbone',
            underscore:'../vendors/underscore/underscore-min',
            aes:'../vendors/gibberish-aes.min',
            GTPL:'../page/global.tpl.html',
            VM : './viewmodule',
            CM : './controllermodule',
            SM : './storemodule',
            GS:'services/globalService',
            jquery:'../vendors/jquery',
            PY:'../vendors/pinyin',
            FD:'./utils/fireData'
        },
        shim: {
            'Framework7': {
                exports: 'Framework7'
            },
            'backbone': {
                deps: ['underscore']
                //exports: 'Backbone'
            }
        }
    });

    require(['Framework7','router','i18n!nls/lang','utils/appFunc','FD'], function(Framework7,router,i18n,appFunc,FD) {
        var app = {
            initialize: function() {
                this.bindEvents();
            },
            bindEvents: function() {
                if(appFunc.isPhonegap()) {
                    document.addEventListener('deviceready', this.onDeviceReady, false);
                    /**
                 * 注册回退按钮事件监听器
                 */
                 //返回键
                    document.addEventListener("backbutton",this.exitApp, false);
                }else{
                    window.onload = this.onDeviceReady();
                }
                window.addEventListener("message", router.globalMessage, false);
            },
            exitApp : function(){
                    if(app.back){
                         navigator.app.exitApp();
                         app.back = false;
                     }else{
                         app.back = true;
                         // display msg
                            EM.addNotification({
                                title:"",
                                message: '请再次点击退出按钮退出程序',
                                hold:    1500
                            });
                         //clear flag
                        setTimeout(function(){
                            app.back = false;
                        },1500);
                     }
            },
            onDeviceReady: function() {
                app.receivedEvent('deviceready');
            },
            receivedEvent: function(event) {
                switch (event) {
                    case 'deviceready':
                        app.initMainView();
                        break;
                }
            },
            initMainView:function(){
                Dom7.ajax = (function(ajax){
                    return function(options){
                        if(options.contentType && /^application\/json/.test(options.contentType) && options.data){
                            if((typeof options.data) === "object" && (options.method && options.method !== "GET" ))
                                options.data = JSON.stringify(options.data);
                        };

                        return ajax(options)
                    }
                })(Dom7.ajax);
                window.$$ = Dom7;

                window.EM = new Framework7({
                    pushState: false,
                    popupCloseByOutside:false,
                    animateNavBackIcon: true,
                    modalTitle: i18n.global.modal_title,
                    modalButtonOk: i18n.global.modal_button_ok,
                    modalButtonCancel: i18n.global.cancel,
                    preprocess:router.preprocess
                });
                /**
                 * 重写 app.actions 方法
                 * @param  {Array} params [description]
                 * @param  {String} key actions 弹出层的标签
                 * @return {Dom}         [description]
                 */
                EM.actions = (function(actions){
                    return function(params,key){
                        return actions.call(EM,params).setAttribute('data-actions-key', key || '');
                    }
                })(EM.actions);
                /**
                 * 重写 app.alert 方法
                 * @param  {String | Object} text [消息体]
                 * @param  {String} title [标题]
                 * @return {Dom}       [弹出层 Dom]
                 * e.g : 
                 *     EM.alert({text:'aaaa'})
                 *     EM.alert({text:'aaaa',type:'myclass'})
                 *     EM.alert({text:'aaaa',type:'myclass',hold:3000})
                 *
                 * other : 
                 *     Framework7 app.alert 
                 */
                EM.alert = (function(alert){
                    return function(text, title, callbackOk){
                        var hold,m;
                        if(typeof text === 'object'){
                            hold = text.hold || 2 * 1000;
                            m = EM.modal({
                                text: text.text || ''
                            });
                            if(text.type){
                                $$(m).addClass(text.type);
                            }
                            setTimeout(function(){
                                EM.closeModal(m);
                            },hold);
                            return m;
                        }else{
                           return alert.call(EM,text,title,callbackOk);
                        }
                    }
                })(EM.alert);

                window.mainView = EM.addView('#ourView', {
                    dynamicNavbar: false,
                    domCache:true
                });
                /**
                 * font-face 检测
                 */
                //document.getElementsByTagName('html')[0].className += appFunc.isFontFaceSupported()? ' ff' : ' notff';
                
                router.init();
            }
        };

        app.initialize();

    });
})();
