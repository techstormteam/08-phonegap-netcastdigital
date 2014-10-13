/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.techstorm.netcastdigital;

import static android.content.Intent.ACTION_MAIN;

import java.nio.ByteBuffer;

import org.apache.cordova.CordovaActivity;
import org.linphone.core.LinphoneAddress;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneCall;
import org.linphone.core.LinphoneCall.State;
import org.linphone.core.LinphoneCallStats;
import org.linphone.core.LinphoneChatMessage;
import org.linphone.core.LinphoneChatRoom;
import org.linphone.core.LinphoneContent;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCore.EcCalibratorStatus;
import org.linphone.core.LinphoneCore.GlobalState;
import org.linphone.core.LinphoneCore.RegistrationState;
import org.linphone.core.LinphoneCore.RemoteProvisioningState;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.LinphoneCoreListener;
import org.linphone.core.LinphoneEvent;
import org.linphone.core.LinphoneFriend;
import org.linphone.core.LinphoneInfoMessage;
import org.linphone.core.LinphoneProxyConfig;
import org.linphone.core.PublishState;
import org.linphone.core.SubscriptionState;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.techstorm.netcastdigital.LinphonePreferences.AccountBuilder;

public class Netcastdigital extends CordovaActivity implements LinphoneCoreListener {
	
	
	private Handler mHandler;
	private ServiceWaitThread mThread;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Set by <content src="index.html" /> in config.xml
		loadUrl(launchUrl);
		
		mHandler = new Handler();
		
		if (LinphoneService.isReady()) {
			onServiceReady();
		} else {
			// start linphone as background  
			startService(new Intent(ACTION_MAIN).setClass(this, LinphoneService.class));
			mThread = new ServiceWaitThread();
			mThread.start();
		}
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
		
		boolean isMainAccountLinphoneDotOrg = domain.equals(getString(R.string.default_domain));
		boolean useLinphoneDotOrgCustomPorts = false;
		AccountBuilder builder = new AccountBuilder(LinphoneManager.getLc())
		.setUsername(username)
		.setDomain(domain)
		.setPassword(password);
		
		if (isMainAccountLinphoneDotOrg && useLinphoneDotOrgCustomPorts) {
			if (getResources().getBoolean(R.bool.disable_all_security_features_for_markets)) {
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
		
		if (getResources().getBoolean(R.bool.enable_push_id)) {
//			String regId = mPrefs.getPushNotificationRegistrationID();
			String regId = "1";
			String appId = getString(R.string.push_sender_id);
			if (regId != null /*&& mPrefs.isPushNotificationEnabled()*/) {
				String contactInfos = "app-id=" + appId + ";pn-type=google;pn-tok=" + regId;
				builder.setContactParameters(contactInfos);
			}
		}
		
		try {
			builder.saveNewAccount();
//			accountCreated = true;
		} catch (LinphoneCoreException e) {
			e.printStackTrace();
		}
	}
	
	protected void onServiceReady() {
		final Class<? extends Activity> classToStart;
//		if (getResources().getBoolean(R.bool.show_tutorials_instead_of_app)) {
//			classToStart = TutorialLauncherActivity.class;
//		} else if (getResources().getBoolean(R.bool.display_sms_remote_provisioning_activity) && LinphonePreferences.instance().isFirstRemoteProvisioning()) {
//			classToStart = RemoteProvisioningActivity.class;
//		} else {
//			classToStart = LinphoneActivity.class;
//		}
		
//		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(classToStart);
		mHandler.postDelayed(new Runnable() {
			@Override
			public void run() {
				logIn("thienau", "thien8776941", "sip.linphone.org", false);
				sip(String.format("%s@%s", "sip:playMessage-1-24612-244", getResources().getString(R.string.sip_domain)));
			}
		}, 1000);
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
	
	private class ServiceWaitThread extends Thread {
		public void run() {
			while (!LinphoneService.isReady()) {
				try {
					sleep(30);
				} catch (InterruptedException e) {
					throw new RuntimeException("waiting thread sleep() has been interrupted");
				}
			}

			mHandler.post(new Runnable() {
				@Override
				public void run() {
					onServiceReady();
				}
			});
			mThread = null;
		}
	}
	
	@Override
	public void authInfoRequested(LinphoneCore lc, String realm,
			String username, String Domain) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void globalState(LinphoneCore lc, GlobalState state, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void callState(LinphoneCore lc, LinphoneCall call, State cstate,
			String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void callStatsUpdated(LinphoneCore lc, LinphoneCall call,
			LinphoneCallStats stats) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void callEncryptionChanged(LinphoneCore lc, LinphoneCall call,
			boolean encrypted, String authenticationToken) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void registrationState(LinphoneCore lc, LinphoneProxyConfig cfg,
			RegistrationState cstate, String smessage) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void newSubscriptionRequest(LinphoneCore lc, LinphoneFriend lf,
			String url) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void notifyPresenceReceived(LinphoneCore lc, LinphoneFriend lf) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void textReceived(LinphoneCore lc, LinphoneChatRoom cr,
			LinphoneAddress from, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void messageReceived(LinphoneCore lc, LinphoneChatRoom cr,
			LinphoneChatMessage message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void isComposingReceived(LinphoneCore lc, LinphoneChatRoom cr) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void dtmfReceived(LinphoneCore lc, LinphoneCall call, int dtmf) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void ecCalibrationStatus(LinphoneCore lc, EcCalibratorStatus status,
			int delay_ms, Object data) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void notifyReceived(LinphoneCore lc, LinphoneCall call,
			LinphoneAddress from, byte[] event) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void transferState(LinphoneCore lc, LinphoneCall call,
			State new_call_state) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void infoReceived(LinphoneCore lc, LinphoneCall call,
			LinphoneInfoMessage info) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void subscriptionStateChanged(LinphoneCore lc, LinphoneEvent ev,
			SubscriptionState state) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void notifyReceived(LinphoneCore lc, LinphoneEvent ev,
			String eventName, LinphoneContent content) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void publishStateChanged(LinphoneCore lc, LinphoneEvent ev,
			PublishState state) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void configuringStatus(LinphoneCore lc,
			RemoteProvisioningState state, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void show(LinphoneCore lc) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void displayStatus(LinphoneCore lc, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void displayMessage(LinphoneCore lc, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void displayWarning(LinphoneCore lc, String message) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void fileTransferProgressIndication(LinphoneCore lc,
			LinphoneChatMessage message, LinphoneContent content, int progress) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void fileTransferRecv(LinphoneCore lc, LinphoneChatMessage message,
			LinphoneContent content, byte[] buffer, int size) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public int fileTransferSend(LinphoneCore lc, LinphoneChatMessage message,
			LinphoneContent content, ByteBuffer buffer, int size) {
		// TODO Auto-generated method stub
		return 0;
	}
}
