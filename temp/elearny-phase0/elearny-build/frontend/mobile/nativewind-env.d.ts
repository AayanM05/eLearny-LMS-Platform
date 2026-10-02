/// <reference types="nativewind/types" />

// TypeScript has no built-in notion of importing a plain .css file for its
// side effects (Metro/NativeWind handles it at build time, not tsc) — this
// ambient declaration just tells the type-checker the import is valid.
declare module "*.css";
