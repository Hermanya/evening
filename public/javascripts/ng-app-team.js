var myApp = angular.module('hubohub',[]);

myApp.controller('teamViewer', ['$scope','$http','$element', function($scope,$http,$element) {
	$scope.users = [];
	$scope.getUsers = $http.get('/get/team')
	.success(function(data, status, headers, config){
		$scope.users = data;
		console.log(data);
	}).error(function(data, status, headers, config){
		alert(JSON.stringify(data));
	});
	$scope.submitNewUser = function(){
		$element.find("#new-user-form").ajaxSubmit({
			error: function(xhr) {
					status('Error: ' + xhr.status);
				},

				success: function(response){
					$scope.users.push(response);
					$scope.$apply();
					$element.find("#new-user-form").resetForm();
				}
		});
	}
}]);
myApp.controller('userController', ['$scope','$element', function($scope,$element) {
	$scope.submitNewTask = function(){
		$($element.find(".new-task-form")[0]).ajaxSubmit({
			error: function(xhr) {
					status('Error: ' + xhr.status);
				},

				success: function(response){
					$scope.user.tasks.push(response);
					$($element.find(".new-task-form")[0]).resetForm();
					$scope.isTaskFormShown = false;
				}
		});
	}
}]);
