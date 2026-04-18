//
//  App.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 23/8/2023.
//

import SwiftUI

private class SwiftUIViewController: UIHostingController<WoWsInfoView> {
    init() {
        super.init(rootView: WoWsInfoView())
    }
    
    required init?(coder aDecoder: NSCoder) {
        preconditionFailure("Coder is not used")
    }
}

enum RootViewControllerMode {
    case swiftui
    case uikit
}

class RootViewController {
    static func create(withMode mode: RootViewControllerMode = .uikit) -> UIViewController {
        switch mode {
        case .swiftui:
            return SwiftUIViewController()
        case .uikit:
            return ReactNativeManager.shared.getRCTRootViewController(with: "wowsinfo")
        }
    }
    
    private init() {}
}
