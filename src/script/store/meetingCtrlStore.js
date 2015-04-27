define(['backbone'], function(backbone) {
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
		idAttribute: "address",
		defaults: {
			"type":"meetingCtrl",
			"name": "",
			"address":"",
			"meetingStatus": 0
		}
	});
	var Collection = Backbone.Collection.extend({
		model: Model,

	});
	
	return new Collection();
})