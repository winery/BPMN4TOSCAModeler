(function(Application){

	Application.Model.Element = Backbone.Model.extend({
		
		defaults:{
			connections: [],
			type: ""
		},

		addConnection: function(element){
			if(!_.contains(this.get("connections"), element)){
				this.set("connections", _.union(_.clone(this.get("connections")), [element]));
			}
			return this;
		},

		initialize: function(){
			if(!this.has("id")) this.set({id: _.uniqueId("element")});
		},

		removeConnection: function(element){
			if(_.contains(this.get("connections"), element)){
				this.set("connections", _.without(_.clone(this.get("connections")), element));
			}
			return this;
		},

		toJSON: function(){
			return this.attributes;
		}

	});

})(window.BPMN4TOSCAModeler);