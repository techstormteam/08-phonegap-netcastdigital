/*!
 Linphone Web - Web plugin of Linphone an audio/video SIP phone
 Copyright (c) 2013 Belledonne Communications
 All rights reserved.
 

 Authors:
 - Yann Diorcet <diorcet.yann@gmail.com>
 
 */

/*globals jQuery,linphone*/

linphone.ui.view.contact = {
	init: function(base) {
		linphone.ui.view.contact.uiInit(base);
	},
	uiInit: function(base) {
		base.find('> .content .view > .contact').data('linphoneweb-view', linphone.ui.view.contact);
		base.find('> .content .view > .contact .cancelContact').click(linphone.ui.exceptionHandler(base, function() {
			linphone.ui.view.hide(base,'contact');
		}));
		base.find('> .content .view > .contact .removeContact').click(linphone.ui.exceptionHandler(base, function(){
			linphone.ui.view.contact.remove(base);
		}));
		base.find('> .content .view > .contact .saveContact').click(linphone.ui.exceptionHandler(base, function(){
			linphone.ui.view.contact.save(base);
		}));
		base.find('> .content .view > .contact .uploadPhoto').hide();	
	},
	translate: function(base) {
		var contact = base.find('> .content .view > .contact');
		contact.find('.firstname').watermark(jQuery.i18n.translate('content.view.contact.firstname'), {className: 'watermark', useNative: false});
		contact.find('.lastname').watermark(jQuery.i18n.translate('content.view.contact.lastname'), {className: 'watermark', useNative: false});
		contact.find('.addressInput').watermark(jQuery.i18n.translate('content.view.contact.addressContact'), {className: 'watermark', useNative: false});
	},
	
	/**/
	show: function(base) {
		linphone.ui.menu.show(base);
		var contact = base.find('> .content .view > .contact');
	},
	hide: function(base) {
	},
	clear: function(base){
		var contact = base.find('> .content .view > .contact .entry');
		contact.find('.lastname').val('');
		contact.find('.firstname').val('');
		contact.find('.addressInput').val('');
		contact.find('.showPresence').prop('checked', false);
		contact.find('.allowPresence').prop('checked', false);
	},
	
	addContact: function(base){
		linphone.ui.view.contact.onSaveContact(base,null);
	},
	editContact: function(base,object){
		linphone.ui.view.contact.onSaveContact(base,object);
	},
	onSaveContact: function(base,friend){
		var contact = base.find('> .content .view > .contact .entry');	
		linphone.ui.view.contact.clear(base);
		
		var list = contact.find('.list');
		list.empty();
		
		//new account
		if(friend === null){
			base.find('> .content .view > .contact .removeContact').hide();
			contact.data('friend',null);
		//edit account
		} else {
			base.find('> .content .view > .contact .removeContact').show();
			contact.find('.firstname').val(friend.name);
			contact.find('.addressInput').val(friend.address.asStringUriOnly());
			contact.data('friend',friend);
			contact.find('.showPresence').prop('checked', friend.subscribesEnabled);
			if(friend.incSubscribePolicy  === linphone.SubscribePolicy.Accept){
				contact.find('.allowPresence').prop('checked',true);
			} else {
				contact.find('.allowPresence').prop('checked',false);
			}
			
		}
		contact.find('.contactImg').val('style/img/avatar.jpg');
		
		linphone.ui.view.show(base,'contact');
	},
	save: function(base) {
		var contact = base.find('> .content .view > .contact .entry');
		var configuration = linphone.ui.configuration(base);
        var core = linphone.ui.getCore(base);
		var addressVal = contact.find('.addressInput').val();
		var data = contact.data('friend');
		var name = contact.find('.firstname').val();
		var showPresence = false;
		var allowPresence = linphone.SubscribePolicy.Deny;
		var address;
		
		if(contact.find('.showPresence').is(':checked')){
			showPresence = true;
		}
		
		if(contact.find('.allowPresence').is(':checked')){
			allowPresence = linphone.SubscribePolicy.Accept;
		}

		if(addressVal !== ''){
			address = linphone.ui.utils.formatAddress(base,addressVal);
			if(name === ''){
				name = address.username;
			}
			if(address !== null){
				if (data !== null){
				//Edit contact
					configuration.models.contacts.update({
						friend : data,
						address : address,
						name : name,
						showPresence : showPresence,
						allowPresence : allowPresence
						
					});	
				} else {
				//Create contact
					configuration.models.contacts.create({
						address : address,
						name : name,
						showPresence : showPresence,
						allowPresence : allowPresence
					});	
				}
				linphone.ui.view.hide(base, 'contact');
				linphone.ui.view.show(base, 'contacts');
			} else {
				//linphone.ui.popup.error.show();
				linphone.ui.view.contact.onSaveContact(base,data);
			}
		}
	},
	remove: function(base){
        var contact = base.find('> .content .view > .contact .entry');
		var configuration = linphone.ui.configuration(base);
        var core = linphone.ui.getCore(base);
        var addressVal = contact.find('.addressInput').val();
        
        var address = linphone.ui.utils.formatAddress(base,addressVal);
		if(typeof address !== 'undefined') {
			var friend = core.getFriendByAddress(address.asString());
			configuration.models.contacts.remove(friend);	
		}
		linphone.ui.view.hide(base, 'contact');
		linphone.ui.view.show(base, 'contacts');
	}
};