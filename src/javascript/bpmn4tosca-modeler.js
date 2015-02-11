(function(window, bootstrap){

	window.BPMN4TOSCAModeler = bootstrap(Backbone, {
		Collection: {},
		Elements: {},
		Helper: {},
		Model: {},
		View: {}
	});

}(this, function(Backbone, Modeler){

	Modeler.getQueryParameter = function(name){
	    var expression = new RegExp("[\\?&]" + (name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")) + "=([^&#]*)");
	    var matches = expression.exec(window.location.search);
	    return matches === null ? "" : decodeURIComponent(matches[1].replace(/\+/g, " "));
	};

	Modeler.initialize = function(){

		return new Modeler.View.Canvas({
			el: ".canvas",
			collection: new Modeler.Collection.Managementplan([], {
				winery: new Modeler.Helper.Winery(this.getQueryParameter("repositoryURL"), this.getQueryParameter("namespace"), this.getQueryParameter("id"), this.getQueryParameter("plan"))
			})
		}).render();

	};

	Modeler.registerElement = function(element){
		this.Elements[element.type] = element;
	};
	
	return Modeler;

}));