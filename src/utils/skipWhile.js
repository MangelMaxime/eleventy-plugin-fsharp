// @ts-check

/**
 * Remove elements that match the predicate from the beginning of the array
 *
 * @template T
 * @param {T []} source The input array
 * @param {(value: T) => boolean} predicate A function that evaluates an element of the array to a boolean value
 * @returns A new array with the elements that match the predicate removed from the beginning
 */
module.exports = function skipWhile(
    source,
    predicate
) {
    let i = 0;
    while (i < source.length && predicate(source[i])) {
        i++;
    }
    return source.slice(i);
}
