//
//  GameServer.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 25/8/2023.
//

import Foundation

enum GameServer: Int, CaseIterable {
    case europe
    case north_america
    case asia

    static func stringList() -> [String] {
        return GameServer.allCases.map { $0.name }
    }
}

extension GameServer {
    var name: String {
        return "server_\(self)".localized
    }
}
