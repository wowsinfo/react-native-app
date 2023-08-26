//
//  WoWsInfoView.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 26/8/2023.
//

import SwiftUI

/// The wrapper of the React Native app
struct WoWsInfoView: View {
    var body: some View {
        ReactNativeApp().ignoresSafeArea()
    }
}

private struct ReactNativeApp: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        return ReactNativeManager.shared.getRCTRootView(with: "wowsinfo")
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {
        //
    }
}
