package com.techstorm.netcastdigital;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneAddress.TransportType;

import com.techstorm.netcastdigital.LinphonePreferences.AccountBuilder;

public class LinPhonePlugin extends CordovaPlugin {

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("callSip")) {
        	sip(String.format("sip:%s@%s", args.get(0), Netcastdigital.SIP_DOMAIN));
        	LinphoneManager.getInstance().routeAudioToSpeaker();
			LinphoneManager.getLc().enableSpeaker(true);
        	callbackContext.success("call sip");
            return true;
        } else if (action.equals("cancelSip")) {
        	hangUp();
        	callbackContext.success("cancel sip");
        	return true;
        } else if (action.equals("registerSip")) {
        	String sipUsername = (String)args.get(0);
        	String password = (String)args.get(1);
        	logIn(sipUsername, password, Netcastdigital.SIP_DOMAIN, false);
        	callbackContext.success("register sip");
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
				}
			}
		} catch (LinphoneCoreException e) {
			LinphoneManager.getInstance().terminateCall();
		};
	}
    
    private void logIn(String username, String password, String domain, boolean sendEcCalibrationResult) {
//		InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
//		if (imm != null && getCurrentFocus() != null) {
//			imm.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
//		}

        saveCreatedAccount(username, password, domain);

		if (LinphoneManager.getLc().getDefaultProxyConfig() != null) {
//			launchEchoCancellerCalibration(sendEcCalibrationResult);
		}
	}
	
	public void saveCreatedAccount(String username, String password, String domain) {
//		if (accountCreated)
//			return;
		
		boolean isMainAccountLinphoneDotOrg = false;
		boolean useLinphoneDotOrgCustomPorts = false;
		AccountBuilder builder = new AccountBuilder(LinphoneManager.getLc())
		.setUsername(username)
		.setDomain(domain)
		.setPassword(password);
		
		if (isMainAccountLinphoneDotOrg && useLinphoneDotOrgCustomPorts) {
			boolean disable_all_security_features_for_markets = true;
			if (disable_all_security_features_for_markets) {
				builder.setProxy(domain + ":5228")
				.setTransport(TransportType.LinphoneTransportTcp);
			}
			else {
				builder.setProxy(domain + ":5223")
				.setTransport(TransportType.LinphoneTransportTls);
			}
			
			builder.setExpires("604800")
			.setOutboundProxyEnabled(true)
			.setAvpfEnabled(true)
			.setAvpfRRInterval(3)
			.setQualityReportingCollector("sip:voip-metrics@sip.linphone.org")
			.setQualityReportingEnabled(true)
			.setQualityReportingInterval(180)
			.setRealm("sip.linphone.org");
			
			
//			mPrefs.setStunServer(getString(R.string.default_stun));
//			mPrefs.setIceEnabled(true);
//			mPrefs.setPushNotificationEnabled(true);
		} else {
//			String forcedProxy = getResources().getString(R.string.setup_forced_proxy);
//			if (!TextUtils.isEmpty(forcedProxy)) {
//				builder.setProxy(forcedProxy)
//				.setOutboundProxyEnabled(true)
//				.setAvpfRRInterval(5);
//			}
		}
		
		try {
			builder.saveNewAccount();
//			accountCreated = true;
		} catch (LinphoneCoreException e) {
			e.printStackTrace();
		}
	}
    
}
