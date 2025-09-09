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
      // 👉 Allow unused variables (e.g., during dev, placeholders)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // 👉 Allow console.log (remove in prod if needed, but don't error during dev)
      "no-console": "off",

      // 👉 Ignore quote style (single/double/backtick — no enforcement)  
      "quotes": "off",
      "@typescript-eslint/quotes": "off",

      // 👉 Allow unescaped entities in JSX (common for apostrophes, quotes, etc)
      "react/no-unescaped-entities": "off",

      // 👉 Still keep critical TypeScript and logic errors ON
      "@typescript-eslint/no-explicit-any": "warn", // Warn, not error
      "@typescript-eslint/ban-ts-comment": "warn",  // Warn if // @ts-ignore is used
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/no-var-requires": "error",

      // Optional: You can turn these to "off" if they annoy you during prototyping
      // "prefer-const": "off",
      // "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

export default eslintConfig;