import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
      "jest.config.js",
      "jest.setup.js",
      "tailwind.config.js",
      "postcss.config.mjs",
      "src/types/global.d.ts",
      "src/__tests__/**/*",
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Disable unused variables as requested
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Disable console logs as requested
      "no-console": "off",
      "react/no-unescaped-entities": "off",
      
      // TypeScript specific - more lenient as requested
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "warn", // Reduced from error
      
      // Disable unsafe operations warnings
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off", 
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      
      // Import/require rules
      "@typescript-eslint/no-var-requires": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      
      // React specific
      "react-hooks/exhaustive-deps": "warn",
      
      // Code style - keep minimal
      "prefer-const": "warn",
      "no-var": "error", // This should be error - var is problematic
    },
  },
];

export default eslintConfig;