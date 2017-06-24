$(document).ready(function() {
	var numCorrect = 0;
	var total = 0;
	var currIndex = 0;
	var currFolder = "";

	var getNewImg = function() {
		$("#answer").addClass("hidden");
		// var tempIndex = Math.floor(Math.random()*113);
		// currFolder = folderNames[tempIndex];
		// currIndex = Math.floor(Math.random()*10);
		// currCommonName = speciesNames[tempIndex];
		$.get('/api/newImg', function (data) {
			var newImg = JSON.parse(data);
			console.log(newImg);
			currFolder=newImg.title;
			console.log(newImg.title);
			console.log(newImg.publicLink);
			$("#image-container > img").attr('src',newImg.publicLink);


		});
		$("#loading-wrapper").removeClass("hidden");
		$("img").addClass("hidden");
		//$("#image-container > img").attr('src','/static/imgs/'+currFolder+'/'+currIndex+'.jpg');
		$("#image-container > img").on('load', function() {
			$("#loading-wrapper").addClass("hidden");
			$("img").removeClass("hidden");			
		});
	}
	
	//initial image
	getNewImg();

	var result = $("#result");
	var validate = function() {
		var input = $("#answer-box").val().trim().toLowerCase();
		//console.log("matches sci name "+(acceptScientificNames&&input===currFolder.toLowerCase()));
		console.log("input vs ans "+input+" "+currFolder.toLowerCase());
		if(input===currFolder.toLowerCase()) {
			result.text("Correct!");
			result.removeClass("alert-danger").addClass("alert-success");
			result.removeClass("hidden");
			console.log("correct");
			$("#answer-box").val("");
			$("#answer").addClass("hidden");
			incrementCount(true);
			getNewImg();
		}
		else if (input!=="") {
			result.text("You are wrong!");
			result.addClass("alert-danger").removeClass("alert-success");
			result.removeClass("hidden");
			console.log("incorrect");
			incrementCount(false);
			$("#answer-box").val("");
		}
	};
	var updateAns = function() {
		$("#answer").text(currFolder.replace(/\_/g, ' '));
	}

	var incrementCount = function(correct) {
		if (correct) {
			numCorrect++;
			total++;
		}
		else {
			total++;
		}
		$("#correct").text(numCorrect);
		$("#wrong").text(total-numCorrect);
		$("#percent").text(Math.round(numCorrect/total*100)+"%");
	}

	// $("#start-game").click( function() {
	// 	$(this).hide();
	// 	$("#options, #instructions-container").hide();
	// 	$("#image-container, #input-container, #stats").removeClass("hidden");
	// 	getNewImg();
	// })
	$("#skip").click( function() {
		incrementCount(false);
		getNewImg();
	})
	$("#show-ans").click( function() {
		updateAns();
		$("#answer").toggleClass("hidden");
		$(this).toggleClass("fa-eye-slash");
		$(this).toggleClass("fa-eye");
	});
	$("#answer-box").keypress(function (e) {
		var key = e.which;
		if (key==13){
			validate();
		}
	});

	$("#close-modal, #help-button").click( function() {
		$('.modal').toggleClass('hidden');
	});
});
