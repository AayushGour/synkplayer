react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
sleep 2
cd android
gradlew clean
sleep 5
gradlew --stop
sleep 5
cls 
echo Running Build
gradlew assembleRelease -x bundleReleaseJsAndAssets
cd ..