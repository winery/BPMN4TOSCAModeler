/*******************************************************************************
 * Copyright (c) 2015 Thomas Michelbach.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *    Thomas Michelbach - initial API and implementation and/or initial documentation
 *******************************************************************************/

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
