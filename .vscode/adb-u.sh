
npm run build

adb shell rm -r /sdcard/bemr

adb push /home/source3/code/bemr/dist/ /sdcard/bemr/
