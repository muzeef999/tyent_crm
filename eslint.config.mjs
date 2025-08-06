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

   // Rule overrides
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",         // disable 'any' errors
      "@typescript-eslint/no-unused-vars": ["warn"],       // change to warning (optional)
      "no-unused-vars": "off",                              // in case base rules conflict
    },
  },
];

export default eslintConfig;
