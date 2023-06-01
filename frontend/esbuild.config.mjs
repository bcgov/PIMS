import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgr from 'esbuild-plugin-svgr';
import inlineImage from 'esbuild-plugin-inline-image';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  outfile: 'build/bundle.js',
  loader: {
    '.woff': 'file', // Set the loader for WOFF files to 'file'
  },
  plugins: [sassPlugin(), svgr(), inlineImage()],
});
