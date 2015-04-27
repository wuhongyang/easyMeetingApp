define(['backbone'], function(backbone) {
	// body...
	var Model = Backbone.Model.extend({
		defaults: {
			"text": "分钟",
			"color": ""
		}
	});
	var Collection = Backbone.Collection.extend({
		model: Model,

	});

	return new Collection();
})