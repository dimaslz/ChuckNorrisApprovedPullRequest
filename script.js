// get images
var chucknorrisApprovedStampImage = chrome.extension.getURL("images/chucknorris.png");
var chucknorrisProblemImage  	  = chrome.extension.getURL("images/chucknorris_problem.png");

// chuck norris stamp element
var chucknorrisApprovedStamp = document.createElement('img');
chucknorrisApprovedStamp.id  = 'chucknorris';
chucknorrisApprovedStamp.src = chucknorrisApprovedStampImage;

// animations
var chucknorrisApprovedAnimation = function () {
	chucknorrisApprovedStamp.className = chucknorrisApprovedStamp.className + ' show';
	setTimeout(function () {
		chucknorrisApprovedStamp.className = chucknorrisApprovedStamp.className + ' approved-animation';
	}, 1);
};

var chucknorrisStampAnimation = function () {
	chucknorrisApprovedStamp.className = chucknorrisApprovedStamp.className + 'show';
	setTimeout(function () {
		chucknorrisApprovedStamp.className = chucknorrisApprovedStamp.className + ' stamp-certified-animation';
	}, 1);
};

// chuck norris problem
var chucknorrisProblem = document.createElement('img');
chucknorrisProblem.id  = 'chucknorris-problem';
chucknorrisProblem.src = chucknorrisProblemImage;

// insert images into DOM
var body = document.querySelector('body');
body.appendChild(chucknorrisApprovedStamp);
body.appendChild(chucknorrisProblem);

// get platform
var bitbucket = /.*?bitbucket.*/i.test(document.URL);
var github	  = /.*?github.*/i.test(document.URL);

// get approve button
var approved_btn = null;
if (github) {
	setInterval(function () {
		var url = /.*?github.com.*?\/pull\/.*?$/i.test(document.URL);
		if (url) {
			approved_btn = document.querySelector('.state.state-merged');
			approved_btn.addEventListener('click', function () {
				chucknorrisApprovedAnimation();
			});
		}
	}, 1000);
} else {
	approved_btn = document.querySelector('button.aui-button[class*="approve"]');
}

if(!!approved_btn) {
	approved_btn.addEventListener('click', function () {
		var unapprove = /Unapprove/i.test(approved_btn.innerText);
		if (!unapprove) {
			chucknorrisApprovedAnimation();
		} else {
			setTimeout(function () {
				approved_btn = document.querySelector('button.aui-button[class*="approve"]');
				approved_btn.addEventListener('click', function () {
					chucknorrisApprovedAnimation();
				});
			}, 1000);
		}
	});
}

// get declined button
var declined_btn = null;
if (bitbucket) {
	declined_btn = document.querySelector('button.aui-button#reject-pullrequest');
} else if (github) {
	var checked_declined = false;
	setInterval(function () {
		var url = /.*?github.com.*?\/pull\/.*?$/i.test(document.URL);
		if (url) {
			declined_btn = document.querySelector('button[name="comment_and_close"].btn.js-comment-and-button');
			if (!!declined_btn && /Close pull request/i.test(declined_btn.text()) && !checked_declined) {
				checked_declined = true;
				declined_btn.addEventListener('click', function () {
					checked_declined = false;
					chucknorrisProblem.className = chucknorrisProblem.className + ' show'; 
				});
			}
		} else {
			checked_declined = false;
			chucknorrisProblem.className = '';
		}
	},1000);
} else {
	declined_btn = document.querySelector('button.aui-button.decline-pull-request');
}

if(!!declined_btn) {
	declined_btn.addEventListener('click', function () {
		chucknorrisProblem.className = chucknorrisProblem.className + ' show';
	});
}

// when load page on merged pull ...
var merged = null;
if (bitbucket) {
	merged = document.querySelector('.pull-request-status .aui-lozenge.aui-lozenge-success');
} else if (github) {
	merged = document.querySelector('.state.state-merged .octicon-git-pull-request');
} else {
	merged = document.querySelector('.pull-request-id-and-state .aui-lozenge.aui-lozenge-success');
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
				merged = document.querySelector('.state.state-merged .octicon-git-pull-request');
				if (!!merged && !checked) {
					checked = true;
					chucknorrisStampAnimation();
				}
			} else {
				checked = false;
				hideChucknorrisApproved();
			}
		}, 1000);
	}
}

var hideChucknorrisApproved = function () {
	chucknorrisApprovedStamp.className = '';
};

chucknorrisApprovedStamp.addEventListener('click', function () {
	hideChucknorrisApproved();
});

var hideChucknorrisProblem = function () {
	chucknorrisProblem.className = '';
};

chucknorrisProblem.addEventListener('click', function () {
	hideChucknorrisProblem();
});