//*************************
/* Javascript init for engine starter */
$(document).ready(function () {

	$(".btn-es-services-search").on("click", function () {
		esServicesSearch("#frmEngineStarter", this);
	});

	$("body").on("click", ".btn-continue-fleet-vehicle", function () {
		$("#frmEngineStarter #FleetProceed").val("Y");
		esServicesSearch("#frmEngineStarter", this);
	});

	$("#modal_tyres-select-tyre-size .btn-select-tyre-size-confirm").on("click", function () {
		tyresSelectTyreSizeSelectConfirm("#modal_tyres-select-tyre-size", "#frmEngineStarter");
	});

	$("#ESSec, #ESAsp, #ESRim, #ESSpd").on("change", function () {
		esTyreSizeSearchUpdate("#frmEngineStarter", this, $("#ESSec"), $("#ESAsp"), $("#ESRim"), $("#ESSpd"));
		$("#ESSvc").val("tyres/search/results");
	});

	$(".btn-es-tyresize-search").on("click", function () {
		esTyreSizeSearchUpdate("#frmEngineStarter", this, $("#ESSec"), $("#ESAsp"), $("#ESRim"), $("#ESSpd"));
	});

	//check if we've already selected the tyre size
	esSetTyreSizeSelectFromDTS("#frmEngineStarter", $("#ESSec"), $("#ESAsp"), $("#ESRim"), $("#ESSpd"));

	$('#ESVrn, #VehicleSearchPostcode').keypress(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') {
			$(".btn-es-services-search").trigger("click");
		}
	});

	$('#TyreSizePostcode').keypress(function (event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode == '13') {
			$(".btn-es-tyresize-search").trigger("click");
		}
	});

	//Tyre Size - Postcode - Keyup
	$("#VehicleSearchPostcode, #TyreSizePostcode").on("keyup", function (event) {
		postcode = $(this).val().toUpperCase();
		$(this).val(postcode);
	});

	//trigger air conditioning check when recharge isn't available
	$("body").on("click", ".btn-aircon-check-vehicle-search", function () {
		airConCheckVehicleSearch("#frmEngineStarter", this)
	});

	//disable the button
	$(".btn-aircon-check-vehicle-search").prop("disabled",false);

	if ($("#ESVrn").val() != "") {
		$(".btn-clear-vrm").show();
	}

	$("#ESVrn").keyup(function (event) {
		if ($(this).val() == "") {
			$(".btn-clear-vrm").hide();
		} else {
			$(".btn-clear-vrm").show();
		}
	});

	$(".btn-clear-vrm").on("click", function () {
		$("#ESVrn").val("");
		$(".btn-clear-vrm").hide();
	});

});
//*************************

//*************************
function startESTyreSizeSearch(token) {

	var thisToken = token;
	$("#RecaptchaToken").val(thisToken);

	esTyreSizeSearchUpdate("#frmEngineStarter", $(".btn-tyres-tyre-size-search-recaptcha"), $("#ESSec"), $("#ESAsp"), $("#ESRim"), $("#ESSpd"));

}
//*************************

//*************************
//esSetTyreSizeSelectFromDTS(formid,selsec,selasp,selrim,selspd)
function esSetTyreSizeSelectFromDTS(formid, selsec, selasp, selrim, selspd) {


	var dts = $(formid + " input[name='dts']").val() == null ? '' : $(formid + " input[name='dts']").val();
	var pattern = /[1-3][0-9]{2}\/[2-9][0-9][HMNPQRSTVWYZ][1-2][0-9]/i;
	var res = pattern.test(dts);


	if (res == true) {

		var thisSec = dts.substr(0, 3)
		var thisAsp = dts.substr(4, 2);
		var thisRim = dts.substr(7, 2);
		var thisSpd = dts.substr(6, 1);

		var tyreSize = { sec: thisSec, asp: thisAsp, rim: thisRim, spd: thisSpd }

		//get the speed options
		$.ajax({
			url: "/ajax/engine-starter/tyresize-from-dts.asp",
			type: "POST",
			data: tyreSize,
			success: function (data) {
				if (jQuery.isXMLDoc(data)) {
					//get the xml
					xml = $(data);

					//set the speed
					$(selspd).html(xml.find("SPD").text()).removeAttr("disabled");
					$(selspd).val(thisSpd);

					//set the rim
					$(selrim).html(xml.find("RIM").text()).removeAttr("disabled");
					$(selrim).val(thisRim);

					//set the asp
					$(selasp).html(xml.find("ASP").text()).removeAttr("disabled");
					$(selasp).val(thisAsp);

					//set the sec
					$(selsec).html(xml.find("SEC").text()).removeAttr("disabled");
					$(selsec).val(thisSec);
				}
			}
		});
	}
}
//*************************


//*************************
//esUpdateForm(formid)
function esUpdateForm(formid) {
	$(formid + " input[name='vrn']").val($("#ESVrn").val());
	$(formid + " input[name='svc']").val($("#ESSvc").val());
	$(formid + " input[name='sec']").val($("#ESSec").val());
	$(formid + " input[name='asp']").val($("#ESAsp").val());
	$(formid + " input[name='rim']").val($("#ESRim").val());
	$(formid + " input[name='spd']").val($("#ESSpd").val());
}
//*************************


//*************************
//esServicesSearch(obj)
function esServicesSearch(formid, obj) {

	//declare variables
	var btn;
	var postData;
	var standardErrorMessage;

	//get the values from the engine starter inputs
	esUpdateForm(formid);
	$(formid + " input[name='Postcode']").val($("#VehicleSearchPostcode").val());

	//get the booking engine!
	bookingEngine = $("#ESSvc option:selected").data("bookingengine");

	//set the action on the form
	$(formid).attr("action", $(formid + " input[name='svc']").val());

	//choose the booking engine					
	if (bookingEngine == "air-conditioning") {

		airConditioningVehicleSearch(formid, obj);

	} else if (bookingEngine == "batteries") {

		batteriesVehicleSearch(formid, obj)

	} else if (bookingEngine == "roadhero") {

		roadheroVehicleSearch(formid, obj)

	} else if (bookingEngine == "brakes") {

		brakesVehicleSearch(formid, obj)

	} else if (bookingEngine == "diagnostics") {

		diagnosticsCheckVehicleSearch(formid, obj)

	} else if (bookingEngine == "exhausts") {

		exhaustsVehicleSearch(formid, obj)

	} else if (bookingEngine == "mot") {

		smotVehicleSearch(formid, obj, "MOT");

	} else if (bookingEngine == "servicing") {

		smotVehicleSearch(formid, obj, "SERVICE");

	} else if (bookingEngine == "tyres") {

		tyresVehicleSearch(formid, obj, "TYRE");

	} else if (bookingEngine == "wheel-alignment") {

		wheelAlignmentVehicleSearch(formid, obj);

	} else if (bookingEngine == "wiper-blades") {

		wiperBladesVehicleSearch(formid, obj);

	} else if (bookingEngine == "vehicle-safety-check") {

		vehicleSafetyCheckVehicleSearch(formid, obj);

	} else if (bookingEngine == "car-mats") {

		carMatsVehicleSearch(formid, obj);

	}
}
//*************************


//*************************
//esSelectTyreSizeSelectConfirm(modalid,formid)
function esSelectTyreSizeSelectConfirm(modalid, formid) {

	dts = $(formid + " input[name='dts']").val();
	tsf = $(formid + " input[name='tsf']").val();
	tsr = $(formid + " input[name='tsr']").val();

	if (dts == '' || tsf == '' || tsr == '') {
		$(modalid + " .alert-select-tyre-size-confirm").show();
	} else {

		sec = dts.substr(0, 3)
		asp = dts.substr(4, 2);
		spd = dts.substr(6, 1);
		rim = dts.substr(7, 2);

		$(formid + " input[name='sec']").val(sec);
		$(formid + " input[name='asp']").val(asp);
		$(formid + " input[name='spd']").val(spd);
		$(formid + " input[name='rim']").val(rim);

		//set the action on the form
		svc = $(formid + " input[name='svc']").val();

		//set the form action and submit!
		esSetTyreSearchFormActionAndSearch(formid, svc, dts);
	}
}
//*************************


//*************************
//esSetTyreSearchFormActionAndSearch(formid,svc,dts)
function esSetTyreSearchFormActionAndSearch(formid, svc, dts) {

	var sec = dts.substr(0, 3)
	var asp = dts.substr(4, 2);
	var spd = dts.substr(6, 1);
	var rim = dts.substr(7, 2);

	//add the tyre size (dts)
	if (spd == "*") {
		url = svc + "/" + sec + "/" + asp + "/" + rim;
	} else {
		url = svc + "/" + sec + "/" + asp + "/" + rim + "/" + spd;
	}

	//set the action and submit!
	$(formid).attr("action", url).submit();

}
//*************************


//*************************
//esTyreSizeSearchUpdate(element)
//function to process the searchByTyreSize form when any of the select elements are updated
function esTyreSizeSearchUpdate(formid, element, selsec, selasp, selrim, selspd) {

	//get the values from the engine starter inputs
	esUpdateForm(formid);
	$(formid + " input[name='Postcode']").val($("#TyreSizePostcode").val());

	//what is the element we're looking up? (sec, asp, rim or spd)
	var rel = $(element).attr("rel");

	var thisSec = (selsec.val() == null) ? '' : selsec.val();
	var thisAsp = (selasp.val() == null) ? '' : selasp.val();
	var thisRim = (selrim.val() == null) ? '' : selrim.val();
	var thisSpd = (selspd.val() == null) ? '' : selspd.val();

	var targetSelect = '';
	var tyreSize;
	var tyreSizeSelected = false;
	var tyreSizeString;


	if (thisSec == "") {

		//reset the tyre size
		tyreSize = {};

		//reset all the other drop downs and disable them!
		$(selasp).attr("disabled", "disabled").html("");
		$(selrim).attr("disabled", "disabled").html("");
		$(selspd).attr("disabled", "disabled").html("");

		//load the aspect ratios!
		targetSelect = selsec;

	} else if (thisAsp == "" || rel == "sec") {

		//reset the tyre size
		tyreSize = { sec: thisSec };

		//reset all the other drop downs and disable them!
		$(selasp).attr("disabled", "disabled").html("");
		$(selrim).attr("disabled", "disabled").html("");
		$(selspd).attr("disabled", "disabled").html("");

		//load the aspect ratios!
		targetSelect = selasp;

	} else if (thisRim == "" || rel == "asp") {

		//reset the tyre size
		tyreSize = { sec: thisSec, asp: thisAsp };

		//reset all the other drop downs and disable them!
		$(selrim).attr("disabled", "disabled").html("");
		$(selspd).attr("disabled", "disabled").html("");

		//load the aspect ratios!
		targetSelect = selrim;

	} else if (thisSpd == "" || rel == "rim") {

		//reset the tyre size
		tyreSize = { sec: thisSec, asp: thisAsp, rim: thisRim };

		//reset all the other drop downs and disable them!
		$(selspd).attr("disabled", "disabled").html("");

		//load the aspect ratios!
		targetSelect = selspd;

	} else {

		//there's no target select anymore
		targetSelect = "TYRESIZESELECTED";

		//set the tyre sizse
		tyreSize = { sec: thisSec, asp: thisAsp, rim: thisRim, spd: thisSpd };

		//set the tyre size selected
		tyreSizeSelected = true;
	}

	//update the relevant fields
	$(formid + " input[name='sec']").val(tyreSize.sec);
	$(formid + " input[name='asp']").val(tyreSize.asp);
	$(formid + " input[name='rim']").val(tyreSize.rim);
	$(formid + " input[name='spd']").val(tyreSize.spd);


	//create the ajax request (if there's a target select)
	if (typeof targetSelect == 'object') {
		$.ajax({
			url: "/ajax/engine-starter/tyresize-search.asp",
			type: "POST",
			data: tyreSize,
			success: function (data) {
				$(targetSelect).html(data).removeAttr("disabled").focus();
			}
		});
	} else {
		if ($("#TyreSizePostcode").val() == "" && targetSelect == "TYRESIZESELECTED" && rel == "btn") {
			
			$.ModalBasic("Tyre Search", "<p>Please select your tyre size, enter your postcode then click \"Search\".</p>");
			if ($(element).hasClass("g-recaptcha") == true) {
				grecaptcha.reset();
			}
		} else if (targetSelect == "TYRESIZESELECTED" && rel == "btn") {

			//get the dts and set the values in the form
			dts = tyreSize.sec + "/" + tyreSize.asp + tyreSize.spd + tyreSize.rim

			$(formid + " input[name='dts']").val(dts);
			$(formid + " input[name='tsf']").val(dts);
			$(formid + " input[name='tsr']").val(dts);

			//set the action on the form
			svc = "/tyres/search/results"; //$(formid + " input[name='svc']").val();

			//set the form action and submit!
			esSetTyreSearchFormActionAndSearch(formid, svc, dts);
		}
	}

}
//*************************