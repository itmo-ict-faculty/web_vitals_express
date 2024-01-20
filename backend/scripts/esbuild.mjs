import { exec } from "child_process";
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: false,
  platform: "node",
  format: "esm",
  resolveExtensions: [".js", ".ts"],
  packages: "external",
});
