(function($) {

    $.ModalBasic = function(header,content) {
		
		
		
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
		this._modal_basic = function(header,content){
		
			var html,id
			
			id = this._generate_id();

			html =  '<div id="' + id + '" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
			html += '<div class="modal-dialog">';
			html += '<div class="modal-content">';
			html += '<div class="modal-header">';
			html += '<a class="close" data-dismiss="modal">×</a>';
			html += '<h4>'+header+'</h4>'
			html += '</div>';
			html += '<div class="modal-body">';
			html += content;
			html += '</div>';
			html += '<div class="modal-footer">';
			html += '<span class="btn btn-default" data-dismiss="modal">Close <i class="fa fa-times"></i></span>';
			html += '</div>';  // content
			html += '</div>';  // dialog
			html += '</div>';  // footer
			html += '</div>';  // modalWindow

			$('body').append(html);
			$("#" + id).modal();
			$("#" + id).modal('show');
						
			$('#' + id).on('hidden.bs.modal', function (e) {
				$(this).remove();
			});
		}
		//*************************


		//*************************
		//create the object!
		this._modal_basic(header,content);
		//*************************		

	}

}(jQuery));			