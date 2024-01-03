import * as esbuild from "esbuild";

const context = await esbuild.context({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: false,
  logLevel: "info",
  splitting: true,
  format: "esm",
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".jsx": "jsx",
  },
});

let { host, port } = await context.serve({ port: 3000, servedir: "build" });
await context.watch();
