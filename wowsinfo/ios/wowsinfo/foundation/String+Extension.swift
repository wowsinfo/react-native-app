//
//  String+Extension.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 25/8/2023.
//

import Foundation

extension String {
    var localized: String {
        let result = NSLocalizedString(self, comment: "")
        if result == self {
            assertionFailure("\(self) is not a valid key")
        }
        return result
    }
}
