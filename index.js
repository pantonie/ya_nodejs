var MyForm = new Object();

MyForm.validate = function () {	
	var fio = $('#fio').val();
	var email = $('#email').val();
	var phone = $('#phone').val();	
	
	var emailre = /^[a-zA-z0-9.!#$%&'*+/=?^_`{|}~-]+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/;
	var phonere = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/m;

	var checkResult = {isValid: false, errorFields: []};
	var phoneSum = phone_sum(phone);

	function check_input(state, field){		
		if (state) {
			$('#'+field).removeClass('error');
		} else {
			$('#'+field).addClass('error');
			checkResult.errorFields.push(field);
		}
	}

	check_input(fio.split(' ').length == 3, 'fio');
	check_input(emailre.test(email), 'email');
	check_input(phonere.test(phone) && phone_sum(phone) <=30, 'phone');
	
	if (checkResult.errorFields.length < 1) {
		checkResult.isValid = true;		
	}	
	return checkResult;

}

MyForm.getData = function() {
	var form = {};
	form.fio = $('#fio').val();
	form.email = $('#email').val();
	form.phone = $('#phone').val();	
	return form;
}

MyForm.setData = function (data) {
	$('#fio').val(data.fio);
	$('#email').val(data.email);
	$('#phone').val(data.phone);		
}

MyForm.submit = function() {	
	function addMessage(pClass, message, divClass){
		$('#resultContainer').attr('class', divClass); 
		$('#resultContainer').html('');
		$('#resultContainer').append('<p class="'+pClass+'">'+message+'</p>');		
 	}
	function request (url){		
		$.ajax({
			type: "get",
			url: url,
			dataType: "jsonp",
			success: function(data){
				data = JSON.parse(data);
				$('#submitButton').prop('disabled', true);
				if (data.status == 'progress'){
					addMessage('bg-warning', 'In progress. Timeout:' + data.timeout, data.status)										
					setTimeout(function () {request(url)}, parseInt(data.timeout));
				}
				if (data.status == 'error'){
					addMessage('bg-danger', data.reason, data.status);
				}
				if (data.status == 'success'){
					addMessage('bg-success','Success', data.status);
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
                console.log(arguments);
            }
		})
	}
	var path = $('#myForm').attr('action');	
	var result = MyForm.validate();	
	if (result.isValid){
		request(path);
	}
}

function phone_sum(number){		
	var phone = number.replace(/[\+|\(|\)|\-]/g,'');
	var sum = 0;
	for (var i=0; i<phone.length; i++){
		sum += parseInt(phone[i]);
	}	
	return sum;
}

$("#myForm").on('submit', function(e){	
	e.preventDefault();
	MyForm.submit();
	return true;
})