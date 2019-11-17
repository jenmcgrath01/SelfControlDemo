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
	$("#demo_buyer_1_img").hide();
	$("#demo_seller_results_label").hide();
	$("#demo_seller_1_label").hide();
	$("#demo_seller_2_label").hide();
	$("#demo_seller_3_label").hide();

//TODO:  Get this from DB/
        $scope.holderList=['Jen','Caleb','Ryan','Chris'];
        $scope.actionList=['Lever','Semi-Automatic','Automatic'];
        $scope.firearmType=['Rifle','Shotgun','Handgun','Other'];
        $scope.ammoList=  ['.22','.300','.270'];
        $scope.rifleAmmoList=  ['.22','.300','.270'];
        $scope.hangunAmmoList=  ['.22','.45'];
        $scope.shotgunAmmoList=  ['12 Gague','14 Gague'];


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

	$scope.demo_buyer_1 = function(){

              var licenseRequest=new Object();
              licenseRequest.licenseAction=$scope.licenseAction;
              licenseRequest.licenseCaliber=$scope.licenseCaliber;
              licenseRequest.holderName=$scope.holderName;

               appFactory.checkLicense(licenseRequest, function(data){
                    if (data.response_code==100){
	                       $("#demo_buyer_1_img").show();
                               $scope.resultsText="Congratulations! You are ready to go! Your code is below"
                    }
                    else{
	                       $("#demo_buyer_1_img").hide();
                               $scope.resultsText="You are not approved: "+data.message;
                    }

                });
	}

	$scope.demo_seller_1 = function(){

	      $("#demo_seller_results_label").show();
	      $("#demo_seller_1_label").show();
	      $("#demo_seller_2_label").hide();
	      $("#demo_seller_3_label").hide();
			}

	$scope.demo_seller_2 = function(){

	      $("#demo_seller_results_label").show();
	      $("#demo_seller_1_label").hide();
	      $("#demo_seller_2_label").show();
	      $("#demo_seller_3_label").hide();
			}

	$scope.demo_seller_3 = function(){

	      $("#demo_seller_results_label").show();
	      $("#demo_seller_1_label").hide();
	      $("#demo_seller_2_label").hide();
	      $("#demo_seller_3_label").show();
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

	$scope.queryFirearmsByHolder = function(){
               
		appFactory.queryFirearmsByHolder($scope.holderName, function(data){
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.firearms_by_holder = array;
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

	factory.queryFirearmsByHolder = function(holderName, callback){
    	$http.get('/get_firearms_by_holder/'+holderName).success(function(output){
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


	factory.checkLicense = function(data, callback){

                 var licenseRequestString=data.holderName+"~"+data.licenseAction+"~"+data.licenseCaliber;

    	        $http.get('/check_license/'+licenseRequestString).success(function(output){
			callback(output)
		});
	}

	return factory;
});


