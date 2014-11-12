//
//  LinPhonePlugin.h
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//


#import <Cordova/CDV.h>

@interface LinPhonePlugin : CDVPlugin

- (void) callSip:(CDVInvokedUrlCommand *)command;

- (void) signOut:(CDVInvokedUrlCommand *)command;

@end