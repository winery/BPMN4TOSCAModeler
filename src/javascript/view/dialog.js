(function(Application){

	Application.View.Dialog = Backbone.View.extend({

		defaults: {
			id: "",
			title: ""
		},

		events: {
			"click .btn": "click",
			"click .close": "cancel",
			"submit form": "confirm"
		},

		cancel: function(event){
			if(event) event.preventDefault();
			this.trigger("cancel", {dialog: this});
		},

		click: function(event){
			if(event) event.preventDefault();
			this.trigger(Backbone.$(event.currentTarget).attr("data-event"), {dialog: this});
		},

		confirm: function(event){
			if(event) event.preventDefault();
			this.trigger("confirm", {dialog: this});
		},
		
		hide: function(){
			this.$el.find(".modal").modal("hide");
			this.$el.find(".modal").data("modal", null);
		},

		initialize: function(options){
			this.options = _.extend(this.defaults, options);
			_.each(["hide.bs.modal", "hidden.bs.modal", "show.bs.modal", "shown.bs.modal"], function(bootstrap_event){
				this.$el.on(bootstrap_event, _.bind(function(event){
					this.trigger(event.type, {dialog: this});
				}, this));
			}, this);;
			this.$el.on("hidden.bs.modal", function(){
				this.remove();
			});
			this.on("cancel", function(event){
				this.hide();
			});
			this.on("confirm", function(event){
				this.hide();
			});
		},

		render: function(){
			this.$el.html('
				<div class="modal fade" id="' + this.options.id + '" tabindex="-1" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close"><span>&times;</span><span class="sr-only">Close</span></button>
								<h4 class="modal-title">' + this.options.title + '</h4>
							</div>
							<div class="modal-body"><form class="form-horizontal"></form></div>
							<div class="modal-footer">
								<div class="pull-left"></div>
								<div class="pull-right">
									<button type="button" class="btn btn-danger" data-event="cancel">Cancel</button>
									<button type="button" class="btn btn-success" data-event="confirm">OK</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			');
			return this;
		},

		show: function(){
			if(Backbone.$("body").find("#" + this.options.id).length == 0){
				this.render().$el.appendTo("body").find(".modal").modal();
			}
		}

	});

})(window.BPMN4TOSCAModeler);