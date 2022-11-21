const fsharpPlugin = require("../../src/index.js");

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {

    // Add a nunjucks filter to check that it can be accessed from the .fsx file
    eleventyConfig.addNunjucksFilter(
        "capitalize",
        function (text) {
            return text.toUpperCase();
        }
        );

    eleventyConfig.addPlugin(fsharpPlugin);

    return {
        dir: {
            input: ".",
            includes: "_includes",
            output: "_site",
        },
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
