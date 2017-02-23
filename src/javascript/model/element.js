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
/**
 * Modifications Copyright 2017 ZTE Corporation.
 */
(function(Application){

	Application.Model.Element = Backbone.Model.extend({

		defaults:{
			connections: [],
			conditions:[],
			type: ""
		},

		addConnection: function(element){
			if(!_.contains(this.get("connections"), element)){
				this.set("connections", _.union(_.clone(this.get("connections")), [element]));
			}

			var con = _.find(this.get("conditions"), function(condition) {
				return condition.id == element;
			});

			if(!con) {
				var con = {"id" : element, "default":false, "condition":""};
				this.set("conditions", _.union(_.clone(this.get("conditions")), [con]));
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

			this.set("conditions", _.filter(this.get("conditions"), function(condition) {
				return condition.id !== element;
			}));
			return this;
		},

		toJSON: function(){
			return this.attributes;
		}

	});

})(window.BPMN4TOSCAModeler);
