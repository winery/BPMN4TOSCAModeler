(function(Application){

	Application.View.Element = Backbone.View.extend({
	
		events: {
			"click": "focus",
			"dblclick": "dialog",
			"dbltap": "dialog",
			"keydown": "handleKeyboardEvents",
			"mousedown": "attachGrid",
			"mouseup": "removeGrid"
		},

		attachGrid: function(){
			var d = {height: this.$el.outerHeight(), width: this.$el.outerWidth()};
			this.$el.parent().find(".guide").remove();
			this.$el.parent().find(".element").not(this.$el).each(function(){
				var diff = {height: (d.height - Backbone.$(this).outerHeight()), width: (d.width - Backbone.$(this).outerWidth())};
				Backbone.$(this).parent().append($("<div/>").addClass("guide").css({left: Backbone.$(this).position().left, marginLeft: ((diff.width / 2) * -1), height: Backbone.$(window).height(), width: d.width}));
				Backbone.$(this).parent().append($("<div/>").addClass("guide").css({left: 0, marginTop: ((diff.height / 2) * -1), top: Backbone.$(this).position().top, width: Backbone.$(window).width(), height: d.height}));
			});
		},

		blur: function(){
			this.$el.removeClass("focus").blur();
			this.trigger("blur", {view: this});
			return this;
		},

		content: function(){
			return this.model.get("name");
		},

		css: function(){
			return {
				
			};
		},

		dialog: function(){
			return false;
		},

		focus: function(event){
			if(event) event.stopPropagation();
			this.$el.parents(".canvas:first").find(".element").removeClass("focus");
			if(this.$el.hasClass("dragging")){
				this.$el.removeClass("dragging");
			}else{
				jsPlumb.makeSource(this.$el.attr("id"), {
					anchor: ["Top", "RightMiddle", "LeftMiddle", "Bottom"],
					connector:["Straight", {
						gap: 0 
					}], 
					detachable: false, 
					endpoint: "Blank",
					isSource: true,
					maxConnections: -1,
					connectorPaintStyle: {
						lineWidth: 2
					}
				});
				this.$el.addClass("focus").attr("tabindex", "1").focus();
				this.trigger("focus", {view: this});
			}
			return this;
		},

		handleKeyboardEvents: function(event){
			switch((event.keyCode || event.which)){
				case 13:
	 				this.dialog();
				break;
				case 27:
 					this.blur();
				break;
				case 46:
					_.each(this.model.collection.filterIncomingConnection(this.model), function(element){
						element.removeConnection(this.model.id);
					}, this);
					_.each(jsPlumb.getConnections({source: this.$el.attr("id")}), function(sourceConnection){
						jsPlumb.detach(sourceConnection);
					});
					_.each(jsPlumb.getConnections({target: this.$el.attr("id")}), function(targetConnection){
						jsPlumb.detach(targetConnection);
					});
	 				this.model.collection.remove(this.model);
				break;
			}
		},

		initialize: function(){
			this.on("append", function(event){
				jsPlumb.setId(this.$el, this.model.id);
				jsPlumb.draggable(this.$el, {

					cancel: ".focus",
					
					snap: ".guide",

					snapMode: "inner",

					start: _.bind(function(event, ui){
						this.$el.addClass("dragging");
					}, this),

					stop: _.bind(function(event, ui){
						this.model.set({
							position: {left: ui.position.left, top: ui.position.top}
						});
					}, this)

				});
				jsPlumb.makeTarget(this.$el.attr("id"), {
					anchor: ["Top", "RightMiddle", "LeftMiddle", "Bottom"],
					detachable: false,
					endpoint: "Blank",
					isTarget: true,
					maxConnections: -1,
					connectorPaintStyle: {
						lineWidth: 2
					}
				});
			});
			this.on("add_connection", function(event){
				this.model.addConnection(Backbone.$(event.target.el).attr("id"));
			}, this);
			this.on("remove_connection", function(event){
				this.model.removeConnection(Backbone.$(event.target.el).attr("id"));
			}, this);
			this.model.on("change", function(event){
				this.render();
				jsPlumb.repaintEverything();
			}, this);
			this.model.on("remove", function(event){
				this.remove();
			}, this);
		},

		removeGrid: function(){
			this.$el.parent().find(".guide").remove();
		},

		render: function(){
			this.$el.addClass("element " + this.model.get("type").toLowerCase()).attr({
				id: this.model.get("id")
			}).css({
				left: this.model.get("position").left,
				top: this.model.get("position").top
			}).data({
				element: this
			}).empty().append(Backbone.$("<div/>").css(this.css()).html(this.content()));
			return this;
		}

	});

})(window.BPMN4TOSCAModeler);