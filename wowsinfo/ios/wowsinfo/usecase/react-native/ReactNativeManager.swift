import Foundation
import React

typealias ReactNativeDictionary = [NSObject: Any]

class ReactNativeManager {
    static let shared = ReactNativeManager()
    private init() {}

    private(set) var bridge: RCTBridge!
    private(set) var rootViewController: UIViewController?
    var isLoaded: Bool = false

    lazy var jsBundleURL: URL! = {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }()

    func setup(with delegate: RCTBridgeDelegate, and launchOptions: [AnyHashable: Any]?) {
        bridge = RCTBridge(delegate: delegate, launchOptions: launchOptions)
    }

    func set(rootViewController: UIViewController) {
        self.rootViewController = rootViewController
    }

    func getRCTRootView(with name: String, and props: ReactNativeDictionary? = nil) -> RCTRootView {
        RCTRootView(bridge: bridge, moduleName: name, initialProperties: props)
    }
}
