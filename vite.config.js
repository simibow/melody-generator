import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
  },
});

// export default defineConfig({
//   build: {
//     rollupOptions: {
//       // Externalize deps that you don't want to bundle into your final build
//       external: [
//         'tonal'
//       ],
//       output: {
//         globals: {
//           tonal: 'Tonal'
//         }
//       }
//     }
//   },
//   optimizeDeps: {
//     include: ['tonal']
//   }
// });