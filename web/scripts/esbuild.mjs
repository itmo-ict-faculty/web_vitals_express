import * as esbuild from "esbuild";

import { copy } from "esbuild-plugin-copy";
// import { swcPlugin } from "esbuild-plugin-swc";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";

await esbuild.build({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outdir: "./build",
  minify: true,
  logLevel: "info",
  splitting: true,
  format: "esm",
  metafile: true,
  treeShaking: true,
  sourcemap: "linked",
  platform: "browser",
  legalComments: "external",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./public/*"],
        to: ["./build/"],
      },
    }),
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/index.tsx"],
          filename: "index.html",
          scriptLoading: "defer",
          // define: { env: env.NODE_ENV, commitHash: env.GIT_COMMIT },
          // htmlTemplate: template,
        },
      ],
    }),
    // swcPlugin(),
  ],
  resolveExtensions: [".js", ".ts", ".tsx"],
  loader: {
    ".svg": "text",
    // ".ts": "ts",
    // ".tsx": "tsx",
    // ".js": "js",
    // ".jsx": "jsx",
    ".html": "text",
  },
});
