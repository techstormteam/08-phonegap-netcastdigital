/*!
 Linphone Web - Web plugin of Linphone an audio/video SIP phone
 Copyright (c) 2013 Belledonne Communications
 All rights reserved.
 

 Authors:
 - Yann Diorcet <diorcet.yann@gmail.com>
 
 */

/*globals jQuery,linphone*/

linphone.ui.view.plugin = {
	init: function(base) {
		linphone.ui.view.plugin.uiInit(base);
	},
	uiInit: function(base) {
		base.find('> .content .view > .plugin').data('linphoneweb-view', linphone.ui.view.plugin);
		base.find('> .content .view > .plugin .reload').click(linphone.ui.exceptionHandler(base, function(){
			linphone.ui.core.reload(base);
		}));
		base.find('> .content .view > .plugin .download').click(linphone.ui.exceptionHandler(base, function(){
			linphone.ui.view.plugin.download(base);
			linphone.ui.view.show(base, 'install');
		}));	
	},
	translate: function(base) {
		
	},
	
	/* */
	show: function(base, ret) {
		linphone.ui.menu.hide(base);
		if(typeof ret === 'undefined' || ret === null) {
			return;
		}
			
		var config = linphone.ui.configuration(base);
		var plugin = base.find('> .content .view > .plugin');
		var link = plugin.find('.link');
		var elem;
		plugin.find('.action .download').hide();
		plugin.find('.action .reload').hide();
		
		if (navigator.userAgent.match(/Android/i)){
			//Create a link to donwload the application in GooglePlay	
			link.empty(); 
			elem = linphone.ui.template(base, 'view.plugin.link', config.appLinks.android);
			link.append(elem);
			jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.mobile_application');
			return;
		}
		
		if ((/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()))){
            //Create a link to donwload the application in apple store	
			link.empty(); 
			elem = linphone.ui.template(base, 'view.plugin.link', config.appLinks.iOS);
			link.append(elem);
			jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.mobile_application');
			return;
        }
        
       if (navigator.userAgent.match(/Windows Phone/i) || 
       navigator.userAgent.match(/ZuneWP7/i)){
			//Create a link to donwload the application in microsoft store		
			link.empty(); 
			elem = linphone.ui.template(base, 'view.plugin.link', config.appLinks.windows_phone);
			link.append(elem);
			jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.mobile_application');
			return;
		}
		plugin.find('.action .reload').show();
		switch(ret) {
			case linphone.ui.core.detectionStatus.Outdated:
				if (config.file.browser === 'Explorer') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.outdated_auto');
				} else if (config.file.browser === 'Firefox') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.outdated_auto');
				} else if (config.file.browser === 'Chrome') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.outdated_auto');
				} else {
					plugin.find('.action .download').show();
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.outdated_download');
				}
			break;
			case linphone.ui.core.detectionStatus.NotInstalled:
				if (config.file.browser === 'Explorer') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.auto_or_update');
				} else if (config.file.browser === 'Firefox') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.auto');
				} else if (config.file.browser === 'Chrome') {
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.auto');
				} else {
					plugin.find('.action .download').show();
					jQuery.i18n.set(plugin.find('> .text'), 'content.view.plugin.text.download');
				} 
			break;
			default:
				linphone.ui.error(base, 'errors.exception.unhandled');
		}
	},
	hide: function(base) {
	},
	
	/**/
	download: function(base) {
		var config = linphone.ui.configuration(base);
		window.location.href = config.file.description;
	}
};