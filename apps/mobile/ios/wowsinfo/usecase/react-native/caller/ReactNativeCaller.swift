//
//  ReactNativeCaller.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 25/8/2023.
//

import React

enum RNFunctions: String, CaseIterable {
    case data_loading
}

/// Call methods in React Native
@objc(ReactNativeCaller)
class ReactNativeCaller: RCTEventEmitter {
    private var hasListener = false

    override func startObserving() {
        super.startObserving()
        hasListener = true
    }

    override func stopObserving() {
        super.stopObserving()
        hasListener = false
    }

    override func supportedEvents() -> [String]! {
        RNFunctions.allCases.map { $0.rawValue }
    }

    /// A wrapper for sendEvent(with name)
    func sendEvent(with function: RNFunctions, and body: Any? = nil) {
        if hasListener {
            sendEvent(withName: function.rawValue, body: body)
        }
    }
}
