import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");

// Mapbox GL (used in RichmondMap composition) requires WebGL inside headless Chromium.
// "angle" uses Chromium's ANGLE renderer; "swiftshader" is a slower CPU fallback.
Config.setChromiumOpenGlRenderer("angle");
