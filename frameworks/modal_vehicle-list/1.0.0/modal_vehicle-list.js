(function($) {

    $.ModalVehicleList = function(options) {		
		
		var defaults = {
			url 	 : "/ajax/modal_vehicle-list/data.asp",
			onShow 	 : "",		//function to perform before the modal is shown
			onShown  : "",		//function to perform once the modal is shown
			onHide 	 : "",		//function to perform before the modal is hidden
			onHidden : "",		//function to perform once the modal is hidden/removed
			onSelect : function(){
				alert("onSelect required");
			},
			header 	 : "Vehicle Not Found",
			content	 : "Sorry but we could not find your vehicle. Please enter your vehicle details below.",
			data	 : {
				vrn 	: "",
				year 	: 0,
				make 	: "",
				model 	: "",
				engine 	: {
					fuel : "",
					capacity : ""	
				},
				vehicleCategory : ""
			},
			elements : {
				vrn 	 : "",
				year 	 : "",
				make 	 : "",
				model  	 : "",
				engine	 : ""
			}
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
		this._modal_vehicleList = function(){
		
			var html,id
			var obj = this;
			
			id = obj._generate_id();
			
			html =  '<div id="' + id + '" class="modal fade modal_vehicle-list" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
			html += '	<div class="modal-dialog">';
			html += '		<div class="modal-content">';
			html += '			<div class="modal-header">';
			html += '				<a class="close" data-dismiss="modal"><i class="fa fa-times"></i></a>';
			html += '				<h4>' + options.header + '</h4>'
			html += '			</div>';
			html += '			<div class="modal-body">';
			html += '				' + options.content;
			html += '				<hr>';
			html += '				<form id="vehiclelist_frm_' + id + '" name="vehiclelist_frm_" method="post" class="form-horizontal">'
			html += '					<div class="form-group">';
			html += '						<label class="control-label col-xs-3" for="vehiclelist_vrn_' + id + '">Reg.No</label>';
			html += '						<div class="col-xs-9">';
			html += '							<div class="input-group">';
            html += '								<input data-regex=".{2,}" type="text" id="vehiclelist_vrn_' + id + '" name="vehiclelist_vrn" class="form-control vehiclelist_vrn" value=""  />';
			html += '								<span class="input-group-addon"><i class="fa fa-asterisk" rel="vehiclelist_vrn_' + id + '"></i></span>';
			html += '							</div>';
			html += '						</div>';
			html += '					</div>';
			html += '					<div class="form-group">';
			html += '						<label class="control-label col-xs-3" for="vehiclelist_year_' + id + '">Year</label>';
			html += '						<div class="col-xs-9">';
			html += '							<div class="input-group">';
			html += '								<select data-regex=".*" id="vehiclelist_year_' + id + '" name="vehiclelist_year" class="form-control vehiclelist_year" disabled="disabled"></select>';
			html += '								<span class="input-group-addon vehiclelist_year"><i class="fa fa-asterisk" rel="vehiclelist_year_' + id + '"></i></span>';
			html += '							</div>';
			html += '						</div>';
			html += '					</div>	';
			html += '					<div class="form-group">';
			html += '						<label class="control-label col-xs-3" for="vehiclelist_make_' + id + '">Make</label>';
			html += '						<div class="col-xs-9">';
			html += '							<div class="input-group">';
			html += '								<select data-regex=".*" id="vehiclelist_make_' + id + '" name="vehiclelist_make" class="form-control vehiclelist_make" disabled="disabled"></select>';
			html += '								<span class="input-group-addon vehiclelist_make"><i class="fa fa-asterisk" rel="vehiclelist_make_' + id + '"></i></span>';
			html += '							</div>';
			html += '						</div>';
			html += '					</div>';
			html += '					<div class="form-group">';
			html += '						<label class="control-label col-xs-3" for="vehiclelist_model_' + id + '">Model</label>';
			html += '						<div class="col-xs-9">';
			html += '							<div class="input-group">';
			html += '								<select data-regex=".*" id="vehiclelist_model_' + id + '" name="vehiclelist_model" class="form-control vehiclelist_model" disabled="disabled"></select>';
			html += '								<span class="input-group-addon vehiclelist_model"><i class="fa fa-asterisk" rel="vehiclelist_model_' + id + '"></i></span>';
			html += '							</div>';
			html += '						</div>';
			html += '					</div>';
			html += '					<div class="form-group">';
			html += '						<label class="control-label col-xs-3" for="vehiclelist_engine_' + id + '">Engine</label>';
			html += '						<div class="col-xs-9">';
			html += '							<div class="input-group">';
			html += '								<select data-regex=".*" id="vehiclelist_engine_' + id + '" name="vehiclelist_engine" class="form-control vehiclelist_engine" disabled="disabled"></select>';
			html += '								<span class="input-group-addon vehiclelist_engine"><i class="fa fa-asterisk" rel="vehiclelist_engine_' + id + '"></i></span>';
			html += '							</div>';
			html += '						</div>';
			html += '					</div>';
			html += '				</form>';
			html += '			</div>';
			html += '			<div class="modal-footer">';
			html += '				<span class="btn btn-default btn-kf btn-danger" data-dismiss="modal">Cancel <i class="fa fa-times"></i></span>';
			html += '				<span class="btn btn-default btn-kf btn-success" id="vehiclelist_btn_' + id + '" disabled>Select <i class="fa fa-chevron-right"></i></span>';
			html += '			</div>';  // content
			html += '		</div>';  // dialog
			html += '	</div>';  // footer
			html += '</div>';  // modalWindow


			//set the elements
			options.elements.modal 	= "#" + id;
			options.elements.vrn 	= "#vehiclelist_vrn_" + id;
			options.elements.year 	= "#vehiclelist_year_" + id;
			options.elements.make 	= "#vehiclelist_make_" + id;
			options.elements.model 	= "#vehiclelist_model_" + id;
			options.elements.engine = "#vehiclelist_engine_" + id;
			options.elements.button = "#vehiclelist_btn_" + id;

			$('body').append(html);
			$(options.elements.modal).modal();
			
			//*************************			
			//what to do when the modal is triggered to show
            $(options.elements.modal).on('show.bs.modal', function (e) {
				if($.isFunction(options.onShow)){
					options.onShow();	
                };	

                if ($('#ESVrn').val()) {
                    $(options.elements.vrn).val($('#ESVrn').val());
                    $(options.elements.vrn).trigger("keyup");
                } else if ($('#VRN').val()) {
                    $(options.elements.vrn).val($('#VRN').val());
                    $(options.elements.vrn).trigger("keyup");
                } else {
                    $(options.elements.vrn).focus();
                }


				
			});
			//*************************			
			
			
			//*************************			
			//what to do when the modal has loaded
            $(options.elements.modal).on('shown.bs.modal', function (e) {
				if($.isFunction(options.onShown)){
					options.onShown();	
				};	
				$("#vehiclelist_vrn_" + id).focus();	
				
				
			});
			//*************************
			
			
			//*************************			
			//what to do when the modal is going away
            $(options.elements.modal).on('hide.bs.modal', function (e) {
				
				if($.isFunction(options.onHide)){
					options.onHide();	
				};	
			});
			//*************************			
			
			
			//*************************						
			//what to do when the modal is hidden
			$(options.elements.modal).on('hidden.bs.modal', function (e) {
				
				if($.isFunction(options.onHidden)){
					options.onHidden();	
				};	
								
				//remove any listeners added for this modal
				$(options.elements.vrn).off("keyup");
				$(options.elements.year).off("change");
				$(options.elements.make).off("change");
				$(options.elements.model).off("change");
				$(options.elements.engine).off("change");
				$(options.elements.button).off("click");
					
				//remove the object from the dom
				$(this).remove();					
			});
			//*************************			
			
			
			//*************************			
			//Events
			$(options.elements.vrn).on("keyup",function(){
				//set the vrn
				obj.vrn($(this).val());
			});
			
			$(options.elements.year).on("change",function(){
				obj.year($(this).val());
			});
			
			$(options.elements.make).on("change",function(){
				obj.make($(this).val());
			});
			
			$(options.elements.model).on("change",function(){
				obj.model($(this).val());
			});
			
			$(options.elements.engine).on("change",function(){
				obj.engine($(this).val());
			});
			
			$(options.elements.button).on("click", function () {

				if ($(options.elements.vrn).val() != "" && $(options.elements.year).val() != "" && $(options.elements.make).val() != "" && $(options.elements.model).val() != "") {
					if ($.isFunction(options.onSelect)) {
						options.onSelect(options.data);
					};
				}
			});
			//*************************			
			
			
			//show the modal
			$(options.elements.modal).modal('show');			
			
		}
		//*************************
		
		
		
		//*************************	
		//setter/getter for the vrn
		this.vrn = function(value){
			// No value passed, act as a getter.
			if(value===undefined){				
				return options.data.vrn;
					
			// Value passed, act as a setter.		
			} else {
				options.data.vrn = value.toUpperCase().replace(" ","");
				
				//update the vrn displayed
				$(options.elements.vrn).val(options.data.vrn);
				
				this._updateYearSelect();				
			}
				
			this.regexAddOns();
		}
		//*************************	
		
		
		//*************************	
		//setter/getter for the year
		this.year = function(value){
			// No value passed, act as a getter.
			if(value===undefined){				
				return options.data.year;
					
			// Value passed, act as a setter.		
			} else {
				//set the data
				options.data.year = value;
				
				//update the make/model/engine
				this.make("");
				this.model("");
				this.engine("");				
				
				//list the makes!
				this._updateSelect(options.elements.make);
			}				
				
			this.regexAddOns();	
		}
		//*************************	
		
		
		
		

		//*************************	
		//getter/setter for the make		
		this.make = function(value){
		
			if(value===undefined){
				return options.data.make;	
			} else if(value==""){
				
				$(options.elements.make).html("").disable();	
				options.data.make = null;
			} else if(value=="please-select"){
				
				$(options.elements.make).enable().focus();
				
				this.model("");
				this.engine("");
				
			} else {
				options.data.make = value;
				
				this.model("");
				this.engine("");
				
				//list the models
				this._updateSelect(options.elements.model);
			}
				
			this.regexAddOns();
		}
		//*************************
		
		

		//*************************	
		//getter/setter for the make		
		this.model = function(value){
		
			if(value===undefined){
				return options.data.model;	
			} else if(value==""){
				
				$(options.elements.model).html("").disable();	
				options.data.model = null;
				
			} else if(value=="please-select"){
				
				$(options.elements.model).enable().focus();
				
				this.engine("");
				
			} else {
				options.data.model = value;

				this.engine("");
				
				//list the models
				this._updateSelect(options.elements.engine);
			}
				
			this.regexAddOns();
		}
		//*************************
		
		

		//*************************	
		//getter/setter for the make		
		this.engine = function(value){
		
			if(value===undefined){
				return options.data.engine;	
			} else if(value==""){
				
				$(options.elements.engine).html("").disable();	
				options.data.engine.fuel = null;
				options.data.engine.capacity = null;			
				options.data.vehicleCategory = null;				
				
				//disable the button
				$(options.elements.button).disable();

			} else if(value=="please-select"){

				$(options.elements.engine).enable().focus();

				//disable the button
				$(options.elements.button).disable();
				
			} else {
				
				opt = $(options.elements.engine).find("option[value='" + value + "']");

				options.data.engine.fuel = $(opt).attr("data-fuel");
				options.data.engine.capacity = $(opt).attr("data-capacity");
				options.data.vehicleCategory = $(opt).attr("data-vehiclecategory");

				//enable the button
				$(options.elements.button).enable();
			}
				
			this.regexAddOns();
		}
		//*************************
		
		
		this.regexAddOns = function(obj){
			
			$(options.elements.modal).find("[data-regex]").each(function(i,x){
				if($(x).is(":disabled")){
					//reset to *
					$(x).closest(".input-group").find("i").attr("class","fa fa-asterisk text-info");	
					
				} else {
					
					if($(x).val()==null || $(x).val()=="" || $(x).val()=="please-select"){
						$(x).closest(".input-group").find("i").attr("class","fa fa-asterisk text-info");							
					} else {
						if($(x).val().trim().match($(x).attr("data-regex"))){
							$(x).closest(".input-group").find("i").attr("class","fa fa-check text-success");
						} else {
							$(x).closest(".input-group").find("i").attr("class","fa fa-times text-danger");
						}
					} 
					
				}
			});
		}
		//*************************	
		
		
		
		//*************************	
		this._updateSelect = function(el){
			
			
			var addOn = $("i[rel='" + el.replace("#","") + "']");
						
			$.ajax({
				url : options.url,		//url to access the data
				data : options.data,	//data to pass (mostly $(frm).serialize()
				dataType : "xml", 		//Intelligent Guess , xml, json, script, or html - checks the expected type returned from the server
				method	: "POST", 		//POST, GET, PUT
				beforeSend: function(jqHXR,settings){
					$(addOn).attr("class","fa fa-circle-o-notch fa-spin");
				},
				success:function(data,textStatus,jqXHR ){
					
					if(jQuery.isXMLDoc(data)){
					
						xml = $(data);
						
						if(xml.find("STATUS").text()=="SUCCESS"){
														
							$(el).html(xml.find("OUTPUT").text()).enable().focus();
						} else {
							$.ModalBasic(xml.find("TITLE").text(),xml.find("BODY").text());
						}

					} else {
						$.ModalBasic("Error","An error occurred while loading the data.");
					}
					
				},
				complete:function(){
					$(addOn).attr("class","fa fa-asterisk");	
				},
				error:function(jqXHR,textStatus,errorThrown){
					$.ModalBasic(textStatus,jqXHR.responseText);					
				}				
			});	
		}
		//*************************	
		
		
		

		//*************************		
		//_updateYearSelect(obj)
		this._updateYearSelect = function(){
			
			var vrn = this.vrn();
			
			
			//get the layout
			if(/^[A-Z]{3}\d{1,3}[A-Z]$/.test(vrn)){
				vrnType = 1;
			} else if(/^[A-Z]\d{1,3}[A-Z]{3}$/.test(vrn)){
				vrnType = 2;	
			} else if(/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(vrn)){
				vrnType = 3;
			} else {
				vrnType = 4;
			}		
			
			var today = new Date();
					
			var vrnType1RegYear = {
				A : {start : 1963, end : 1963},
				B : {start : 1964, end : 1964},
				C : {start : 1965, end : 1965},
				D : {start : 1966, end : 1966},
				E : {start : 1967, end : 1967},
				F : {start : 1967, end : 1968},
				G : {start : 1968, end : 1969},
				H : {start : 1969, end : 1970},
				J : {start : 1970, end : 1971},
				K : {start : 1971, end : 1972},
				L : {start : 1972, end : 1973},
				M : {start : 1973, end : 1974},
				N : {start : 1974, end : 1975},
				P : {start : 1975, end : 1976},
				R : {start : 1976, end : 1977},
				S : {start : 1977, end : 1978},
				T : {start : 1978, end : 1979},
				V : {start : 1979, end : 1980},
				W : {start : 1980, end : 1981},
				X : {start : 1981, end : 1982},
				Y : {start : 1982, end : 1983}
			}
			
			var vrnType2RegYear = {
				A : {start : 1983, end : 1984},
				B : {start : 1984, end : 1985},
				C : {start : 1985, end : 1986},
				D : {start : 1986, end : 1987},
				E : {start : 1987, end : 1988},
				F : {start : 1988, end : 1989},
				G : {start : 1989, end : 1990},
				H : {start : 1990, end : 1991},
				J : {start : 1991, end : 1992},
				K : {start : 1992, end : 1993},
				L : {start : 1993, end : 1994},
				M : {start : 1994, end : 1995},
				N : {start : 1995, end : 1996},
				P : {start : 1996, end : 1997},
				R : {start : 1997, end : 1998},
				S : {start : 1998, end : 1999},
				T : {start : 1999, end : 1999},
				V : {start : 1999, end : 2000},
				W : {start : 2000, end : 2000},
				X : {start : 2000, end : 2001},
				Y : {start : 2001, end : 2001}
			}
			
			//get the start and end years
			if(vrnType==1){
				//get the regChar
				yearChar 	= vrn.charAt(vrn.length - 1);
				yearOptions = vrnType1RegYear[yearChar];
			} else if(vrnType==2){
			
				//get the regChar
				yearChar 	= vrn.charAt(0);
				yearOptions = vrnType2RegYear[yearChar];
				
			} else if(vrnType==3){
			
				//get the reg char!
				vrnChar = Number(vrn.substr(2,2));
				vrnNum  = Number(vrn.substr(2,1));
	
				//calculate the reg years!
				if(vrnNum < 5){
					yearOptions = {
						start 	: 2000+vrnChar,
						end	 	: 2000+vrnChar
					}
				} else {
					yearOptions = {
						start : 1950+vrnChar,
						end : 1950+vrnChar+1
					}
				}
			
			} else {
				yearOptions = {
					start : 1990,
					end : today.getFullYear()
				}
			}
			
			
			var html = "<!-- Options Start -->"
			
			//create the options
			if(yearOptions.end - yearOptions.start ==0){
				html += "<option>" + yearOptions.start + "</option>"
			} else if(yearOptions.end - yearOptions.start ==1){
				html += "<option>" + yearOptions.start + "</option>"
				html += "<option>" + yearOptions.end + "</option>"
			} else {
				html += "<option value=''>Please select</option>"		
			}
			html += "<optgroup label='-------------------------'>";
			for(i=today.getFullYear();i>=1980;i--){
				html += "<option>" + i + "</option>"		
			}
			html += "</optgroup>";
						
			//update the select
			$(options.elements.year).html(html).enable();
			
			if($(options.elements.year).val()!=""){
				this.year($(options.elements.year).val());
			}
			
		}
		//*************************
		
		
		
		//*************************
		//create the object!
		this._modal_vehicleList();
		//*************************		

	}

}(jQuery));				
