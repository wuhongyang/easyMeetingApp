define(['backbone','PY'], function(backbone,PY) {
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
			"type":"selected",
			"checked": true,
			"firstLetter":"",
			"pinyin":function(){
				return this.name?PY.getCamelChars(this.name):''
			}
		}
	});
	var Collection = Backbone.Collection.extend({
		model: Model,

	});

	return new Collection();
})