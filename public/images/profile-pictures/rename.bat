@echo off
setlocal

set "source_dir=%~dp0"
set "prefix=employee"
set /a count=1

for %%i in ("%source_dir%*.jpg" "%source_dir%*.jpeg" "%source_dir%*.png" "%source_dir%*.gif" "%source_dir%*.bmp") do (
  set "new_filename=%prefix%%count%%%~xi"
  ren "%%i" "%new_filename%"
  set /a count+=1
)

endlocal