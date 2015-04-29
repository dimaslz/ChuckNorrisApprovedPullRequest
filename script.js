$(document).ready(function () {
	// get images
	var chucknorrisApproved = chrome.extension.getURL("images/chucknorris.png");
	var chucknorrisDeclined = chrome.extension.getURL("images/chucknorris_problem.png");

	// animations
	var chucknorrisApprovedAnimation = function () {
		$chucknorris.show();
		$chucknorris
			.animate({
				left: "+=0px",
				width: "500px",
				height: "500px",
				display: 'block',
				top: "+=0px"
			}, 500 );
	};

	var chucknorrisStampAnimation = function () {
		$chucknorris
			.css({right: 0, bottom: 0, position: "fixed", left: 'auto', top: 'auto'})
			.animate({ right: "=0px", bottom: "=0px", width: "200px", height: "200px", display: 'block', left: '=auto', top: '=auto' }, 500 );
	};

	// insert images into DOM
	$('body')
		.append('<img id="chucknorris" src="'+chucknorrisApproved+'" alt=""/>')
		.append('<img id="chucknorris-problem" src="'+chucknorrisDeclined+'" alt=""/>');

	// get current images from DOM
	var $chucknorris = $('img#chucknorris');
	var $chucknorris_declined = $('img#chucknorris-problem');

	// get platform
	var bitbucket = /.*?bitbucket.*/i.test(document.URL);
	var github = /.*?github.*/i.test(document.URL);

	// get approve button
	var approved_btn = null;
	if (github) {
		setInterval(function () {
			var url = /.*?github.com.*?\/pull\/.*?$/i.test(document.URL);
			if (url) {
					approved_btn = $('.commit-form-actions button.btn.btn-primary');
					approved_btn.click(function () {
						chucknorrisApprovedAnimation();
					});
			}
		}, 1000);
	} else {
		approved_btn = $('button.aui-button[class*="approve"]');
	}

	$(approved_btn).click(function() {
		var unapprove = /Unapprove/i.test(approved_btn.text());
		if (!unapprove) {
			chucknorrisApprovedAnimation();
		} else {
			setTimeout(function () {
				approved_btn = $('button.aui-button[class*="approve"]');
				$(approved_btn).on('click', function(){
					chucknorrisApprovedAnimation();
				});
			}, 1000);
		}
	});

	// get declined button
	var declined_btn = null;
	if (bitbucket) {
		declined_btn = $('button.aui-button#reject-pullrequest');
	} else if (github) {
		//declined_btn = $('button[name="comment_and_close"].btn.js-comment-and-button');

		var checked_declined = false;
		setInterval(function () {
			var url = /.*?github.com.*?\/pull\/.*?$/i.test(document.URL);
			if (url) {
				declined_btn = $('button[name="comment_and_close"].btn.js-comment-and-button');
				if (/Close pull request/i.test(declined_btn.text()) && !checked_declined) {
					checked_declined = true;
					$(declined_btn).click(function(){
						checked_declined = false;
						$chucknorris_declined.show();
						$chucknorris_declined
							.animate({ bottom: "+=300px" }, 1500 );
					});
				}
			} else {
				checked_declined = false;
				$chucknorris_declined.hide();
			}
		},1000);
	} else {
		declined_btn = $('button.aui-button.decline-pull-request');
	}

	$(declined_btn).click(function(){
		$chucknorris_declined.show();
		$chucknorris_declined
			.animate({ bottom: "+=300px" }, 1500 );
	});

	// when load page on merged pull ...
	var merged = null;
	if (bitbucket) {
		merged = $('.pull-request-status .aui-lozenge.aui-lozenge-success').length;
	} else if (github) {
		merged = $('.state.state-merged .octicon-git-pull-request').length;
	} else {
		merged = $('.pull-request-id-and-state .aui-lozenge.aui-lozenge-success').length;
	}

	// ... execute the animation
	if (!!merged) {
		chucknorrisStampAnimation();
	} else { // github work by states and not reload page, so, we check current url to set stamp or hide it
		if (github) {
			var checked = false;
			setInterval(function () {
				var url = /.*?github.com.*?\/pull\/.*?$/i.test(document.URL);
				if (url) {
					merged = $('.state.state-merged .octicon-git-pull-request').length;
					if (!!merged && !checked) {
						checked = true;
						$chucknorris.show();
						chucknorrisStampAnimation();
					}
				} else {
					checked = false;
					hideChucknorrisApproved($chucknorris);
				}
			},1000);
		}
	}

	var hideChucknorrisApproved = function (element) {
		$(element).hide();
		$(element).css({
			width: 10000,
			height: 10000,
			display: 'none',
			right: 'inherit'
		});
	};
	$chucknorris.click(function () {
		hideChucknorrisApproved(this);
	});


	var hideChucknorrisProblem = function (element) {
		$(element).hide();
		$(element).css({ bottom: -300 });
	};
	$chucknorris_declined.click(function () {
		hideChucknorrisProblem(this);
	});
});