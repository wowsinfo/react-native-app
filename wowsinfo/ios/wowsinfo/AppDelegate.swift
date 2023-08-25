//
//  AppDelegate.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 23/8/2023.
//

import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate, RCTBridgeDelegate {

    // This is required or bottomSafeViewHeight from React-CoreModules/RCTRedBox.mm will complain
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
//        ReactNativeManager.shared.setup(with: self, and: launchOptions)
        QuickActionManager.shared.setDefaultActions()
        print(FileManager.default.urls(for: .documentDirectory, in: .userDomainMask))

        // show the main view
        let root = RootController()
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = root
        window?.makeKeyAndVisible()
        ReactNativeManager.shared.attach(rootViewController: root)

        return true
    }
    
    func application(_ application: UIApplication, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
        QuickActionManager.shared.performShortcut(shortcutItem: shortcutItem)
    }
    
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        ReactNativeManager.shared.jsBundleURL
    }
}
