import * as esbuild from "esbuild";

import { copy } from "esbuild-plugin-copy";
// import { swcPlugin } from "esbuild-plugin-swc";

await esbuild.build({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: true,
  format: "esm",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./public/*"],
        to: ["./build/"],
      },
    }),
    // swcPlugin(),
  ],
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".html": "text",
  },
});
