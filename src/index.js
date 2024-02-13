// Code from this file has been based on
// https://github.com/saneef/eleventy-plugin-asciidoc/blob/da3ba916808fdb87e97f25c4451f3a78f55a5769/lib/eleventy-asciidoc.js


import debugUtil from "debug";
const debug = debugUtil("eleventy-plugin-fsharp-literate");

import readFileSync from "./utils/readFileSync.js";
import NunjucksLib from "nunjucks";
import transformFsxToMarkdown from "./transformFsxToMarkdown.js";
import getData from "./getData.js";
import { EleventyRenderPlugin } from "@11ty/eleventy";

/**
 * @typedef {string | undefined | function(object):object} EleventyInputContent
 */

function eleventyFsharp(eleventyConfig) {

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

                const markdownText = await eleventyConfig.getFilter("renderTemplate")(markdownContent, "md");

                // Replace &quot; with " because some markdown renderers escape the quotes
                // and it breaks the nunjucks compilation
                const fixedMarkdownText = markdownText.replace(/&quot;/g, '"');

                return await eleventyConfig.getFilter("renderTemplate")(fixedMarkdownText, "njk");
            }
        };
    };

    return {
        read: false,
        getData,
        compile,
    }
}

/**
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
function configFunction(
    eleventyConfig
) {

    eleventyConfig.addPlugin(EleventyRenderPlugin);

    // Add support for fsx files
    eleventyConfig.addTemplateFormats("fsx");

    // Teach eleventy how to handle fsx files
    eleventyConfig.addExtension(
        "fsx",
        eleventyFsharp(eleventyConfig)
    );

    eleventyConfig.addExtension(
        "fs",
        eleventyFsharp(eleventyConfig)
    );
}

export default {
    initArguments: {},
    configFunction: configFunction,
}
