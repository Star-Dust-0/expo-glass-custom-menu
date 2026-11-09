#!/usr/bin/env bash
# Runs inside an Android emulator: installs the APK and captures real screenshots.
set -u
APK="$1"; OUT="$2"; mkdir -p "$OUT"
PKG=com.rit3zh.expoglasscustommenu
adb install -r "$APK"
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
adb shell settings put global hide_error_dialogs 1
adb shell settings put secure anr_show_background 0
sleep 45

wait_tap() {
  dump
  python3 - <<'PY' | xargs -r adb shell input tap
import re
x = open('/tmp/ui.xml', encoding='utf-8').read()
if "isn't responding" in x:
    for m in re.finditer(r'text="Wait"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', x):
        a, b, c, d = map(int, m.groups())
        print((a + c) // 2, (b + d) // 2)
        break
PY
}
shot() { wait_tap; sleep 4; adb exec-out screencap -p > "$OUT/$1.png"; }
dump() { adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; adb pull /sdcard/ui.xml /tmp/ui.xml >/dev/null 2>&1; }
tap_desc() {
  dump
  python3 - "$1" <<'PY' | xargs -r adb shell input tap
import re, sys
x = open('/tmp/ui.xml', encoding='utf-8').read()
for m in re.finditer(r'content-desc="([^"]*)"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', x):
    if m.group(1) == sys.argv[1]:
        a, b, c, d = map(int, m.groups()[1:])
        print((a + c) // 2, (b + d) // 2)
        break
PY
}
launch() { adb shell am force-stop $PKG; wait_tap; adb shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1; sleep 15; wait_tap; }

run_set() {
  mode="$1"
  launch
  shot "$mode-1-library"
  tap_desc "View and sort options"; shot "$mode-2-library-menu"
  adb shell input keyevent 4; sleep 1
  tap_desc "Browse"; shot "$mode-3-browse"
  tap_desc "Favorites"; shot "$mode-4-favorites"
  tap_desc "Settings"; shot "$mode-5-settings"
  tap_desc "Appearance"; shot "$mode-6-settings-menu"
  adb shell input tap 50 300; sleep 1
  tap_desc "Browse"; sleep 1
  adb shell input tap 500 650; shot "$mode-7-detail"
  dump; cp /tmp/ui.xml "$OUT/$mode-detail.xml"
  adb shell input keyevent 4; sleep 1
}

adb shell cmd uimode night no
run_set light
adb shell cmd uimode night yes
run_set dark
adb logcat -d -s ReactNativeJS:V AndroidRuntime:E > "$OUT/logcat.txt" 2>&1
