define(['backbone','utils/appFunc'], function(backbone,appFunc) {
	// body...
	var Model = Backbone.Model.extend({
		toJSON: function(options) {
			var data = this.attributes;
			for(var key in data){
				if(_.isFunction(data[key])){
					data[key] = data[key].call(data);
				}
			}
			data.id = this.id;
	      return data;
	    },
		//idAttribute: "address",
		defaults: {
			"type":"all",
			"name": "",
			"userCount" : function(){
				return this.terminals ? this.terminals.length : 0;
			},
			"time" : function(){
				return appFunc.dateFormat(this.startTime, 'm-d H:i');
			}
		}
	});
	var Collection = Backbone.Collection.extend({
		model: Model
	});

	return new Collection();
})