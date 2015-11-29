/*function changeContent() {
    $('#menu').load('common/menu.html');
}

function toggleLogout() {
	if($('#uname').val() == null)
		 $('#menu').find('#logoutLink').css("visibility","hidden");
	else
		$('#menu').find('#logoutLink').css("visibility","visible");
}*/


$(document).ready(function(){	
	$("#saveBtn").hide();
	
	$("#editBtn").click(function(){
		$(".makeEditable").removeAttr("disabled");
		$("#editBtn").hide();
		$("#saveBtn").show();
	});
	
	$("#saveBtn").click(function(){
		$("#updateProfileForm").submit();
	});		
});




/*$('.BSswitch').bootstrapSwitch('state', true);


$('#CheckBoxValue').text($("#TheCheckBox").bootstrapSwitch('state'));

$('#TheCheckBox').on('switchChange.bootstrapSwitch', function () {

    $("#CheckBoxValue").text($('#TheCheckBox').bootstrapSwitch('state'));
});
*/
