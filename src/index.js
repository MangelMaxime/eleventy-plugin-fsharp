// Code from this file has been based on
// https://github.com/saneef/eleventy-plugin-asciidoc/blob/da3ba916808fdb87e97f25c4451f3a78f55a5769/lib/eleventy-asciidoc.js

const debug = require("debug")("eleventy-plugin-fsharp-literate");
const readFileSync = require("./utils/readFileSync");
const NunjucksLib = require("nunjucks");
const transformFsxToMarkdown = require("./transformFsxToMarkdown")
const getData = require("./getData");

/**
 * @typedef {string | undefined | function(object):object} EleventyInputContent
 */

const TemplateRender = require("@11ty/eleventy/src/TemplateRender");

async function compileMarkdown(
    content,
    { templateConfig, extensionMap }
) {
    let inputDir = templateConfig?.dir?.input;

    let tr = new TemplateRender("md", inputDir, templateConfig);
    tr.extensionMap = extensionMap;
    tr.setEngineOverride("md");

    return tr.getCompiledTemplate(content);
}

async function compileNunjucks(
    content,
    { templateConfig, extensionMap }
) {
    let inputDir = templateConfig?.dir?.input;

    let tr = new TemplateRender("njk", inputDir, templateConfig);
    tr.extensionMap = extensionMap;
    tr.setEngineOverride("njk");

    return tr.getCompiledTemplate(content);
}

/**
 * @param {import('@11ty/eleventy/src/UserConfig'} eleventyConfig
 */
function configFunction(
    eleventyConfig
) {
    // Cache for the nunjucks engine,
    // this avoid to create a new instance of the nunjucks engine for each file
    // let nunjucksEngineCache = null;
    let extensionMap;
    eleventyConfig.on("eleventy.extensionmap", map => {
        extensionMap = map;
    });

    let templateConfig;
    eleventyConfig.on("eleventy.config", (cfg) => {
        templateConfig = cfg;
    });

    // Add support for fsx files
    eleventyConfig.addTemplateFormats("fsx");

    // For some reason, we need to define the compile function inside of
    // the config option. Otherwise, the templateConfig and extensionMap
    // variables are undefined.
    // IHMO, they should not be undefined because they should hold
    // a reference to their original declaration and have the updated value
    // forwared.
    // NOTE: This bug only happens when consuming the plugin as an NPM package
    // Local testing and local package installation was fine... ¯\_(ツ)_/¯

    /**
     *
     * @param {EleventyInputContent} inputContent The content of the file
     * @param {string} inputPath The path of the file
     */
    const compile = async (
        inputContent,
        inputPath
    ) => {
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

            if (content) {
                debug(`Converting fsx:\n ${content}`);

                const markdownContent = transformFsxToMarkdown(content);

                debug(`Markdown content:\n ${markdownContent}`);

                const compileMarkdownFn = await compileMarkdown(markdownContent, {
                    templateConfig: templateConfig,
                    extensionMap,
                })
                const markdownText = await compileMarkdownFn(data);

                // Replace &quot; with " because some markdown renderers escape the quotes
                // and it breaks the nunjucks compilation
                const fixedMarkdownText = markdownText.replace(/&quot;/g, '"');

                const compileNunjucksFn = await compileNunjucks(fixedMarkdownText, {
                    templateConfig: templateConfig,
                    extensionMap,
                })

                return await compileNunjucksFn(data);
            }
        };
    };

    // Teach eleventy how to handle fsx files
    eleventyConfig.addExtension(
        "fsx",
        {
            read: false,
            getData,
            compile,
        }
    );
}

module.exports = {
    initArguments: {},
    configFunction: configFunction,
};
