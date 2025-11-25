import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load toàn bộ biến môi trường (bao gồm cả VITE_ và không có VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. QUAN TRỌNG: Đảm bảo đường dẫn gốc đúng trên Cloudflare
    base: '/',

    plugins: [react()],

    // 2. Cấu hình Build đầu ra chuẩn
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // Tắt map để file nhẹ hơn
    },

    // 3. "Thuốc chữa" cho biến môi trường (Hỗ trợ cả code cũ và mới)
    define: {
      // Nếu code cũ dùng process.env.GEMINI_API_KEY, nó sẽ lấy giá trị từ VITE_GEMINI_API_KEY
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      // Fallback an toàn cho các trường hợp khác
      'process.env': {}
    },

    resolve: {
      alias: {
        // 4. Trỏ @ vào thư mục src (Chuẩn quốc tế)
        // LƯU Ý: Bạn bắt buộc phải di chuyển code vào thư mục src thì dòng này mới đúng
        '@': path.resolve(__dirname, './src'),
      }
    },
    
    // Cấu hình Server (chỉ dùng khi chạy dưới máy local)
    server: {
      port: 3000,
      host: true,
    }
  };
});
