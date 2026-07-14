@call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul
msbuild wowsinfo.sln /p:Configuration=Debug /p:Platform=x64 /p:RunAutolinkCheck=false /p:RunCodegenWindows=false /t:Build /restore
start "" "x64\Debug\wowsinfo.exe"
