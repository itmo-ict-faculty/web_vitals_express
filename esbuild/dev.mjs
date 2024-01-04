import * as esbuild from "esbuild";

import { copy } from "esbuild-plugin-copy";
// import { swcPlugin } from "esbuild-plugin-swc";

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
    // swcPlugin(),
  ],
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".jsx": "jsx",
    ".js": "js",
  },
});

let { host, port } = await context.serve({ port: 3000, servedir: "build" });
await context.watch();
