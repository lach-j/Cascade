import { useMemo } from "react";

type StylesObject = Record<string, string>;
type StylesMap = Record<string, StylesObject>;
type Condition = boolean | undefined | null;

// Generic utility to create variant method names (withSize, withColor, etc.)
type WithVariantMethods<
  Variants extends Record<string, StylesMap>,
  Styles extends StylesObject
> = {
  [K in keyof Variants as `with${Capitalize<string & K>}`]: (
    option: keyof Variants[K]
  ) => TailwindStylesReturn<Styles, Variants>;
};

// Helper to capitalize the first letter in a type
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

/**
 * Return type for useTailwindStyles
 */
export type TailwindStylesReturn<
  Styles extends StylesObject,
  Variants extends Record<string, StylesMap>
> = Styles & {
  [K in keyof Styles]: Styles[K];
} & {
  [K in keyof Styles as `${string & K}If`]: (
    condition: Condition,
    additionalClasses: string
  ) => string;
} & {
  [K in keyof Styles as `${string & K}ToggleClass`]: (
    condition: Condition,
    trueClass: string,
    falseClass?: string
  ) => string;
} & WithVariantMethods<Variants, Styles> & {
    cx: (...classes: (string | Condition)[]) => string;
  };

/**
 * Hook for managing Tailwind CSS classes with variants and conditions
 */
export function useTailwindStyles<
  Styles extends StylesObject,
  Variants extends Record<string, StylesMap> = {}
>(
  baseStyles: Styles,
  variants?: Variants
): TailwindStylesReturn<Styles, Variants> {
  const stylesObject = useMemo(() => {
    const styles = { ...baseStyles } as Record<string, unknown>;

    Object.keys(baseStyles).forEach((key) => {
      styles[`${key}If`] = (condition: Condition, additionalClasses: string) =>
        condition ? `${baseStyles[key]} ${additionalClasses}` : baseStyles[key];

      styles[`${key}ToggleClass`] = (
        condition: Condition,
        trueClass: string,
        falseClass: string = ""
      ) =>
        condition
          ? `${baseStyles[key]} ${trueClass}`
          : `${baseStyles[key]} ${falseClass}`;
    });

    if (variants) {
      Object.entries(variants).forEach(([variantName, variantOptions]) => {
        const methodName = `with${capitalize(variantName)}`;

        styles[methodName] = (option: string) => {
          const variantStyles = variantOptions[option] || {};

          const newStyles = { ...styles };

          Object.entries(variantStyles).forEach(([styleKey, styleValue]) => {
            if (Object.prototype.hasOwnProperty.call(baseStyles, styleKey)) {
              newStyles[styleKey] = styleValue;
            }
          });

          return newStyles;
        };
      });
    }

    styles.cx = (...classes: (string | Condition)[]) =>
      classes.filter(Boolean).join(" ");

    return styles as TailwindStylesReturn<Styles, Variants>;
  }, [baseStyles, variants]);

  return stylesObject;
}

export default useTailwindStyles;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
