/*
 * Copyright 2016-2017 ZTE Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(Application){

	Application.Condition = function(canvas){ //
		this.canvas = canvas;

		// getSource endPoint
		this.getSource = function(sourceId) {
			var sourceEndpoint =  _.filter(Application.condition.canvas.collection.models, function(model){
					return model.id == sourceId;
				});
			return sourceEndpoint[0];
		};

		this.getCondition = function(model, targetId) {
			var condition = _.filter(model.attributes.conditions, function(tmp){
					return tmp.id == targetId;
				});
			
			return condition[0];
		};

		/**
		 * get conditoin info for gateway branch
		 * @param connection
		 * @returns {{}}
         */
		this.getConditionFromLabel = function(connection) {
			var condition = {};
			
			var labelId = connection.getOverlay("label").getElement().id;

			var isDefault = $("#" + labelId + " span[name='default']").text();
			if(isDefault == "Default") {
				condition.default = true;
			} else {
				condition.default = false;
			}
			condition.condition = $("#" + labelId + " span[name='condition']").text();
			
			return condition;
		};
		
		
		// set branch's condition info
		this.setConditionToLabel = function(connection) {

			var sourceModel = this.getSource(connection.sourceId);
			if(sourceModel.attributes.type != "ExclusiveGateway") {
				return ;
			}

			var conditionObj = this.getCondition(sourceModel, connection.targetId);
			var isDefault = conditionObj.default;
			var condition = conditionObj.condition;

			if(isDefault == null || "" == isDefault) {
				isDefault = false;
			} 
			
			if(condition == null || "" == condition) {
				condition = "";
			}

			var label = "";
			if(isDefault == false || isDefault == "false") { 	//
				label = "<span name='default'></span><span name='condition'>" + condition + "</span>";
			} else { // default branch
				label = "<span name='default'>Default</span><span name='condition'></span>";
			}

			connection.getOverlay("label").setLabel(label);
		};
		
		

		this.modifyCondition = function(connection) {
			
			var sourceId = connection.sourceId;
			var targetId = connection.targetId;
			
			var model = Application.condition.getSource(sourceId);
			if(model.attributes.type != "ExclusiveGateway") {
				return;
			}
			
			var conditionFromLabel = this.getConditionFromLabel(connection);
			var oldDefault = conditionFromLabel.default;
			var oldCondition = conditionFromLabel.condition;
			
			var dialog = new Application.View.Dialog({
				id: ("condition_dialog"),
				model: {},
				title: "Edit Condition"
			});
			
			
			dialog.on("show", function(event){
				event.dialog.$el.find("form").append(""
					+"<div class=\"form-group\">"
						+"<label for=\"default\" class=\"col-sm-3 control-label\">default</label>"
						+"<div class=\"col-sm-1\"><input type=\"checkbox\" name=\"default\" value=\"\" /></div>"
					+"</div>"
					+"<div class=\"form-group\">"
					+"<label for=\"condition\" class=\"col-sm-3 control-label\">condition</label>"
					+"<div class=\"col-sm-9\"><input type=\"text\" autocomplete=\"off\" class=\"form-control\" name=\"condition\" value=\"\" /></div>"
					+"</div>"
				+"");


				$(event.dialog.$el.find("input")[0]).attr("checked", oldDefault);
				$(event.dialog.$el.find("input")[1]).val(oldCondition);
			});
			
			dialog.on("confirm", function(event){
				var newDefault = false;
				if($(this.$el.find("input")[0]).attr("checked")) {
					newDefault = true;
				}
				var newCondition = this.$el.find("input")[1].value;

				var model = Application.condition.getSource(sourceId);
				
				var condition = Application.condition.getCondition(model, targetId);
				condition.condition = newCondition;
				condition.default = newDefault;

				Application.condition.setConditionToLabel(connection);
				
			});
			
			dialog.show();
		};

	};

})(window.BPMN4TOSCAModeler);