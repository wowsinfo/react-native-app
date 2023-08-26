//
//  App.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 23/8/2023.
//

import SwiftUI

class RootViewController: UIHostingController<WoWsInfoView> {
    init() {
        super.init(rootView: WoWsInfoView())
    }
    
    required init?(coder aDecoder: NSCoder) {
        preconditionFailure("Coder is not used")
    }
}
