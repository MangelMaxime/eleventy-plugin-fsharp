const fs = require("fs");
const matter = require("gray-matter");

/**
 * Reads a file synchronously and returns the front-matter result
 *
 * @param {string}  inputPath  The input path
 * @return {GrayMatterFile}  { description_of_the_return_value }
 */
const readFileSync = (inputPath) => {
    return matter(fs.readFileSync(inputPath, "utf8"), {
        delimiters: ["(***", "***)"],
    });
};

module.exports = readFileSync;
