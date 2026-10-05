# Ground homepage assets

`noe-14th-15th-render.splat` is the existing 1.6 million Gaussian render derivative from `murmura-ground-assets/assets/motion/public/splats/`. It is a real Noe Street capture trained with Brush, not a procedural stand-in. The original motion scene's quaternion and camera scale are retained in `src/GroundSplat.tsx`.

Street geometry and the recorded July 16, 2026 Mission route come from `murmura-ground-assets/assets/motion/src/data/{mission,captureRail}.json`, copied into `src/ground-data`. The route is drawn from recorded coordinates, not the original scene's synthetic north–south planning pass. The display deliberately describes capture activity rather than claiming that every captured street has a finished reconstruction.

The splat is about 49 MiB. It loads only when the viewer approaches the viewport, and rendering pauses offscreen. Original project assets are unchanged.
