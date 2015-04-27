/**
/**
 * fireData
 * @authors feige (feige_hu@foxmail.com)
 * @date    2014-09-10 14:23:33
 * @version $Id$
 *
 * F.add('taskname') or F.add({func:'taskname'}) or F.add({func:'taskname',interval:1})//1s
 * F.remove('taskname') or F.remove({func:'tackname'});
 */

define(['utils/appFunc',
        'utils/xhr',
        'components/networkStatus'],function(appFunc,xhr,networkStatus) {
	var F = {
        timer:null,
		fireTask :{},
        firexhr : function(){
            var currentTime = new Date().getTime();
            for(var key in F.fireTask){
                if (appFunc.isPhonegap()) {
                    //Check network connection
                    var network = networkStatus.checkConnection();
                    if (network === 'NoNetwork') {
                        //break;
                        return false;
                    }
                }
                if(F.fireTask[key].nextTime > currentTime){
                	continue;
                }
                F.fireTask[key].nextTime = currentTime + (F.fireTask[key].interval * 1000);
                setTimeout(
        			F.doTask.bind(null,F.fireTask[key])
        		,1);
            };
        },
        fireData : function(){
            clearTimeout(F.timer);
            F.timer = setTimeout(function() {
                F.fireData();
            }, 1000);
            F.firexhr();
            /*clearInterval(F.timer);
            F.timer=setInterval(F.firexhr,1000);*/
        },
        doTask : function(task){
            xhr.simpleCall(task);
        },
        add : function(task){
        	if(typeof task === 'string'){
        		task = {
        			func : task
        		}
        	}

        	if(!('interval' in task)){
        		task.interval = 60;
        	}
        	task.nextTime = new Date().getTime() + (task.interval * 1000);
        	F.doTask(task);
        	F.fireTask[task.func] = task;
        	return task;
        },
        remove: function(task){
        	var id
        	if(typeof task === 'string'){
        		id = task;
        	}else{
        		id = task.func
        	};
        	F.fireTask[id] = null;
        	delete F.fireTask[id];
        },
        clear : function(){
            clearTimeout(F.timer);
            F.fireTask = {};
        }
	}
		setTimeout(F.fireData,800);
		return F;
});