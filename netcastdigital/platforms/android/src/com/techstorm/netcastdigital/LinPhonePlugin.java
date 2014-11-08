package com.techstorm.netcastdigital;

import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneAuthInfo;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCore.RegistrationState;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneProxyConfig;

import com.techstorm.netcastdigital.LinphonePreferences.AccountBuilder;

public class LinPhonePlugin extends CordovaPlugin {

	public static String NOT_REGISTERED = "NOT-REGISTERED";
	public static String REGISTERED = "REGISTERED";
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("callSip")) {
        	String callTo = (String) args.get(0);
        	String sipUsername = (String) args.get(1);
			String password = (String) args.get(2);
			String domain = Netcastdigital.SIP_DOMAIN;
			registerSip(sipUsername, password, domain);
        	sip(String.format("sip:%s@%s", callTo, Netcastdigital.SIP_DOMAIN));
        	LinphoneManager.getInstance().routeAudioToSpeaker();
			LinphoneManager.getLc().enableSpeaker(true);
        	callbackContext.success("call sip");
            return true;
        } else if (action.equals("cancelSip")) {
        	String sipUsername = (String) args.get(0);
        	String domain = Netcastdigital.SIP_DOMAIN;
        	hangUp();
        	signOut(sipUsername, domain);
        	callbackContext.success("cancel sip");
        	return true;
        } else if (action.equals("registerSip")) {
			String sipUsername = (String) args.get(0);
			String password = (String) args.get(1);
			String domain = Netcastdigital.SIP_DOMAIN;
			registerSip(sipUsername, password, domain);
			PluginResult result = new PluginResult(Status.OK);
			callbackContext.sendPluginResult(result);
        	return true;
        } else if (action.equals("backWind")) {
        	dialDtmf('4');
        	callbackContext.success("back wind");
        	return true;
        } else if (action.equals("forwardWind")) {
        	dialDtmf('6');
        	return true;
        } else if (action.equals("pauseSip")) {
        	dialDtmf('#');
        	callbackContext.success("pause sip");
        	return true;
        } else if (action.equals("signOut")) {
        	String sipUsername = (String) args.get(0);
			String domain = Netcastdigital.SIP_DOMAIN;
			signOut(sipUsername, domain);
			callbackContext.success("Sign out successful.");
			return true;
        }
        return false;
    }
	
	private void registerSip(String sipUsername, String password, String domain) {
		String sipAddress = sipUsername + "@" + domain;
		
		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();
		
		if (lc.isNetworkReachable()) {
			signOut(sipUsername, domain);
			
			// Get account index.
			int nbAccounts = LinphonePreferences.instance().getAccountCount();
			List<Integer> accountIndexes = findAuthIndexOf(sipAddress);
			
			
			if (accountIndexes == null || accountIndexes.isEmpty()) { // User haven't registered in linphone
				logIn(sipUsername, password, domain, false);
				lc.refreshRegisters();
				accountIndexes.add(nbAccounts);
			}
			
			for (Integer accountIndex : accountIndexes) {
				if (LinphonePreferences.instance().getDefaultAccountIndex() != accountIndex) {
					LinphonePreferences.instance().setDefaultAccount(accountIndex);
					LinphonePreferences.instance().setAccountEnabled(accountIndex, true);
					lc.setDefaultProxyConfig((LinphoneProxyConfig) LinphoneManager.getLc().getProxyConfigList()[accountIndex]);
					lc.refreshRegisters();
				} else {
					if (lc != null && lc.getDefaultProxyConfig() != null) {
						if (RegistrationState.RegistrationOk == LinphoneManager.getLc().getDefaultProxyConfig().getState()) {
							//empty
						} else if (RegistrationState.RegistrationFailed == LinphoneManager.getLc().getDefaultProxyConfig().getState()
								|| RegistrationState.RegistrationNone == LinphoneManager.getLc().getDefaultProxyConfig().getState()) {
							LinphonePreferences.instance().setAccountEnabled(accountIndex, true);
							lc.refreshRegisters();
						}
					}
				}
			}
		}
	}
	
	private List<Integer> findAuthIndexOf(String sipAddress) {
		int nbAccounts = LinphonePreferences.instance().getAccountCount();
		List<Integer> indexes = new ArrayList<Integer>();
		for (int index = 0; index < nbAccounts; index++)
		{
			String accountUsername = LinphonePreferences.instance().getAccountUsername(index);
			String accountDomain = LinphonePreferences.instance().getAccountDomain(index);
			String identity = accountUsername + "@" + accountDomain;
			if (identity.equals(sipAddress)) {
				indexes.add(index);
			}
		}
		return indexes;
	}
	
	private void signOut(String sipUsername, String domain) {
		if (LinphoneManager.isInstanciated()) {
			LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();
			
			String sipAddress = sipUsername + "@" + domain;
			List<Integer> accountIndexes = findAuthIndexOf(sipAddress);
			for (Integer accountIndex : accountIndexes) {
				LinphonePreferences.instance().setAccountEnabled(accountIndex, false);
				LinphoneProxyConfig proxyCfg = lc.getProxyConfigList()[accountIndex];
				lc.removeProxyConfig(proxyCfg);
			}
			
			LinphoneAuthInfo authInfo = lc.findAuthInfo(sipUsername, null, domain);
			if (authInfo != null) {
				lc.removeAuthInfo(authInfo);
			}
			lc.refreshRegisters();
			
		}
	}
	
	private void dialDtmf(char keyCode) {
		LinphoneCore lc = LinphoneManager.getLc();
		lc.stopDtmf();
		if (lc.isIncall()) {
			lc.sendDtmf(keyCode);
		}
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
