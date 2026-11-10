import type en from "./en";

export const locales = ["en", "fr", "es", "zh-CN", "ru", "pt", "sv"] as const;
export type Locale = (typeof locales)[number];

/**
 * Flat view of the English locale ("a.b.c" → value), computed once here.
 *
 * next-international flattens the nested locale inside the generic signature of every `t()` call
 * (GetLocaleType → Awaited → ReturnType → FlattenLocale → Leaves/FollowPath). With ~1,400 strings that chain is deep
 * enough to hit TypeScript's instantiation-depth limit (TS2589, hidden by skipLibCheck), after which `t()` silently
 * types as `any` and unrelated files fail with "Expected 2 arguments". Handing the library an already-flat locale
 * through its `OtherLocales` generic (see client.ts / server.ts) short-circuits that chain. Runtime is unchanged.
 */
type Leaf = string | number | boolean | null | undefined | Date;
type Join<K, P> = K extends string ? (P extends string ? `${K}${"" extends P ? "" : "."}${P}` : never) : never;
type Leaves<T> = T extends Leaf
  ? ""
  : T extends readonly unknown[]
    ? { [K in keyof T & `${number}`]: Join<K, Leaves<T[K]>> }[keyof T & `${number}`]
    : { [K in keyof T & string]: Join<K, Leaves<T[K]>> }[keyof T & string];
type FollowPath<T, P> = P extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? FollowPath<T[Head], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type FlatLocale = { [K in Leaves<typeof en>]: FollowPath<typeof en, K> };
export type TypedLocales = Record<Locale, FlatLocale>;
