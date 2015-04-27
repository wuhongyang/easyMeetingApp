define(['utils/appFunc','VM'],function(appFunc,VM){

    var aboutCtrl = {

        init: function(){

            var bindings = [];

            VM.module('aboutView').init({
                bindings:bindings
            });
        }

    };

    return aboutCtrl;
});