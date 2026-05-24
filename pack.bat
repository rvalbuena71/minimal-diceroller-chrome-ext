echo off
REM ** identify which browser is our target**
set buildtarget=""
if "%1"=="" (set buildtarget=chrome) else (set buildtarget=firefox)
echo **************************************************
echo packing for %buildtarget%...
dir /b *.js > dirlist.txt
dir /b *.html >> dirlist.txt
dir /b *.css >> dirlist.txt
dir /b *.png >> dirlist.txt
echo copying manifest.json
if %buildtarget%==chrome (copy /y manifest-chrome.json manifest.json)
if %buildtarget%==firefox (copy /y manifest-firefox.json manifest.json)
echo manifest.json >> dirlist.txt
rem type dirlist.txt
rem type manifest.json

echo packing...
del minimal-diceroller-%buildtarget%.zip
7z u minimal-diceroller-%buildtarget%.zip @dirlist.txt
echo **************************************************