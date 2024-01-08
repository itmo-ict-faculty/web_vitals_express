import { exec } from "child_process";
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: true,
  platform: "node",
  format: "esm",
  resolveExtensions: [".js"],
});
