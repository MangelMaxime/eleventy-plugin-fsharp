const fsharpPlugin = require("../src/index.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const loadLanguages = require("prismjs/components/");

loadLanguages("fsharp");

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {

    // Add a nunjucks filter to check that it can be accessed from the .fsx file
    eleventyConfig.addNunjucksFilter(
        "now",
        function () {
            const now = new Date();
            return now.toISOString();
        }
        );

    // Set up the syntax highlighter
    eleventyConfig.addPlugin(syntaxHighlight, {
        init: function ({ Prism }) {
            Prism.languages.fs = Prism.languages.fsharp;
        }
    });

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
