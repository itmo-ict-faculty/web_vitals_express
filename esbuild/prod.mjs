import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: true,
  format: "esm",
  loader: {
    ".svg": "text",
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
  },
});
