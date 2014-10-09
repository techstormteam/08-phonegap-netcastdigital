/*!
 Linphone Web - Web plugin of Linphone an audio/video SIP phone
 Copyright (c) 2013 Belledonne Communications
 All rights reserved.
 

 Authors:
 - Yann Diorcet <diorcet.yann@gmail.com>
 
 */

/*globals jQuery,linphone*/

linphone.ui.menu = {
	init: function(base) {
		linphone.ui.menu.uiInit(base);
	},
	uiInit: function(base) {
		linphone.ui.menu.hide(base);
		
		// Disable menu element selection
		base.find('> .content .menu ul li').disableSelection();
		
		base.find('> .content .menu .history').click(linphone.ui.exceptionHandler(base, function() {
			base.find('> .content .menu .history').addClass('active');
			base.find('> .content .menu .contacts').removeClass('active');
			linphone.ui.view.show(base, 'history');
		}));
		
		base.find('> .content .menu .contacts').click(linphone.ui.exceptionHandler(base, function() {
			base.find('> .content .menu .contacts').addClass('active');
			base.find('> .content .menu .history').removeClass('active');
			linphone.ui.view.show(base, 'contacts');
		}));
		
		var list = base.find('> .content .menu .chat .list');
		list.append(linphone.ui.template(base, 'menu.chat.list.entry', {
			name: 'Cunégonde',
			unreadMessage: 0
		}));
		list.append(linphone.ui.template(base, 'menu.chat.list.entry', {
			name: 'Roger',
			unreadMessage: 21
		}));
		
		// Must refresh mouse events
		base.find('> .content .menu .list .entry').mouseover(linphone.ui.exceptionHandler(base, function() {
			jQuery(this).append('<span class="closeContact"></span>');
		}));
		
		base.find('> .content .menu .list .entry').mouseleave(linphone.ui.exceptionHandler(base, function() {
			jQuery(this).find('.closeContact').remove();
		}));
		
		base.find('> .content .menu .chat .entry').click(linphone.ui.exceptionHandler(base, function() {
			linphone.ui.view.show(base, 'chat');
		}));
		
		if(linphone.ui.configuration(base).disableChat) {
			base.find('> .content .menu .chat').hide();
		}
	},
	translate: function(base) {
		
	},
	
	/* */
	show: function(base) {
		base.on('callStateChanged', linphone.ui.menu.onCallStateChanged);
		linphone.ui.menu.update(base);
		
		base.find('> .content .menu').show();
		if(!linphone.ui.view.top(base).hasClass("history") && !linphone.ui.view.top(base).hasClass("contacts")){
			base.find('> .content .menu .contacts').removeClass('active');
			base.find('> .content .menu .history').removeClass('active');
		}
		base.find('> .content .menu .scroll-pane').each(function(){
			linphone.ui.slider(jQuery(this));
		});
	},
	hide: function(base) {
		base.off('callStateChanged', linphone.ui.menu.onCallStateChanged);
		base.find('> .content .menu').hide();
	},
	
	update: function(base) {
		var list = base.find('> .content .menu .calls .list');
		var core = linphone.ui.getCore(base);
		list.empty();
		var calls = core.calls;
		
		var clickFunction = function(base, call) {
			return function() {
				if(linphone.ui.view.show(base,'call',call) === false) {
					linphone.ui.view.call.update(base,call);
				}
			};
		};
		
		var enterFunction = function() {
			var that = jQuery(this);
			that.removeClass('highlighted');
			that.addClass('hover');
		};
		
		var leaveFunction = function() {
			var that = jQuery(this);
			that.removeClass('hover');
			that.addClass('highlighted');
		};
		
		var updateName = function(error, contact) {
			if(contact) {
				var name = linphone.ui.utils.getContactName(base, contact);
				element.find('.name').text(name);
			}
		};
		
		if(typeof calls !== 'undifined'){
			for(var i = 0; i < calls.length; ++i) {
				var call = calls[i];
				var element = linphone.ui.template(base, 'menu.calls.list.entry', call);
				element.click(linphone.ui.exceptionHandler(base, clickFunction(base, call)));
				
				linphone.ui.utils.getContact(base, call.remoteAddress, updateName);
				
				list.append(element);
				
				// Append animation
				if(call === core.currentCall) {
					element.removeClass('hover');
					element.addClass('highlighted');
					element.mouseenter(enterFunction);
					element.mouseleave(leaveFunction);
				}
			}
		}
		
		list.tooltip({
			tooltipClass: "linphonewebcls",
			position: { my: "middle top+5", at: "middle bottom", collision: "flipfit" }
		});
	},

	/* Events */
	onCallStateChanged: function(event, call, state, message) {
		var base = jQuery(this);
		linphone.ui.menu.update(base);
	},
	
	getCallStateClass: function(base, object) {
		if(object === linphone.CallState.Idle || object === linphone.CallState.OutgoingInit || object === linphone.CallState.OutgoingProgress) {
			return 'idle';
		}
		if(object === linphone.CallState.PausedByRemote || object === linphone.CallState.Paused){
			return 'pause';
		} 
		if(object === linphone.CallState.IncomingReceived || object === linphone.CallState.OutgoingRinging){
			return 'ringing';
		}
		return 'play';
	}
};