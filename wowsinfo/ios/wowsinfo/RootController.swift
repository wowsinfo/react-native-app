//
//  App.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 23/8/2023.
//

import SwiftUI

class RootController: UIHostingController<WoWsInfoView> {
    init() {
        super.init(rootView: WoWsInfoView())
    }
    
    required init?(coder aDecoder: NSCoder) {
        preconditionFailure("Coder is not used")
    }
}

struct WoWsInfoView: View {
    var body: some View {
        NavigationView {
            ReactNativeApp()
        }
    }
}

struct ReactNativeApp: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        return ReactNativeManager.shared.getRCTRootView(with: "wowsinfo")
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        //
    }
}
