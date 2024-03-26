	
(function($) {

    $.ModalTyreSizeOptions = function(options) {
		
				
		var defaults = {
			vrn : "",
			postcode : "",
			svc : "/tyres/search/results",
			url : "/ajax/tyre-size-options/search.asp",
			size : "modal-lg",
			onShow : "",		//function to perform before the modal is shown
			onShown : "",		//function to perform once the modal is shown
			onHide : "",		//function to perform before the modal is hidden
			onHidden: "",		//function to perform once the modal is hidden/removed

			includeTyreSizesInSubmitURL : true,		//function to perform once the modal is hidden/removed
			
			header : "",		//text for the modal header
			content : "",		//text/html for the modal body
			size: "",			//modal-lg or modal-sm (from bs 3.3.7)

			token: "",		//used for kfclub
			FleetAccountNumber: "",		//used for fwb
			Forename: "",		//used for fwb
			Surname: "",		//used for fwb
			Email: "",		//used for fwb
			Mobile: "",		//used for fwb
			FleetProceed: "",		//used for fwb
			SearchOrigin: ""		//used for fwb
		}
		
		//add a listener to the vrm
		options = $.extend(defaults,options);
		
		
		//*************************
		//_generate_id()
		this._generate_id = function(){
			var S4 = function() {
			   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
		//*************************
		

		//*************************
		//_modal_basic(header,content);
		//function for a basic bootstrap modal
		this._modal_basic = function(header,content,size,footer){
		
			var html,id
			var obj = this;
			
			var modalsize = new String();
			modalsize = size;

			var modalfooter = new String();
			modalfooter = footer;
			
			id = this._generate_id();

			html =  '<div id="' + id + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';

			if ("undefined" === typeof size) {
				html += '<div class="modal-dialog modal-tyre-size-options">';	
			} else {
				html += '<div class="modal-dialog ' + modalsize + '  modal-tyre-size-options">';		
			}

			html += '<div class="modal-content">';
			html += '<div class="modal-header">';
			html += '<a class="close" data-dismiss="modal">&times;</a>';
			html += '<h4 class="modal-title">'+header+'</h4>'
			html += '</div>';
			html += '<div class="modal-body">';
			html += content;
			html += '</div>';
			html += '<div class="modal-footer">';
			if ("undefined" === typeof footer) {
				html += '<span class="btn btn-default btn-danger" data-dismiss="modal">Close <i class="fa fa-times"></i></span>';
			} else {
				html += modalfooter;
			}
			html += '</div>';  // content
			html += '</div>';  // dialog
			html += '</div>';  // footer
			html += '</div>';  // modalWindow

			//add the html
			$('body').append(html);
			
			//update the VRN and POSTCODE in the form
			$("#" + id).find("input[name='vrn']").val(options.vrn);
			$("#" + id).find("input[name='postcode']").val(options.postcode);
			$("#" + id).find("input[name='svc']").val(options.svc);
			$("#" + id).find("input[name='FleetAccountNumber']").val(options.FleetAccountNumber);
			$("#" + id).find("input[name='Forename']").val(options.Forename);
			$("#" + id).find("input[name='Surname']").val(options.Surname);
			$("#" + id).find("input[name='Email']").val(options.Email);
			$("#" + id).find("input[name='Mobile']").val(options.Mobile);
			$("#" + id).find("input[name='FleetProceed']").val(options.FleetProceed);
			$("#" + id).find("input[name='SearchOrigin']").val(options.SearchOrigin);


			//show the modal
			$("#" + id).modal();

			$('#' + id).on('show.bs.modal', function (e) {
				if($.isFunction(options.onShow)){
					options.onShow();	
				};
			});		


			$('#' + id).on('shown.bs.modal', function (e) {
				if($.isFunction(options.onShown)){
					options.onShown();	
				};
			});		


			$('#' + id).on('hide.bs.modal', function (e) {
				if($.isFunction(options.onHide)){
					options.onHide();	
				};
			});			
			

			$('#' + id).on('hidden.bs.modal', function (e) {
				if($.isFunction(options.onHidden)){
					options.onHidden();	
				};			
				
				$("body").off("click",".btn-tyre-size-option");
				$("body").off("change",".tyre-size-options--tyre-size-select");
				$("body").off("click",".btn-tyre-size-options--tyre-size-select");
					
				$(this).remove();								
			});
			
			
			$("#" + id).modal('show');
			
			$("body").on("click",".btn-tyre-size-option",function(){
				obj.tyreOptionSelect(this);
			});						
			
			$("body").on("change",".tyre-size-options--tyre-size-select",function(){
				obj.tyreSizeSelect(this);
			});
			$("body").on("click",".btn-tyre-size-options--tyre-size-select",function(){
				obj.tyreSizeSelect(this);
			});
			
		}
		//*************************


		//*************************
		//tyreOptionSelect
		this.tyreOptionSelect = function(obj){
			
			var btn = obj;
			var tsf = $(btn).attr("data-tsf");
			var tsr = $(btn).attr("data-tsr");
			var ori = $(btn).attr("data-ori");
			var dts = tsr;
			var sec = dts.substr(0,3);
			var asp = dts.substr(4,2);
			var spd = dts.substr(6,1);
			var rim = dts.substr(7,2);
								
			$("#frmTyreSizeOptions input[name='dts']").val(dts);
			$("#frmTyreSizeOptions input[name='tsf']").val(tsf);
			$("#frmTyreSizeOptions input[name='tsr']").val(tsr);
			$("#frmTyreSizeOptions input[name='ori']").val(ori);
			
			$("#frmTyreSizeOptions input[name='sec']").val(sec);
			$("#frmTyreSizeOptions input[name='asp']").val(asp);
			$("#frmTyreSizeOptions input[name='spd']").val(spd);
			$("#frmTyreSizeOptions input[name='rim']").val(rim);
			
			$(btn).find(".tyre-size-option--icon-select").hide();
			$(btn).find(".tyre-size-option--icon-loading").show();
			
			this.submitForm();
		}
		//*************************


		//*************************
		//tyreSizeSelect
		this.tyreSizeSelect = function(obj){
			
			var sec = $("select.tyre-size-options--tyre-size-select[rel='sec']");
			var asp = $("select.tyre-size-options--tyre-size-select[rel='asp']");
			var rim = $("select.tyre-size-options--tyre-size-select[rel='rim']");
			var spd = $("select.tyre-size-options--tyre-size-select[rel='spd']");
			
			var rel = $(obj).attr("rel");
			var btn = $(".btn-tyre-size-options--tyre-size-select");
			
			if(sec.val()==null||sec.val()==""){

				//reset the tyre size
				tyreSize = {};
				
				//reset all the other drop downs and disable them!
				$(asp).html("").disable();
				$(rim).html("").disable();
				$(spd).html("").disable();
				
				//load the aspect ratios!
				targetSelect = sec;
				
			} else if(asp.val()==null||asp.val()==""||rel=="sec"){
				
				//set the tyre sizse
				tyreSize = {sec : sec.val()};
				
				//reset all the other drop downs and disable them!
				$(rim).html("").disable();
				$(spd).html("").disable();
				
				//load the aspect ratios!
				targetSelect = asp;
				
			} else if(rim.val()==null||rim.val()==""||rel=="asp"){
				
				//set the tyre sizse
				tyreSize = {sec : sec.val(), asp : asp.val()};
				
				//reset all the other drop downs and disable them!
				$(spd).html("").disable();
				
				//load the aspect ratios!
				targetSelect = rim;
				
			} else if(spd.val()==null||spd.val()==""||rel=="rim"){
				
				//set the tyre sizse
				tyreSize = {sec : sec.val(), asp : asp.val(), rim: rim.val()};
				
				//load the aspect ratios!
				targetSelect = spd;
				
			} else {
				

				//there's no target select anymore
				targetSelect = "TYRESIZESELECTED";
				
				//set the tyre sizse
				tyreSize = {sec : sec.val(), asp : asp.val(), rim: rim.val(), spd : spd.val()};
				
				//set the tyre size selected
				tyreSizeSelected = true;
			}

			
			//create the ajax request (if there's a target select)
			if(typeof targetSelect=='object'){
				$.ajax({
					url : "/ajax/engine-starter/tyresize-search.asp",
					type : "POST",
					data : tyreSize,
					beforeSend: function(){
						$("i[rel='" + rel + "']").show();
					},
					success : function(data){
						$(targetSelect).html(data).enable().focus();
					},
					complete:function(){
						$("i[rel='" + rel + "']").hide();	
					}
				});
				
				btn.disable();
				$(btn).button("reset");
				
			} else {
			
				btn.enable();
				
				if(rel=="btn"){
					
					//get the dts and set the values in the form
					dts = sec.val() + "/" + asp.val() + spd.val() + rim.val();

					$("#frmTyreSizeOptions input[name='dts']").val(dts);
					$("#frmTyreSizeOptions input[name='tsf']").val(dts);
					$("#frmTyreSizeOptions input[name='tsr']").val(dts);
					$("#frmTyreSizeOptions input[name='sec']").val(sec.val());
					$("#frmTyreSizeOptions input[name='asp']").val(asp.val());
					$("#frmTyreSizeOptions input[name='rim']").val(rim.val());
					$("#frmTyreSizeOptions input[name='spd']").val(spd.val());
					$("#frmTyreSizeOptions input[name='ori']").val("TSS");
					
					//set the action and submit!
					$(btn).button("loading");
					this.submitForm();
				}
			
			}
			
			
		}
		//*************************


		
		//*************************
		//submitForm
		this.submitForm = function(){
			
			var sec = $("#frmTyreSizeOptions input[name='sec']");
			var asp = $("#frmTyreSizeOptions input[name='asp']");
			var rim = $("#frmTyreSizeOptions input[name='rim']");
			var spd = $("#frmTyreSizeOptions input[name='spd']");
			var svc = $("#frmTyreSizeOptions input[name='svc']");
			
			//create the url
			if (options.includeTyreSizesInSubmitURL == false) {
				url = svc.val();
			} else if(spd.val()=="*"){
				url = svc.val() + "/" + sec.val() + "/" + asp.val() + "/" + rim.val();
			} else {
				url = svc.val() + "/" + sec.val() + "/" + asp.val() + "/" + rim.val() + "/" + spd.val();
			}			
			
			//set the action and submit!
			$("#frmTyreSizeOptions").attr("action",url).submit();	
			
		}
		//*************************

		
		//*************************
		this.search = function(){
		
			var obj = this;
			var rStatus;
			var rTitle;
			var rBody;
			
			var postData = {
				vrn: options.vrn,
				postcode: options.postcode,
				token: options.token,
				FleetAccountNumber: options.FleetAccountNumber,
				Forename: options.Forename,
				Surname: options.Surname,
				Email: options.Email,
				Mobile: options.Mobile,
				FleetProceed: options.FleetProceed,
				SearchOrigin: options.SearchOrigin
			}
			
			$.ajax({
				url : options.url,							//url to access the data
				data : postData,							//data to pass (mostly $(frm).serialize()
				method	: "POST", 							//POST, GET, PUT
				beforeSend: function (jqHXR, settings) {
//					alert("here1");
				//	$(options.btn).button("loading")
//					alert("here1");
				},
				success:function(data,textStatus,jqXHR ){
										
					if(jQuery.isXMLDoc(data)){
						
						rStatus = $(data).find("STATUS").text();
						rTitle = $(data).find("TITLE").text();
						rBody = $(data).find("BODY").text();
						
						if(rStatus=="SUCCESS"){
							obj._modal_basic(rTitle,rBody);
						} else if (rStatus == "FLEETVEHICLE") {	
							var footerButtons = '<span class="btn btn-default btn-danger" data-dismiss="modal">Close <i class="fa fa-times"></i></span> <span class="btn btn-default btn-success btn-continue-fleet-vehicle" data-dismiss="modal">Continue <i class="fa fa-chevron-right"></i></span>';
							obj._modal_basic(rTitle, rBody,"",footerButtons);
						} else {						
							obj._modal_basic(rTitle,rBody);
						}
					}				
					
				},
				complete:function(jqXHR,textStatus){
				//	$(options.btn).button("reset")
				},
				error:function(jqXHR,textStatus,errorThrown){
					obj._modal_basic(textStatus,jqXHR.responseText);
				}
				
			});			
			
		}
		//*************************
			
		this.search();


		$("#frmTyreSizeOptions").on("pageinit", function (e) {
			var page = $(this);
			resetTyreSizeOptions()
		});
		
		var myCustomEvent = (navigator.userAgent.match('iPhone') != null) ? 'popstate' : 'pageshow';
		
		$(window).on(myCustomEvent, function(e) {
			resetTyreSizeOptions();
		});
		
		function resetTyreSizeOptions(){
			$(".btn-tyre-size-options--tyre-size-select").button("reset");
			$(".tyre-size-option--icon-select").show();
			$(".tyre-size-option--icon-loading").hide();				
		}


	}

}(jQuery));				