import * as esbuild from "esbuild";

import { swcPlugin } from "esbuild-plugin-swc";

await esbuild.build({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: true,
  format: "esm",
  plugins: [swcPlugin()],
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
  },
});
