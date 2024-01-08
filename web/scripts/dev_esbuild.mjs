import * as esbuild from "esbuild";

import { copy } from "esbuild-plugin-copy";

const context = await esbuild.context({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: false,
  logLevel: "info",
  splitting: true,
  format: "esm",
  sourcemap: true,
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./public/*"],
        to: ["./build/"],
      },
    }),
  ],
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".jsx": "jsx",
    ".js": "js",
  },
});

let { host, port } = await context.serve({ port: 3002, servedir: "build" });
await context.watch();
