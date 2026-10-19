import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  clean: true,
  outDir: "dist/",
  entry: ["src/lib/index.ts"],
  format: ["cjs", "esm"],
});
