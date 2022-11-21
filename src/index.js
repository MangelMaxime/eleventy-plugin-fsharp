// Code from this file has been based on
// https://github.com/saneef/eleventy-plugin-asciidoc/blob/da3ba916808fdb87e97f25c4451f3a78f55a5769/lib/eleventy-asciidoc.js

const debug = require("debug")("eleventy-plugin-fsharp-literate");
const NunjucksLib = require("nunjucks");
const NunjucksEngine = require("@11ty/eleventy/src/Engines/Nunjucks");
const eleventyRemarkInternal = require("@fec/eleventy-plugin-remark/src/eleventyRemark");
const readFileSync = require("./utils/readFileSync");
const transformFsxToMarkdown = require("./transformFsxToMarkdown")
const getData = require("./getData");

const defaultEleventyRemarkOptions = {
    plugins: [],
    enableRehype: true,
};

/**
 *
 * Return the instance of the Nunjucks engine if it exists, otherwise create it and return it.
 *
 * @param {object} nunjucksEngineCache
 * @param {object} eleventyConfig
 * @returns {object} The Nunjucks engine
 */
function getNunjucksEngine(nunjucksEngineCache, eleventyConfig) {
    // Setup the nunjucks used by eleventy, so we can call it ourself to process the content
    // This is need otherwise, shortcodes or filters are not processed correctly

    if (!nunjucksEngineCache) {
        nunjucksEngineCache = new NunjucksEngine(
            "njk",
            {
                input: eleventyConfig.dir.input,
                includes: eleventyConfig.dir.includes,
            },
            eleventyConfig
        );
    }

    return nunjucksEngineCache;
}

/**
 * @typedef {object} FsharpLiteratePluginOptions
 * @property {object} [eleventyRemarkOptions] Options to pass to the eleventy-remark plugin
 */

/**
 * @typedef {string | undefined | function(object):object} EleventyInputContent
 */

/**
 *
 * @param {object} nunjucksEngineCache
 * @param {object} eleventyConfig
 * @param {FsharpLiteratePluginOptions} pluginOptions
 * @returns {object}
 */
function eleventyFsharpLiterate(
    nunjucksEngineCache,
    eleventyConfig,
    pluginOptions
) {
    /**
     *
     * @param {EleventyInputContent} inputContent The content of the file
     * @param {string} inputPath The path of the file
     */
    const compile = async (
        inputContent,
        inputPath
    ) => {
        const remarkOptions = Object.assign(
            {},
            defaultEleventyRemarkOptions,
            pluginOptions?.eleventyRemarkOptions
        );

        const remark = eleventyRemarkInternal(remarkOptions);

        /**
         * @param {object} data The data object coming from the data cascade (front-matter, global data, etc.)
         */
        return async (data) => {
            if (inputContent) {
                // So if str has a value, it's a permalink (which can be a string or a function)
                debug(`Permalink: ${inputContent}`);
                return typeof inputContent === "function"
                    ? inputContent(data)
                    : NunjucksLib.renderString(inputContent, data);
            }

            debug(`Reading ${inputPath}`);
            const { content } = readFileSync(inputPath);

            const nunjucksEngine = getNunjucksEngine(nunjucksEngineCache, eleventyConfig);

            if (content) {
                debug(`Converting fsx:\n ${content}`);

                const markdownContent = transformFsxToMarkdown(content);

                debug(`Markdown content:\n ${markdownContent}`);

                const markdownText = await remark.render(markdownContent, data);
                const nunjucksCompileFunc = await nunjucksEngine.compile(
                    markdownText,
                    inputPath
                );
                return await nunjucksCompileFunc(data);
            }
        };
    };

    return {
        read: false,
        getData,
        compile,
    };
}

/**
 * @param {object} eleventyConfig
 * @param {FsharpLiteratePluginOptions} pluginOptions
 */
function configFunction(
    eleventyConfig,
    pluginOptions
) {

    // Cache for the nunjucks engine,
    // this avoid to create a new instance of the nunjucks engine for each file
    let nunjucksEngineCache = null;

    // Add support for fsx files
    eleventyConfig.addTemplateFormats("fsx");

    // Teach eleventy how to handle fsx files
    eleventyConfig.addExtension(
        "fsx",
        eleventyFsharpLiterate(nunjucksEngineCache, eleventyConfig, pluginOptions)
    );
}

module.exports = {
    initArguments: {},
    configFunction: configFunction,
};
