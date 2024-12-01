import { defineConfig } from "vite";
import path, { resolve } from "path";

import handlebars from "vite-plugin-handlebars";
import viteImagemin from "vite-plugin-imagemin";
import { globSync } from "glob";
import { fileURLToPath } from "node:url";

export default defineConfig({
    /**
     * 경로 설정
     */
    root: path.resolve(__dirname, "src/pages"), // 기본 경로
    base: "./",

    /**
     * 서버 설정
     */
    server: {
        port: 3000,
        host: "0.0.0.0",
        open: true, // 서버 가동시 바로 열기
        hmr: true, // 코드 변경 시 변경된 부분만 새로고침
    },

    /**
     * 플러그인 설정
     * 이미지 최적화, 컴포넌트 분리 등
     */
    plugins: [
        // 공통요소 분리를 위함
        handlebars({
            partialDirectory: resolve(__dirname, "src/partials"),
            reloadOnPartialChange: true,
        }),

        // 빌드 이미지 파일 용량 최적화. 단계 좀 낮춤
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7, // GIF 이미지의 최적화 수준을 설정, 0부터 7까지 설정, 숫자가 클수록 더 많은 최적화가 적용, 최적화 레벨이 높을수록 더 많은 시간이 소요
                interlaced: false, // true로 설정하면 GIF가 인터레이스 형식으로 저장, 이는 이미지가 점차적으로 렌더링되는 방식으로, 처음에는 낮은 품질로 보이고 점차 선명, false로 설정하면 일반 GIF 형식으로 저장
            },
            optipng: {
                optimizationLevel: 7, // PGN 이미지의 최적화 수준을 설정, 0부터 7까지 설정, 숫자가 클수록 더 많은 최적화가 적용, 최적화 레벨이 높을수록 더 많은 시간이 소요
            },
            pngquant: {
                quality: [0.8, 0.9], // PNG 이미지의 품질 범위를 설정. 배열로 설정하여 최소 품질과 최대 품질을 정의할 수 있다. ex) 들어, [0.8, 0.9]는 품질을 80%에서 90% 사이로 설정하여 이미지 크기를 줄이되, 품질 저하는 최소화하려는 설정
                speed: 4, // 최적화 속도를 설정합니다. 1은 최적화 속도가 빠르지만 품질을 더 많이 떨어뜨리고, 10은 매우 느리지만 최적화 품질이 최고. 일반적으로 4 정도가 균형 잡힌 성능
            },
            mozjpeg: {
                quality: 20, // JPEG 품질 설정 0에서 100까지 설정할 수 있으며, 숫자가 낮을수록 압축이 강해지고 품질이 낮아짐
            },

            svgo: {
                plugins: [
                    {
                        name: "removeViewBox", //SVG 파일의 viewBox 속성을 제거. viewBox는 SVG의 크기 및 비율을 지정하는 속성으로, 필요하지 않다면 이 속성을 제거하여 파일 크기를 줄일 수 있음
                    },
                    {
                        name: "removeEmptyAttrs", // SVG에서 빈 속성을 제거. 이 속성을 활성화하면 빈 속성이 제거되어 SVG 파일 크기가 줄어듭니다. active: false로 설정하면 이 플러그인이 비활성
                        active: false,
                    },
                ],
            },
        }),
    ],

    /**
     * 빌드 설정
     */
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                globSync('src/pages/**/*.html').map(file => [
                    path.relative(
                        'src',
                        file.slice(0, file.length - path.extname(file).length)
                    ),
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                dir: "dist",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css')
                      return 'customname.css';
                  },
              },
        },
    },
});
