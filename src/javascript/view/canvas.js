(function(Application){

	Application.View.Canvas = Backbone.View.extend({

		events:{
			"click": "focus"
		},

		focus: function(event){
			if(event) event.preventDefault();
			this.$el.find(".element").removeClass("focus");
		},

		initialize: function(){
			this.collection.on("add", function(model, collection){
				if(Application.Elements[model.get("type")]){
					var element = new Application.Elements[model.get("type")]({
						model: model
					});
					this.$el.append(element.render().el);
					element.trigger("append");
				}
			}, this);
			this.collection.on("remove", function(model, collection, options){
				_.each(collection.filterIncomingConnection(model), function(element){
					element.removeConnection(model);
				});
			}, this);
			this.collection.on("reset", function(collection){
				this.$el.empty();
			}, this);
			jsPlumb.bind("connection", _.bind(function(info, originalEvent){
				info.connection.setConnector("Flowchart");
				info.connection.addOverlay([ "Arrow", {direction: 1, foldback:1, location: 1, width: 10, length: 10}]);
				info.connection.bind("click", function(connection){
					Backbone.$(connection.source).data("element").trigger("remove_connection", {target: Backbone.$(connection.target).data("element")});
					jsPlumb.detach(connection);
				});
				this.$el.find("#" + info.sourceId).data("element").trigger("add_connection", {target: this.$el.find("#" + info.targetId).data("element")});
			}, this));
		},

		render: function(){
			jsPlumb.importDefaults({
				Anchor: ["Top", "RightMiddle", "LeftMiddle", "Bottom"],
				Connector:["Straight", {
					cornerRadius: 0,
					stub: 0,
					gap: 3 
				}],
				PaintStyle: {lineWidth: 1}
			});
			this.collection.fetch({
				success: _.bind(function(collection, response, options){
					collection.each(function(model){
						_.each(model.get("connections"), function(connection){
							if((Backbone.$("#" + model.get("id")).length > 0) && (Backbone.$("#" + connection).length > 0)){
								jsPlumb.connect({endpoint: "Blank", source: Backbone.$("#" + model.get("id")), target: Backbone.$("#" + connection)});
							}
						});
					});
				}, this)
			});
			this.$el.append(new Application.View.CanvasToolbar({canvas: this}).render().el);
			return this;
		}

	});

})(window.BPMN4TOSCAModeler);