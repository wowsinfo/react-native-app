//
//  SimpleViewHandler.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 27/8/2023.
//

import React
import SafariServices

/// Handle view related requests from React Native which are simple to implement
@objc(SimpleViewHandler)
class SimpleViewHandler: NSObject, RCTBridgeModule {
    @objc func showSafariViewController(_ link: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        guard let url = URL(string: link),
              let rootController = ReactNativeManager.shared.rootViewController else {
            resolver(false)
            return
        }

        let safari = SFSafariViewController(url: url)
        DispatchQueue.main.async {
            rootController.present(safari, animated: true)
        }
        resolver(true)
    }
    
    static func moduleName() -> String! {
        "SimpleViewHandler"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        true
    }
}
