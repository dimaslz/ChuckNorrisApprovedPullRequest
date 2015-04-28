$(document).ready(function () {
	// get images
	var chucknorrisApproved = chrome.extension.getURL("images/chucknorris.png");
	var chucknorrisDeclined = chrome.extension.getURL("images/chucknorris_problem.png");

	// insert images into DOM
	$('body')
		.append('<img id="chucknorris" src="'+chucknorrisApproved+'" alt=""/>')
		.append('<img id="chucknorris-problem" src="'+chucknorrisDeclined+'" alt=""/>');

	// get current images from DOM
	var $chucknorris = $('img#chucknorris');
	var $chucknorris_declined = $('img#chucknorris-problem');

	// get approve button (stash and bitbucket)
	var approved_btn = $('button.aui-button[class*="approve"]');
	$(approved_btn).click(function(){
		$chucknorris
			.animate({
				left: "+=0px",
				width: "500px",
				height: "500px",
				display: 'block',
				top: "+=0px"
			}, 500 );
	});

	// get declined button
	var declined_btn = null;
	var bitbucket = /.*?bitbucket.*/i.test(document.URL);
	if (bitbucket) {
		declined_btn = $('button.aui-button#reject-pullrequest');
	} else {
		declined_btn = $('button.aui-button.decline-pull-request');
	}

	$(declined_btn).click(function(){
		$chucknorris_declined
			.animate({ bottom: "+=300px" }, 1500 );
	});


	var merged = null;
	if (bitbucket) {
		merged = $('.pull-request-status .aui-lozenge.aui-lozenge-success').length;
	} else {
		merged = $('.pull-request-id-and-state .aui-lozenge.aui-lozenge-success').length;
	}

	if (merged) {
		$chucknorris
			.css({right: 0, bottom: 0, position: "fixed"})
			.animate({ right: "=0px", bottom: "=0px", width: "200px", height: "200px", display: 'block' }, 500 );
	}

	$chucknorris.click(function () {
		$(this).hide();
	});

	$chucknorris_declined.click(function () {
		$(this).hide();
	});
});