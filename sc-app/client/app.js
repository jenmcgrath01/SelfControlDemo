// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#success_holder").hide();
	$("#success_create").hide();
	$("#error_holder").hide();
	$("#error_query").hide();
	$("#error_history").hide();
	$("#demo1_label").hide();
	$("#demo1_img").hide();
	$("#demo2_label").hide();
	$("#demo2_claim_safety").hide();
	$("#demo3_label").hide();
	
	$scope.queryAllFirearms = function(){

		appFactory.queryAllFirearms(function(data){
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.all_firearms = array;
		});
	}

	$scope.queryFirearm = function(){

		var id = $scope.firearm_id;

		appFactory.queryFirearm(id, function(data){
			$scope.query_firearm = data;

			if ($scope.query_firearm == "Could not locate firearm"){
				console.log()
				$("#error_query").show();
			} else{
				$("#error_query").hide();
			}
		});
	}

	$scope.demo1 = function(){

	      $("#demo1_label").show();
	      $("#demo1_img").show();
	      $("#demo2_label").hide();
	      $("#demo2_claim_safety").hide();
	      $("#demo3_label").hide();
			}

	$scope.demo2 = function(){

	      $("#demo1_label").hide();
	      $("#demo1_img").hide();
	      $("#demo2_label").show();
	      $("#demo2_claim_safety").show();
	      $("#demo3_label").hide();
			}

	$scope.demo3 = function(){

	      $("#demo1_label").hide();
	      $("#demo1_img").hide();
	      $("#demo2_label").hide();
	      $("#demo2_claim_safety").hide();
	      $("#demo3_label").show();
			}


	$scope.queryFirearmHistory = function(){
               
                var id = $scope.history.id;
		appFactory.queryFirearmHistory(id, function(data){
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.firearm_history = array;
		});
	}


	$scope.recordFirearm = function(){

		appFactory.recordFirearm($scope.firearm, function(data){
			$scope.create_firearm = data;
			$("#success_create").show();
		});
	}

	$scope.changeFirearmHolder = function(){

		appFactory.changeFirearmHolder($scope.holder, function(data){
			$scope.change_holder = data;
			if ($scope.change_holder == "Error: no firearm found"){
				$("#error_holder").show();
				$("#success_holder").hide();
			} else{
				$("#success_holder").show();
				$("#error_holder").hide();
			}
		});
	}

});

// Angular Factory
app.factory('appFactory', function($http){
	
	var factory = {};

        factory.queryAllFirearms = function(callback){
    	$http.get('/get_all_firearms/').success(function(output){
			callback(output)
		});
	}

	factory.queryFirearm = function(id, callback){
    	$http.get('/get_firearm/'+id).success(function(output){
			callback(output)
		});
	}

	factory.queryFirearmHistory = function(id, callback){
    	$http.get('/get_firearm_history/'+id).success(function(output){
			callback(output)
		});
	}

	factory.recordFirearm = function(data, callback){

//TODO:  Add some better way of doing this (namve value pairs here and in controller.js)
		var firearm = data.id + "-" 
                         + data.manufacturer + "-" 
                         + data.importer + "-" 
                         + data.model + "-" 
                         + data.serialNumber + "-" 
                         + data.type + "-"
                         + data.action + "-"
                         + data.caliber + "-"
                         + data.gague + "-"
                         + data.dateAcquired + "-"
                         + data.purchaseLocation + "-"
                         + data.holder;

    	$http.get('/add_firearm/'+firearm).success(function(output){
			callback(output)
		});
	}

	factory.changeFirearmHolder = function(data, callback){

		var holder = data.id + "-" + data.holder;

    	$http.get('/change_holder/'+holder).success(function(output){
			callback(output)
		});
	}

	return factory;
});


