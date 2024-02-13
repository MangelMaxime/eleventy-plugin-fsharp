import fsharpPlugin from "../../src/index.js";

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
export default function (eleventyConfig) {
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
