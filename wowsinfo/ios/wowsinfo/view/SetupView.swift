//
//  SetupView.swift
//  wowsinfo
//
//  Created by Yiheng Quan on 25/8/2023.
//

import SwiftUI

struct SetupView: View {
    @ObservedObject private var viewModel = SetupViewModel()
    private let servers = GameServer.stringList()
    
    var body: some View {
        NavigationView {
            VStack {
                Picker("Select an option", selection: $viewModel.selectedServer) {
                    ForEach(0 ..< servers.count) {
                        Text(servers[$0])
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .frame(width: UIScreen.main.bounds.width - 40) 
                Button(action: {
                    // 
                }) {
                    Text("continue")
                }
            }
        }
        .navigationTitle(Text("setup_title"))
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct SetupView_Previews: PreviewProvider {
    static var previews: some View {
        SetupView()
    }
}
