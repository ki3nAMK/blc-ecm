import {
    map,
    keys,
    trim,
    isNil,
    isDate,
    omitBy,
    reduce,
    reject,
    isArray,
    isEmpty,
    isObject,
    isString,
    toString,
    isFunction,
} from 'lodash';

export interface IGetProductPriceReturn {
    salePrice?: number;
    price: number;
    discount?: number;
    discountRate?: number;
    minPrice?: number;
    maxPrice?: number;
}

interface trimObjectValuesProps {
    omitEmpty?: boolean;
}

export const trimObjectValues = (
    values: any,
    { omitEmpty }: trimObjectValuesProps = { omitEmpty: false }
): any => {
    try {
        JSON.parse(JSON.stringify(values));

        const isRemove = (val: any) => {
            if (isObject(val) && !isFunction(val) && !isDate(val))
                return isEmpty(val);
            if (isString(val)) return !val;
            return isNil(val);
        };

        const trims = (val: any): any => {
            if (isString(val)) return trim(val);

            if (isFunction(val) || isDate(val) || !isObject(val)) return val;

            if (isArray(val)) {
                const results = map(val, (value) => trims(value));
                return omitEmpty ? reject(results, (it) => isRemove(it)) : results;
            }

            const results = reduce(
                keys(val),
                (prev: any, key) => ({ ...prev, [key]: trims((val as any)[key]) }),
                {}
            );

            return omitEmpty ? omitBy(results, (it) => isRemove(it)) : results;
        };

        return trims(values);
    } catch (error) {
        return values;
    }
};

export function to<T, U = Error>(
    promise: Promise<T>,
    errorExt?: object
): Promise<[U, undefined] | [null, T]> {
    return promise
        .then<[null, T]>((data: T) => [null, data])
        .catch<[U, undefined]>((err: U) => {
            if (errorExt) {
                const parsedError = { ...err, ...errorExt };
                return [parsedError, undefined];
            }

            return [err, undefined];
        });
}

export const formatNumber = (val: number | null | undefined) => {
    if (isNil(val)) return 0;

    return toString(val)?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
