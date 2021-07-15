
npm run build

adb shell rm -r /sdcard/bemr

adb push /home/source3/code/lab/bemr/dist/ /sdcard/bemr/

adb shell am start -n com.android.chrome/com.google.android.apps.chrome.Main  -d 'file:///sdcard/bemr/index.html' 