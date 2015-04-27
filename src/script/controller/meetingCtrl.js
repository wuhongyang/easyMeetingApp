define(['utils/appFunc','utils/xhr','VM','SM','FD'],function(appFunc,xhr,VM,SM,FD){

    var meetingCtrl = {       

        init: function(query){

            var bindings = [{
                  element: '#finish-meeting-control',
                  event: 'click',
                  handler: meetingCtrl.finishControl
              },{
                  element: '.media-list',
                  selector:'.item-after',
                  event:   'click',
                  handler: meetingCtrl.connectOrNot
              },{
                  element: '#btn-split-screen',
                  event: 'click',
                  handler: meetingCtrl.popover          
              },{
                  element: '#btn-add-user',
                  event: 'click',
                  handler: meetingCtrl.addUser          
              }
            ];

            VM.module('meetingView').init({
                bindings:bindings
            });

            SM['meetingCtrlStore'].off('change').on('change',meetingCtrl.updateUI);
            SM['meetingCtrlStore'].off('add').on('add',meetingCtrl.updateUI);

            meetingCtrl.id = query.id;
            meetingCtrl.popoverFlag = true;
            appFunc.localData.set('currentMeetingId',meetingCtrl.id);

              FD.add({ 
                  func:'terminals-status',
                  data: {"id": meetingCtrl.id},
                  interval:1
                });   

                xhr.simpleCall({
                    func:"meetingCtrl_Store",
                    data:{"id":meetingCtrl.id},
                    method:"GET"
                },function(result){
                    if(result.success){                   
                          meetingCtrl.duration =  result.duration; 
                  
                    }
            });         
          },

         updateUI : function(){
            VM['meetingView'].updateUI();         
         },

         popover:function(){
            if(meetingCtrl.popoverFlag){
                 meetingCtrl.showSplitScreen(this);
                 meetingCtrl.popoverFlag = false;
                  setTimeout(function(){
                      meetingCtrl.popoverFlag = true;
                  },2000);
            }else{                
                  EM.addNotification({
                        title:"",
                        message: '程序正在执行您上一次命令',
                        hold:    2500
                   },function(){
                        meetingCtrl.popoverFlag = true;
                   });
                 
            }                     
         },
         showSplitScreen:function(point){
            VM["meetingView"].showSplitScreen(meetingCtrl.screenMode,point); 
               $$('.my-popover').on('click','.splitScreen',function(event){
              var dom = $$(event.target).parent();
                  $$(".selected").removeClass("selected");
                  dom.addClass("selected");

                   xhr.simpleCall({
                    func:"screen-mode",
                    data:{id:meetingCtrl.id,screenmode:dom.attr("name")},
                    method:"POST"
                  });
                  meetingCtrl.closeModal('.my-popover');                                  
            });  
         },
         closeModal:function(id){
            setTimeout(function(){
                    EM.closeModal(id);
                  },100);
         },

         addUser:function(){
             mainView.loadPage('page/createb.html?from=meetingCtrl&id='+ meetingCtrl.id);   
         },

         finishControl:function(){
             xhr.simpleCall({
                func:"finishControl",
                data:{"id":meetingCtrl.id},
                method:"POST"
             },function(){
                  meetingCtrl.goToIndex();
             });
            appFunc.localData.remove('currentMeetingId');
           
         },
         cutTerminals:function(id,address){
                    xhr.simpleCall({
                        func:"cut-terminals",
                        data:{"id":id,"address":address},
                        method:"POST"
                     });
         },
         connectTerminals:function(id,address){
                 xhr.simpleCall({
                    func:"connect-terminals",
                    data:{"id":id,"address":address},
                    method:"POST"
                  });
         },  
       
          connectOrNot:function(event){
             var value  = event && (event.target.innerText || event.target.textContent);
             var address  = event && event.target.getAttribute('data-id'),dom = $$(event.target);
             meetingCtrl.address = address;
             switch(value){
                case"接通":
                      dom.text("挂断");
                      dom.css("color","#ee7362");
                      dom.parent().parent().find(".status-text").text("正在接通•••");
                      meetingCtrl.connectTerminals(meetingCtrl.id,address);
                break;
                 case"挂断": 
                     dom.text("接通");
                     dom.css("color","#9DC7DE");
                     dom.parent().parent().find(".status-text").text("正在挂断•••");
                     meetingCtrl.cutTerminals(meetingCtrl.id,address);
                break;
                default:
                   VM["meetingView"].userControl(this,address); 
                    meetingCtrl.userLimit(address);    
                break;

             }
         },

         changePoup:function(dom,flag,type){
            if(flag=="true"){
                 dom.removeClass("glyph-"+type+"disable").addClass("glyph-"+type);
            }else{
                 dom.removeClass("glyph-"+type).addClass("glyph-"+type+"disable");
            }
         },

         muteOther:function(flag){
              var users = SM.meetingCtrlStore.models;
              var current = SM.meetingCtrlStore.findWhere({
                address:meetingCtrl.address
              });
              var post = _.without(users,current),muteUsers=[];
              var mute = flag=="false"?true:false
              _.each(post,function(user){
                var muteUser ={
                       address:user.get("address"),
                       mute:mute
                  } 
                  muteUsers.push(muteUser);    
              });
              if(muteUsers.length>0){
                     xhr.simpleCall({
                          func:"mute-terminals",
                          query:{id:meetingCtrl.id},
                          data:muteUsers,
                          method:"POST",
                          "contentType" : "application/json"
                      });
                      meetingCtrl.other = meetingCtrl.other?false:true;     
              }else{
                      EM.alert("当前无其他用户");
              }
                   
         },

         userLimit:function(address){
               $$('.popup-user-control').on('click','.userCtrl',function(event){
                   var dom = $$(event.target).parent();
                   var type = dom.attr("name"),flag = dom.attr("flag"),text="",img="";
                      switch(type){
                          case"mute":
                            text = flag=="true"?"禁止发言":"允许发言";
                            var mute = flag=="true"?false:true;
                            meetingCtrl.changePoup($$(event.target),flag,"meetingmiccircle");
                            xhr.simpleCall({
                                func:"mute-terminals",
                                data:{id:meetingCtrl.id,address:meetingCtrl.address,mute:mute},
                                method:"POST"
                            });
                             break;
                           case"camera":
                            text = flag=="true"?"关闭视频":"开启视频"; 
                            var mute = flag=="true"?false:true;
                            meetingCtrl.changePoup($$(event.target),flag,"meetingvideocircle"); 
                             xhr.simpleCall({
                                func:"video-terminals",
                                data:{id:meetingCtrl.id,address:meetingCtrl.address,mute:mute},
                                method:"POST"
                            }); 
                          break;
                           case"other":                           
                            meetingCtrl.muteOther(flag);    
                            text = meetingCtrl.other?"开启其他":"静音其他";                   
                          break;
                          default:
                           text = "挂断";
                           if(flag){
                              meetingCtrl.cutTerminals(meetingCtrl.id,address);
                              meetingCtrl.closeModal(".popup-user-control");  
                           }else{
                              meetingCtrl.connectTerminals(meetingCtrl.id,address);
                           }                           
                          break;
                      }
                    flag=="true"? dom.attr("flag","false"):dom.attr("flag","true");   
                   $$("#"+type).text(text);                                                 
            });   
         },
         resetData:function(data){

              _.each(data,function(user){
                  user.muteImg = user.audioRxMuted ? "glyph-meetingmicdisable":"glyph-meetingmic";
                  user.camaraImg = user.videoRxMuted ?"glyph-meetingvideodisable":"glyph-meetingvideo";
                  //user.userImg = user.type=="0"?"glyph-meetingroom":"glyph-meetinguser";
                  user.name = user.name==null?"北京 分部会议室":user.name;
                  user.userImg ="glyph-meetingroom";

                  switch(user.status){
                      case"connecting"://正在接通，可以挂断
                           user.statusText = "正在接通•••";
                           user.deal = '挂断';
                           user.colors = "#ee7362";
                           user.userIn = "out";
                      break;
                       case"disconnected"://离线...
                          user.statusText = "离线";
                          user.deal = "接通";
                          user.colors = "#9DC7DE";
                          user.userIn = "out";
                      break;
                       case"connected"://会议中，默认...
                          user.statusText = "会议中•••";
                          user.deal = "• • •";
                          user.colors = "#ccc";
                          user.userIn = "in";
                      break;
                       default://fail，可以接通
                          user.statusText = "呼叫失败";
                          user.deal = "接通";
                          user.colors = "#9DC7DE";
                          user.userIn = "out";
                       break;
                  }               
              });
              return data;
         },
         goToIndex : function(){
            appFunc.localData.remove("currentMeetingId");
            mainView.loadPage('index.html');
         },
        onGlobalMessage: function(response) {
          var responseData = JSON.parse(response.data);
          if (response.key === 'terminals-status') {
            var randerData = [],
              result = responseData.data;
            if (result.status == "end") {
              meetingCtrl.goToIndex();
              return false;
            }
            var meetingCtrlStore = result.terminals;
            meetingCtrl.screenMode = result.screenMode;
            if (meetingCtrlStore == []) {
              meetingCtrlStore = [{}];
            };
            randerData = meetingCtrl.resetData(meetingCtrlStore);
             if(meetingCtrlStore.length<SM.meetingCtrlStore.length){
                     SM.meetingCtrlStore.reset(randerData);
                     meetingCtrl.updateUI();
                }else{
                    SM.meetingCtrlStore.add(randerData, {merge:true});
                } 
            /*SM.meetingCtrlStore.reset(randerData);
            meetingCtrl.updateUI();*/
          }else if(response.key === 'meetingCtrl_Store'){
            if (responseData.data.status == "end") {
                meetingCtrl.goToIndex();
                return false;
            }
          }

        },
         destroy :function(){
          FD.remove('terminals-status');
          SM.meetingCtrlStore.reset();
         }


    };

    return meetingCtrl;
});