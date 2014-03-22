$("document").ready(function(){
	$("#log-form").submit(function(e){
		e.preventDefault();
		$("#log-form").ajaxSubmit({ 
						error: function(xhr) {
							status('Error: ' + xhr.status);
						},

						success: function(response){
							if (response === "ok"){
		          	window.location.replace("/");
			        }else{
			        	alert(JSON.stringify(response));
			        }
						}
		});
		return false;
	});
});