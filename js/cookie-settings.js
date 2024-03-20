$(document).ready(function () {
	$(".cookie-settings-message-close-link").on("click", function (event) {

	//	event.preventDefault();

		$(".cookie-settings-message").hide();
		$(".cookie-settings-background").hide();
		$("body").removeClass("modal-open");

		gtag('consent', 'update', {
			'analytics_storage': 'granted',
			'ad_storage': 'granted'
		});
		// Push the 'event': 'consent_update' to the dataLayer after the consent update
		dataLayer.push({
			'event': 'consent_update',
			'analytics_storage': 'granted',
			'ad_storage': 'granted'
		});

		
		$.ajax({
			url: "/ajax/common/cookies-ok.asp",
			success: function () {
//				$(".cookie-settings-message").hide();
//				$(".cookie-settings-background").hide();
//				$("body").removeClass("modal-open");
			}
		});
	});


	$(".cookie-settings-message-save-link").on("click", function (event) {
		event.preventDefault();

		$(".cookie-settings-message").hide();
		$(".cookie-settings-background").hide();
		$("body").removeClass("modal-open");

		if ($("#frmCookiesBanner #CookiesPerformance").is(":checked") == true) {
			var analyticsStorage = "granted";
		} else {
			var analyticsStorage = "denied";
		}

		if ($("#frmCookiesBanner #CookiesTargeting").is(":checked") == true) {
			var adStorage = "granted";
		} else {
			var adStorage = "denied";
		}

		gtag('consent', 'update', {
			'analytics_storage': analyticsStorage,
			'ad_storage': adStorage
		});

		// Push the 'event': 'consent_update' to the dataLayer after the consent update
		dataLayer.push({
			'event': 'consent_update',
			'analytics_storage': analyticsStorage,
			'ad_storage': adStorage
		});
		
		$.ajax({
			url: "/ajax/common/cookies.asp",
			data: $("#frmCookiesBanner").serialize(),
			type: "POST",
			success: function () {
//				$(".cookie-settings-message").hide();
//				$(".cookie-settings-background").hide();
//				$("body").removeClass("modal-open");
			}
		});
	});



	$(".cookie-settings-manage").on("click", function (event) {
//		$(this).hide();
	});

	$(".cookie-settings-message-settings-link").on("click", function (event) {
		event.preventDefault();
		$.ajax({
			url: "/ajax/common/cookies-ok.asp",
			success: function () {
				location.href = "/about-us/cookies";
			}
		});
	});

});