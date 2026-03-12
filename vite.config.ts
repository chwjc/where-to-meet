import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const isH5 = process.env.UNI_PLATFORM === "h5";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    ...(!isH5 ? UnifiedViteWeappTailwindcssPlugin() ?? [] : []),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
