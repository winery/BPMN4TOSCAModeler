(function(Application){

	Application.View.CanvasToolbar = Backbone.View.extend({

		defaults: {

		},

		events: {
			"click .save": "save"
		},

		initialize: function(options){
			this.options = _.extend(this.defaults, options);
			this.options.canvas.$el.droppable({

				accept: ".item",

				drop: _.bind(function(event, ui){
					if((ui.offset.top <= 44 && ui.offset.left > 465) || (ui.offset.top > 44)){
					 	this.options.canvas.collection.add(_.extend({
					 		name: _.uniqueId("Element "),
					 		position: {
								left: ui.offset.left,
								top: ui.offset.top
					 		},
					 	}, _.pick(Backbone.$(ui.helper).data(), ["name", "type", "node_template"])))
					 	this.$el.find(".dropdown").trigger("click");
					}
				}, this)

			});
		},

		render: function(){
			this.$el.addClass("toolbar").html(
				"<div class=\"form-group\">
					<div class=\"btn-group\">
						<button type=\"button\" class=\"btn btn-default item\" data-name=\"StartEvent\" data-type=\"StartEvent\" title=\"Add new Start Event\"><span>Start Event</button>
						<button type=\"button\" class=\"btn btn-default item\" data-name=\"EndEvent\"data-type=\"EndEvent\" title=\"Add new End Event\"><span>End Event</span></button>
						<button type=\"button\" class=\"btn btn-default item\" data-type=\"Gateway\" title=\"Add new Parallel Gateway\"><span>Gateway</span></button>
						<div class=\"btn-group\">
							<div class=\"dropdown\" style=\"display: inline-block\">
								<button type=\"button\" class=\"btn btn-default item\" data-name=\"Unnamed NodeManagementTask\" data-type=\"ToscaNodeManagementTask\" data-toggle=\"dropdown\" title=\"Add new Node Management Task\">Node Management Task&nbsp;<span class=\"caret\"></span></button>
								<ul class=\"dropdown-menu\"></ul>
							</div>
						</div>
					</div>
					<div class=\"pull-right btn-group\">
						<button type=\"button\" class=\"btn btn-success save\"><span>Save</span></button>
					</div>					
				</div>"
			);

			this.options.canvas.collection.options.winery.nodeTemplates(_.bind(function(nodeTemplates){
				_.each(nodeTemplates, function(nodeTemplate){
					this.$el.find(".dropdown ul").append("
						<li><a href=\"#\" class=\"item\" data-type=\"ToscaNodeManagementTask\" data-node_template=\"" + nodeTemplate.name + "\" data-name=\"Unnamed " + nodeTemplate.name + " NodeManagementTask\" title=\"Add new " + nodeTemplate.name + " Node Management Task\">" + nodeTemplate.name + "</a></li>
					");
				}, this);
				this.$el.find(".item").draggable({cancel: false, helper: "clone"});
			}, this), this);
			return this;
		},

		save: function(event){
			if(event) event.preventDefault();
			this.$el.find(".btn.save span").html("Saving ..");
			this.options.canvas.collection.save(_.bind(function(){
				this.$el.find(".btn.save span").html("Save");
			}, this));
		}

	});

})(window.BPMN4TOSCAModeler);