cd /d %~dp0

@REM フォルダがなければ作る
IF NOT EXIST "..\build\" (
  mkdir ..\build
)
webpack --config webpack.config.js
pause

