/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/tests/setup.ts"],
        css: true,
        coverage: {
            provider: "istanbul",
            reporter: ["text", "json", "html"]
        }
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    }
});
