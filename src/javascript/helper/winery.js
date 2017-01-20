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

(function(Application){

	Application.Helper.Winery = function(repository_url, namespace, service_template, plan){

		var build = function(repository_url, path){
			return repository_url + path;
		}

		var decode = function(string){
			return decodeURIComponent(decodeURIComponent(string));
		}

		var encode = function(string){
			return encodeURIComponent(encodeURIComponent(string));
		}

		this.getAllDeploymentArtifacts = function(callback){
			$.ajax({
				crossDomain: true,
				dataType: "json",
				success: function(response){
					callback((response[0] ? response[0]["children"] : []));
				},
				url: build(this.repository_url, "API/getallartifacttemplatesofcontaineddeploymentartifacts?servicetemplate=" + ("{" + this.namespace + "}" + this.service_template)),
			});
		}

		this.getAllImplementationArtifacts = function(callback){
			$.ajax({
				crossDomain: true,
				dataType: "json",
				success: function(response){
					callback((response[0] ? response[0]["children"] : []));
				},
				url: build(this.repository_url, "API/getallartifacttemplatesofcontainedimplementationartifacts?servicetemplate=" + ("{" + this.namespace + "}" + this.service_template)),
			});
		}

		this.nodeTemplateOperationParameter = function(nodeTemplate, nodeTemplateOperation, callback){
			var requests = _.map(["inputparameters", "outputparameters"], _.bind(function(type){
				return $.ajax({
					crossDomain: true,
					dataType: "json",
					url: build(this.repository_url, "nodetypes/" + encode(nodeTemplate.namespace) + "/" + encode(nodeTemplate.id) + "/interfaces/" + encode(nodeTemplateOperation.interface) + "/operations/" + encode(nodeTemplateOperation.value) + "/" + type),
				});
			}, this));
			$.when.apply($, requests).done(function(inputparameters, outputparameters){
				callback({
					input: inputparameters[0],
					output: outputparameters[0]
				});
			});
		}

		this.nodeTemplateOperations = function(nodeTemplate, callback){
			$.ajax({
				crossDomain: true,
				dataType: "json",
				success: _.bind(function(interfaces){
					var requests = _.map(interfaces, _.bind(function(i){
						return $.ajax({
							crossDomain: true,
							dataType: "json",
							url: build(this.repository_url, "nodetypes/" + encode(nodeTemplate.namespace) + "/" + encode(nodeTemplate.id) +  "/interfaces/" + encode(i) + "/operations/")
						});
					}, this));
					$.when.apply($, requests).done(function(){
						var operations = [];
						if(requests.length == 1){
							_.each(arguments[0], function(operation){
								operations.push({
									"interface": interfaces[0],
									"name": operation,
									"namespace": ""
								});
							});
						}else{
							_.each(arguments, function(argument, b){
								_.each(argument[0], function(operation){
									operations.push({
										"interface": interfaces[b],
										"name": operation,
										"namespace": ""
									});
								});
							});
						}
						callback(operations);
					});
				}, this),
				url: build(this.repository_url, "nodetypes/" + encode(nodeTemplate.namespace) + "/" + encode(nodeTemplate.id) + "/interfaces/")
			});
		}

		this.planUrl = function(){
			return build(this.repository_url, "servicetemplates/" + encode(this.namespace) + "/" + encode(this.service_template) + "/plans/" + encode(this.plan) + "/");
		}

		this.planFile = function(){
			return build(this.repository_url, "servicetemplates/" + encode(this.namespace) + "/" + encode(this.service_template) + "/plans/" + encode(this.plan) + "/file");
		}

		this.nodeTemplates = function(callback){
			$.ajax({
				crossDomain: true,
				success: function(response){
					callback(_.map(response.nodeTemplates, function(nodeTemplate){
						return {
							id: nodeTemplate.type.replace(/^\{(.+)\}(.+)/, "$2"),
							name: nodeTemplate.name,
							namespace: nodeTemplate.type.replace(/^\{(.+)\}(.+)/, "$1")
						};
					}));
				},
				url: build(this.repository_url, "servicetemplates/" + encode(this.namespace) + "/" + encode(this.service_template) + "/topologytemplate/"),
				dataType: "json"
			});
		}

		this.relationshipTemplates = function(callback){
			$.ajax({
				crossDomain: true,
				success: function(response){
					callback(_.map(response.relationshipTemplates, function(relationshipTemplate){
						return {
							id: relationshipTemplate.type.replace(/^\{(.+)\}(.+)/, "$2"),
							name: relationshipTemplate.name,
							namespace: relationshipTemplate.type.replace(/^\{(.+)\}(.+)/, "$1")
						};
					}));
				},
				url: build(this.repository_url, "servicetemplates/" + encode(this.namespace) + "/" + encode(this.service_template) + "/topologytemplate/"),
				dataType: "json"
			});
		}

		this.topologyProperties = function(callback){
			this.nodeTemplates(_.bind(function(nodeTemplates){
				var requests = _.map(nodeTemplates, _.bind(function(nodeTemplate){
					return $.ajax({
						crossDomain: true,
						dataType: "json",
						success: function(properties){
							callback(properties.map(function(property){
								return nodeTemplate.name + "." + property;
							}));
						},
						url: build(this.repository_url, "nodetypes/" + encode(nodeTemplate.namespace) + "/" + encode(nodeTemplate.id) + "/propertiesdefinition/winery/list/"),
					});
				}, this));
				$.when.apply($, requests).always(function(){
					callback({});
				});
			}, this));
		}

		this.repository_url = repository_url;
		this.namespace = namespace;
		this.service_template = service_template;
		this.plan = plan;

	}

})(window.BPMN4TOSCAModeler);
