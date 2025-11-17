// Build script to bundle extension with TOON library using esbuild
import { build } from 'esbuild';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const distDir = './dist';

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Bundle contentScript with TOON library
await build({
  entryPoints: ['./src/contentScript.js'],
  bundle: true,
  outfile: './dist/contentScript.js',
  format: 'iife',
  platform: 'browser',
  target: 'chrome90',
  minify: true,
  drop: ['console', 'debugger'],
});

// Bundle options.js with TOON library
await build({
  entryPoints: ['./src/options.js'],
  bundle: true,
  outfile: './dist/options.js',
  format: 'iife',
  platform: 'browser',
  target: 'chrome90',
  minify: true,
  drop: ['console', 'debugger'],
});

// Copy static files from src
const srcFiles = [
  'background.js',
  'options.html'
];

srcFiles.forEach(file => {
  copyFileSync(`./src/${file}`, `${distDir}/${file}`);
});

// Copy manifest from root
copyFileSync('./manifest.json', `${distDir}/manifest.json`);

// Copy assets folder
const assetsDir = `${distDir}/assets`;
if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

const assetFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
assetFiles.forEach(file => {
  copyFileSync(`./assets/${file}`, `${assetsDir}/${file}`);
});

console.log('✓ Build complete! Extension ready in ./dist/');
