const readFileSync = require("./utils/readFileSync");

/**
 * Gets front-matter data from the file synchronously
 *
 * @param {string} inputPath The input path
 * @return {Object.<string, any>} The data.
 */
 const getData = (inputPath) => {
    const { data } = readFileSync(inputPath);

    return {
        ...data,
    };
};

module.exports = getData;
