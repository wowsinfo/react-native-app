//
//  ReactNativeEvent.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 27/8/2023.
//

import React

private enum SupportedEvent: String, CaseIterable {
    case dummy
}

/// This class is initialised from React Native, let's get the instance and save it in shared
@objc(ReactNativeEvent)
class ReactNativeEvent: RCTEventEmitter {
    public static var shared: ReactNativeEvent!
    
    override init() {
      super.init()
        ReactNativeEvent.shared = self
    }
    
    private let allEvents = SupportedEvent.allCases.map { $0.rawValue }
    
    override func supportedEvents() -> [String]! {
        allEvents
    }
    
    func dummy() {
        send(eventType: .dummy)
    }
    
    private func send(eventType event: SupportedEvent, body: Any? = nil) {
        sendEvent(withName: event.rawValue, body: body)
    }
}
