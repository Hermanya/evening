var myApp = angular.module('hubohub',[]);

myApp.controller('postReaderController', ['$scope','$http', function($scope,$http) {
	$scope.posts = [];
	$scope.getPosts = function(){
		$http.get('/get/post/'+$scope.posts.length)
		.success(function(data, status, headers, config) {
			data.forEach(function(entry){
				entry.body = markdown.toHTML(entry.body);
				entry.time = Util.toHumanTime(entry.timestamp);
				entry.fullDate = new Date(entry.timestamp).toString();
				entry.areRepliesShown = false;
			});
			$scope.posts = $scope.posts.concat(data);
		}).error(function(data, status, headers, config) {
			alert(JSON.stringify(data));
		});
	}
	$scope.getPosts();
}]);
myApp.controller('taskModuleController', ['$scope','$http', function($scope,$http) {
	$scope.tasks = [];
	$scope.getTasks = function(){
		$http.get('/get/tasks')
		.success(function(data, status, headers, config) {
			$scope.tasks = data;
		}).error(function(data, status, headers, config) {
			alert(JSON.stringify(data));
		});
	}
	$scope.getTasks();
}]);
myApp.controller('taskController',['$scope','$element',function($scope,$element){
	$scope.checkBox = function(){
		$($element.find(".task-completion-form")[0]).ajaxSubmit({ 
			error: function(xhr) {
					status('Error: ' + xhr.status);
				},

				success: function(response){		
					if (response == "ok"){
						$scope.task.isCompleted = true;
						$scope.$apply();
					}else{
						alert("not ok");
					}
				}
		});
	}
}]);
myApp.controller('posting-form',['$scope','$element',function($scope,$element){
	$scope.isExpanded = false;
	$scope.toggleForm = function(){
		$scope.isExpanded = ! $scope.isExpanded;
	}
	if ($scope.path === undefined){
		$scope.path = "/";
	}else{
		$scope.path = [$scope.path,$scope.$index].join("")+"/";
	}
	$scope.parentIndex = $scope.$index;
	$scope.fileNameChanged = function(){
		if ($element.find(".attachment-input")[0].value!==""){
			$($element.find(".attachment-form")[0]).ajaxSubmit({     
				error: function(xhr) {
					status('Error: ' + xhr.status);
				},

				success: function(response){
					onSuccessfulAttachmentUpload(response, $element.find("textarea")[0]);
					$scope.processedContent = $scope.htmlfy($element.find("textarea")[0].value);
				}
			});
		}
		return false;
	}
	$scope.submitForm = function(){
		if ($element.find("textarea")[0].value!==""){

			$($element.find(".body-form")[0]).ajaxSubmit({ 
				error: function(xhr) {
					status('Error: ' + xhr.status);
				},

				success: function(response){
					if (response._id){
          	window.location.replace("/");
	        }else{
	        	alert(JSON.stringify(response));
	        }
				}
			});
		}else{
			alert("textarea is empty");
		}
	};
	$scope.humanify = function(stamp){
		return Util.toHumanTime(stamp);
	}
	$scope.htmlfy = function(text){
		return markdown.toHTML(text);
	}
	$scope.isPreviewSelected = false;
	$scope.processedContent = "";
	$scope.selectPreview = function(){
		$scope.isPreviewSelected = true;
		$scope.processedContent = $scope.htmlfy($element.find("textarea")[0].value);
		if ($scope.processedContent == "")
			$scope.processedContent = "Nothing to preview";
	}
	$scope.selectEditor = function(){
		$scope.isPreviewSelected = false;
	}
}]);

function onSuccessfulAttachmentUpload(response,textarea) {
		var snippet;
		console.log(response.type.toLowerCase());
		switch(response.type.toLowerCase()){
			case "image/png":
			case "image/gif":
			case "image/jpeg":
			snippet = ["![",response.name,"](/get/attachment/",response._id," \"",response.name,"\")"].join("");
			break;
			case "audio/mpeg":
			case "audio/wav":
			case "audio/ogg":
			case "audio/mp3":
			snippet = ["![audio](/get/attachment/",response._id," \"",response.name,"\")"].join("");
			break;
			case "video/mp4":
			case "video/webm":
			case "video/ogg":
			snippet = ["![video](/get/attachment/",response._id," \"",response.name,"\")"].join("");
			break;
			default:
			snippet = ["[",response.name,"](/get/attachment/",response._id," \"",response.name,"\")"].join("");
		}
		Util.insertAtCaret(textarea,snippet);	
}