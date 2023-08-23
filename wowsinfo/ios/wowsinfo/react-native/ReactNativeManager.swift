//
//  ReactNativeManager.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 15/7/21.
//

import Foundation
import React

typealias ReactNativeDictionary = [NSObject: Any]

@objc(ReactNativeManager)
class ReactNativeManager: NSObject {
    
    // Singleton
    static let shared = ReactNativeManager()
    private override init() {
        super.init()
    }
    
    /// Setup the bridge so only one JSC VM is created to save resources and simplify the communication between RN views in different parts of your native app,
    /// you can have multiple views powered by React Native that are associated with a single JS runtime.
    private(set) var bridge: RCTBridge!
    // An instance of the root view controller
    private(set) weak var rootViewController: UIViewController?
    // From React Native side, to inform whether the Home Page is loaded
    var isLoaded: Bool = false
    
    private(set) lazy var jsBundleURL: URL! = {
    #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
    }()
    
    func setup(with delegate: RCTBridgeDelegate, and launchOptions: [AnyHashable: Any]?) {
        bridge = RCTBridge(delegate: delegate, launchOptions: launchOptions)
        
        /// https://stackoverflow.com/a/48903673, RCTBridge required dispatch_sync to load RCTDevLoadingView
        #if RCT_DEV
        bridge?.module(for: RCTDevLoadingView.self)
        #endif
    }
    
    func attach(rootViewController: UIViewController) {
        self.rootViewController = rootViewController
    }
    
    /// The wrapper of RCTRootView
    func getRCTRootView(with name: String, and props: ReactNativeDictionary? = nil) -> RCTRootView {
        RCTRootView(bridge: bridge, moduleName: name, initialProperties: props)
    }
    
    /// Get a RCTRootView and wrap it in a view controller
    func getRCTRootViewController(with name: String, and props: ReactNativeDictionary? = nil) -> UIViewController {
        let vc = UIViewController()
        vc.view = getRCTRootView(with: name, and: props)
        return vc
    }
    
    // React Native created a new instance so the shared one is not updated
    @objc func reactNativeHasLoaded() {
        ReactNativeManager.shared.isLoaded = true
    }
}
