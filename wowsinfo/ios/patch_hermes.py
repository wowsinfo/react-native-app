"""
Hermes doesn't seem to install if you use a higher Ruby version
"""

# sed -i .orig 's/File\.exists\?/File\.exist\?/g' ../node_modules/react-native/sdks/hermes-engine/hermes-engine.podspec
# Then, need to remove ss.visionos (entire line) from the podspec
