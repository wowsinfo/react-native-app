@call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul
set MSBUILDSINGLELOADCONTEXT=1
msbuild wowsinfo.sln /p:Configuration=Debug /p:Platform=x64 /p:UseFabric=true /p:PlatformToolsetVersion=143 /p:WindowsTargetPlatformVersion=10.0.26100.0 /p:WindowsAppSDKVerifyTransitiveDependencies=false /p:OutputPath=x64\Debug\ /p:RunAutolinkCheck=false /p:RunCodegenWindows=false /t:Build /restore
start "" "x64\Debug\wowsinfo.exe"
