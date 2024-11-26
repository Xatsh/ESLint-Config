import type { Awaitable, TypedFlatConfigItem } from "@/types"

/**
 * Converts a value or an array of values to an array.
 *
 * @param value - The value or array of values to convert.
 * @returns The converted array.
 * @template T - The type of the value(s) in the array.
 */
export function toArray<T>(value: T | T[]): T[] {
	return Array.isArray(value) ? value : [value]
}

/**
 * Combines multiple configurations into a single array of TypedFlatConfigItem.
 *
 * @param configs - An array of Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]> representing the configurations to be combined.
 * @returns A Promise that resolves to an array of TypedFlatConfigItem representing the combined configurations.
 */
export async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> {
	const resolved = await Promise.all(configs)
	return resolved.flat()
}

/**
 * Interop the default export from a module or return the value itself.
 *
 * @param m - The module or value to interop.
 * @returns The default export if available, otherwise the value itself.
 */
export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await m
	return (resolved as any).default || resolved
}
