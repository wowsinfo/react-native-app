rm -rf ~/Library/Developer/Xcode/DerivedData
# why is this needed?
xattr -w com.apple.xcode.CreatedByBuildSystem true ./build
xcodebuild clean
