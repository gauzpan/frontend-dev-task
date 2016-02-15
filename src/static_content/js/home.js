/**
 * @author: Gaurav Pandvia
 */ 

var taskModule = (function($,window,document){
	var apiEndPoints = {
		getMessages : "/api/message/",
		getParticularMsg : "/api/message/{id}",
		deleteMessage :"/api/message/{id}",
		bookmarkMessage:"/api/message/bookmark/{id}",
		markMessageRead:"/api/message/markRead/{id}"
	}

	var utils = {
		makeAjaxCall : function(options){
			$.ajax({
				type : options['type'],
				url : options['url'],
				beforeSend : options['beforeSend'],
				success : options['success'],
				error : options['error'],
				complete : options['complete']
			});
		},
		getMonthName : function(monthNo){
					var monthName = "";
					switch(monthNo){
					case 0 :
						monthName = "January";
						break;
					case 1 :
						monthName = "February";
						break;
					case 2 :
						monthName = "March";
						break;
					case 3 :
						monthName = "April";
						break;
					case 4 :
						monthName = "May";
						break;
					case 5 :
						monthName = "June";
						break;
					case 6 :
						monthName = "July";
						break;
					case 7 :
						monthName = "August";
						break;
					case 8 :
						monthName = "September";
						break;
					case 9 :
						monthName = "October";
						break;
					case 10 :
						monthName = "November";
						break;
					case 11 :
						monthName = "December";
						break;
					}
					return monthName;
				}
	} 
	/*
	 * function to get timestamp html of the message
	 */
	 function getTimestampText(ts){
	 	var dateTime = new Date(ts)

	 	var month = dateTime.getMonth(),
	 		date = dateTime.getDate(),
	 		hours = dateTime.getHours(),
	 		minutes = dateTime.getMinutes();

	 	var monthName = utils.getMonthName(month).substring(0,3);
	 	if(hours<10){
	 		hours = "0"+ hours.toLocaleString();
	 	}else{
	 		hours = hours.toLocaleString()
	 	}
	 	if(minutes<10){
	 		minutes = "0"+ minutes.toLocaleString();
	 	}else{
	 		minutes = minutes.toLocaleString()
	 	}

	 	var tsText = date.toLocaleString() + " " + monthName + "(" + hours +":" + minutes + ")";

	 	return tsText;
	 }
	/*
	* Function to fill the messages in the inbox
	*/
	function populateInbox(message,index){
		var $msgBox = $('.messageBox.template').clone();
		$msgBox.attr('id', message.id);
		$msgBox.find('a.deleteMsg').attr('msgId',message.id);
		$msgBox.find('a.bookmark').attr('msgId',message.id);
		$msgBox.removeClass('hidden template');
		$msgBox.find('.message--subject').text(message.subject);
		$msgBox.find('.message--preview').text(message.preview);
		var participantsText = "";
		for(var j=0;j<message.participants.length;j++){
			participantsText += message.participants[j] + ", ";
		}
		$msgBox.find('.message--participants span.participant').text(participantsText.substring(0,participantsText.length-2));
		$msgBox.find('span.timestamp').text(getTimestampText(message.ts));
		if(message.isRead){
			$msgBox.addClass('read');
		}
		if(message.isStarred){
			$msgBox.find('.bookmark').addClass('starred');
			$msgBox.find('.bookmark span').removeClass('fa-star-o').addClass('fa-star');
		}
		$('.app--container-body').append($msgBox);
	}
	/*
	 * Function to mark the message as read
	 */
	 function markMessageRead(id){
	 	var ajaxCallOptions = {
	 		type:"POST",
	 		url:apiEndPoints.markMessageRead.replace("{id}",id),
	 		beforeSend : function(){},
			success : function(response){
				
			},
			error:function(xhr){
				console.log(xhr.responseText);
			},
			complete : function(){}
	 	}
	 	utils.makeAjaxCall(ajaxCallOptions);
	 }
	/*
	 * Function to get full display of a message
	 */
	 function populateMessageBody(response,id){
		var $msgBody = $('.message--body');
		$msgBody.removeClass('hidden').slideDown();
		$msgBody.find('.message--body-subject span.subject').text(response.subject);
		var participantsText = "";
		for(var i=0;i<response.participants.length;i++){
			var participant = response.participants[i];
			participantsText += participant.name+' <'+participant.email+'>, ';
		}
		$msgBody.find('.message--body-subject span.subject').text(response.subject);
		$msgBody.find('.message--body-participant span.participantText').text(participantsText.substring(0,participantsText.length-2));
		$msgBody.find('.message--body-complete').text(response.body);
		$msgBody.find('span.timestamp').text(getTimestampText(response.ts));
		$msgBody.find('a.deleteMsg').attr('msgId',id);
		$msgBody.find('a.bookmark').attr('msgId',id);
		if(response.isStarred){
			$msgBody.find('.bookmark').addClass('starred');
			$msgBody.find('.bookmark span').removeClass('fa-star-o').addClass('fa-star');
		}
	}
	//Return Object which will contain the exported functions of module
	var taskObj = {};

	/*
	* Function to get list of messages 
	*/
	taskObj.getMessages = function(){

		var ajaxCallOptions = {
			type:"GET",
			url : apiEndPoints.getMessages,
			beforeSend: function(){
				$('#pageLoader').removeClass('hidden');
				$('.messageBox').addClass('hidden');
				$('.message--body').addClass('hidden');
			},
			success : function(res){
					
				for(var i =0 ; i<res.length; i++){
					populateInbox(res[i],i);
				}
			},
			error : function(xhr, textStatus, errorThrown){
				console.log(xhr.responseText);
				$('.app--container-body').append("<span> Something went wrong. Try again</span>");
			},
			complete : function(){
				$('#pageLoader').addClass('hidden');
			}
		};
		utils.makeAjaxCall(ajaxCallOptions);
	}
	/*
	* Function to delete a particular message on the basis of id
	*/
	taskObj.deleteMessage = function(id){
		var ajaxCallOptions = {
			type:"DELETE",
			url:apiEndPoints.deleteMessage.replace("{id}",id),
			beforeSend : function(){
				$('#deleteBtn').text("Deleting..");
			},
			success : function(){
				taskObj.getMessages();
			},
			error:function(xhr){
				console.log(xhr.responseText);
			},
			complete : function(){
				$('#deleteBtn').text("Delete");
			}
		}
		utils.makeAjaxCall(ajaxCallOptions);
	}
	/*
	 * Function to bookmark a message
	 */
	 taskObj.bookmarkMessage = function(element,id){
	 	var ajaxCallOptions = {
	 		type:"POST",
	 		url:apiEndPoints.bookmarkMessage.replace("{id}",id),
	 		beforeSend : function(){},
			success : function(response){
				if(element.hasClass('starred')){
					element.removeClass('starred');
					element.find('span').removeClass('fa-star').addClass('fa-star-o');
				}else{
				element.addClass('starred');
				element.find('span').removeClass('fa-star-o').addClass('fa-star');
				}
			},
			error:function(xhr){
				console.log(xhr.responseText);
			},
			complete : function(){}
	 	}
	 	utils.makeAjaxCall(ajaxCallOptions);
	 }

	 taskObj.getMessageBody = function(id){
	 	var readFlag = false;
	 	var ajaxCallOptions = {
	 		type:"GET",
	 		url:apiEndPoints.getParticularMsg.replace("{id}",id),
	 		beforeSend : function(){
	 			$('#pageLoader').removeClass('hidden');
				$('.messageBox').addClass('hidden');
				$('.message--body').addClass('hidden');
	 		},
			success : function(response){
				readFlag = true
				populateMessageBody(response,id);
			},
			error:function(xhr){
				console.log(xhr.responseText);
				$('.messageBox').removeClass('hidden');
			},
			complete : function(){
				$('#pageLoader').addClass('hidden');	
				if(readFlag){
					markMessageRead(id);
				}
			}
	 	}
	 	utils.makeAjaxCall(ajaxCallOptions);
	 }

	return taskObj
})(jQuery,window,document);

$(document).ready(function(){
	
	window.location.hash = "";

	taskModule.getMessages();

	$(document).on('click','a.deleteMsg',function(e){
		e.stopPropagation();
		$('#deleteModal #deleteBtn').attr('msgId',$(this).attr('msgId'));
		$('#deleteModal').modal();
	});

	$(document).on('click','#deleteBtn',function(){
		taskModule.deleteMessage($(this).attr('msgId'));
	});

	$(document).on('click','a.bookmark',function(e){
		e.stopPropagation();
		taskModule.bookmarkMessage($(this),$(this).attr('msgId'));
	});

	$(document).on('click','.messageBox:not(".template")',function(){
		window.location.hash = "inbox/message-"+$(this).attr('id')
		taskModule.getMessageBody($(this).attr('id'));
	});
	$(window).on('hashchange',function(){ 
   		 if(location.hash.slice(1) == ""){
   		 	taskModule.getMessages();
   		 }
   		 if(location.hash.slice(1).indexOf('message') > -1 ){
   		 	var msgId = window.location.hash.split('-')[1]
   		 	taskModule.getMessageBody(msgId);
   		 }
	});
	
})