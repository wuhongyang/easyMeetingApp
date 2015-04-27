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
			"type":"top",
			"name": "",
			"checked": false,
			"firstLetter":function(){
				return this.name?PY._getChar(this.name).charAt(0).toUpperCase():'';
			},
			"pinyin":function(){
				return this.name?PY.getCamelChars(this.name):''
			}
		}
	});
	var Collection = Backbone.Collection.extend({
		model: Model,
		/*comparator : function(item){
			console.log(arguments);
			return item.get('pinyin');
		}*/
	});

	return new Collection();
})