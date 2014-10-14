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

import org.apache.cordova.CordovaActivity;
import org.linphone.core.LinphoneAddress.TransportType;
import org.linphone.core.LinphoneCore;
import org.linphone.core.LinphoneCoreException;
import org.linphone.core.PayloadType;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

import com.techstorm.netcastdigital.LinphonePreferences.AccountBuilder;

public class Netcastdigital extends CordovaActivity {
	
	public static String SIP_DOMAIN;
	public static String SIP_USERNAME;
	public static String SIP_PASSWORD;
	private Handler mHandler;
	private ServiceWaitThread mThread;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Set by <content src="index.html" /> in config.xml
		loadUrl(launchUrl);
		
		SIP_DOMAIN = getResources().getString(R.string.sip_domain);
		SIP_USERNAME = getResources().getString(R.string.sip_username);
		SIP_PASSWORD = getResources().getString(R.string.sip_password);
		
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
		
		LinphoneService.instance().setActivityToLaunchOnIncomingReceived(Netcastdigital.class);
		mHandler.postDelayed(new Runnable() {
			@Override
			public void run() {
				try {
					enableAllAudioCodecs();
					logIn(SIP_USERNAME, SIP_PASSWORD, SIP_DOMAIN, false);
				} catch (LinphoneCoreException e) {
					e.printStackTrace();
				}
			}
		}, 1000);
	}


	private void enableAllAudioCodecs() throws LinphoneCoreException {
		LinphoneCore lc = LinphoneManager.getLcIfManagerNotDestroyedOrNull();
		for (final PayloadType pt : lc.getAudioCodecs()) {
			LinphoneManager.getLcIfManagerNotDestroyedOrNull().enablePayloadType(pt, true);
		}
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
	
	
}
