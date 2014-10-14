package com.techstorm.netcastdigital;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;

public class LinPhonePlugin extends CordovaPlugin {

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("callSip")) {
        	hangUp();
        	sip(String.format("sip:%s@%s", args.get(0), "cloud.netcastdigital.net"));
        	LinphoneManager.getInstance().routeAudioToSpeaker();
			LinphoneManager.getLc().enableSpeaker(true);
        	callbackContext.success("call sip");
            return true;
        } else if (action.equals("cancelSip")) {
        	hangUp();
        	callbackContext.success("cancel sip");
        	return true;
        }
        return false;
    }
	
	private void hangUp() {
		LinphoneCore lc = LinphoneManager.getLc();
		LinphoneCall currentCall = lc.getCurrentCall();
		
		if (currentCall != null) {
			lc.terminateCall(currentCall);
		} else if (lc.isInConference()) {
			lc.terminateConference();
		} else {
			lc.terminateAllCalls();
		}
	}
	
    private void sip(String address) {
		try {
			if (!LinphoneManager.getInstance().acceptCallIfIncomingPending()) {
				if (address.length() > 0) { 
					LinphoneManager.getInstance().newOutgoingCall(address);
				} else {
//					if (getContext().getResources().getBoolean(R.bool.call_last_log_if_adress_is_empty)) {
//						LinphoneCallLog[] logs = LinphoneManager.getLc().getCallLogs();
//						LinphoneCallLog log = null;
//						for (LinphoneCallLog l : logs) {
//							if (l.getDirection() == CallDirection.Outgoing) {
//								log = l;
//								break;
//							}
//						}
//						if (log == null) {
//							return;
//						}
//						
//						LinphoneProxyConfig lpc = LinphoneManager.getLc().getDefaultProxyConfig();
//						if (lpc != null && log.getTo().getDomain().equals(lpc.getDomain())) {
//							mAddress.setText(log.getTo().getUserName());
//						} else {
//							mAddress.setText(log.getTo().asStringUriOnly());
//						}
//						mAddress.setSelection(mAddress.getText().toString().length());
//						mAddress.setDisplayedName(log.getTo().getDisplayName());
//					}
				}
			}
		} catch (LinphoneCoreException e) {
			LinphoneManager.getInstance().terminateCall();
//			onWrongDestinationAddress();
		};
	}
    
}
