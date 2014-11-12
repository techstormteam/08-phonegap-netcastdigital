//
//  LinPhonePlugin.m
//  Netcastdigital
//
//  Created by Macbook air on 11/11/14.
//
//

#import "LinPhonePlugin.h"

@implementation LinPhonePlugin

- (void) callSip:(CDVInvokedUrlCommand *)command {
    
    NSString *s = @"";
    
    // Retrieve the date String from the file via a utility method
//    NSString *dateStr = [self getFileContents];
//    
//    // Create an object that will be serialized into a JSON object.
//    // This object contains the date String contents and a success property.
//    NSDictionary *jsonObj = [ [NSDictionary alloc]
//                             initWithObjectsAndKeys :
//                             dateStr, @"dateStr",
//                             @"true", @"success",
//                             nil
//                             ];
    
    // Create an instance of CDVPluginResult, with an OK status code.
    // Set the return message as the Dictionary object (jsonObj)...
    // ... to be serialized as JSON in the browser
//    CDVPluginResult *pluginResult = [ CDVPluginResult
//                                     resultWithStatus    : CDVCommandStatus_OK
//                                     messageAsDictionary : jsonObj
//                                     ];
    
    // Execute sendPluginResult on this plugin's commandDelegate, passing in the ...
    // ... instance of CDVPluginResult
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) signOut:(CDVInvokedUrlCommand *)command {
    
    NSString *s = @"";
    // Retrieve the date String from the file via a utility method
//    NSString *dateStr = [self getFileContents];
//    
//    // Create an object that will be serialized into a JSON object.
//    // This object contains the date String contents and a success property.
//    NSDictionary *jsonObj = [ [NSDictionary alloc]
//                             initWithObjectsAndKeys :
//                             dateStr, @"dateStr",
//                             @"true", @"success",
//                             nil
//                             ];
    
    // Create an instance of CDVPluginResult, with an OK status code.
    // Set the return message as the Dictionary object (jsonObj)...
    // ... to be serialized as JSON in the browser
//    CDVPluginResult *pluginResult = [ CDVPluginResult
//                                     resultWithStatus    : CDVCommandStatus_OK
//                                     messageAsDictionary : jsonObj
//                                     ];
    
    // Execute sendPluginResult on this plugin's commandDelegate, passing in the ...
    // ... instance of CDVPluginResult
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end