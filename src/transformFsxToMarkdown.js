import debugUtil from "debug";
const debug = debugUtil("eleventy-plugin-fsharp-literate");
import skipUntil from "./utils/skipUntil.js";
import skipWhile from "./utils/skipWhile.js";
import skipWhileFromEnd from "./utils/skipWhileFromEnd.js";
import takeUntil from "./utils/takeUntil.js";

/** @type {RegExp} */
const startMarkdownCommentRegex = /\(\*(\*)+\s*/;

/** @type {RegExp} */
const endMarkdownCommentRegex = /\s*(\*)+\)/;

/**
 * Transforms a file from F# literate to markdown
 *
 * @param {string[]} accumulator Accumulate the transformed lines
 * @param {string[]} lines Lines to process
 * @returns {string} The markdown text resulting from the transformation
 */
function processFile(accumulator, lines) {
    const line = lines[0];

    debug("ProcessFile - accumulator:", accumulator);
    debug("ProcessFile - lines:", lines);

    // If there are no more lines, return the result of the transformation
    if (line === undefined) {
        return accumulator.join("\n");
    }

    const trimmedLine = line.trim();

    if (trimmedLine === "(*** hide ***)") {
        debug("Capture an hide block");

        // Eat the first line because it is the instruction line
        lines.shift();

        // Skip the lines until we find a new literate comment
        const rest = skipUntil(lines, (/** @type {string} */ line) =>
            line.trim().startsWith("(**")
        );

        debug(`Rest of the lines:`, rest);

        return processFile(accumulator, rest);
    } else if (trimmedLine === "(*** show ***)") {
        debug("Show instruction encountered");
        // Eat the first line because it is the instruction line
        lines.shift();
        return processFile(accumulator, lines);
    } else if (trimmedLine.startsWith("(**")) {
        // Eat the first line because it is the literate comment
        lines.shift();

        // 1. Store the start of the F# markdown comment as it can contain some text
        accumulator.push(line.replace(startMarkdownCommentRegex, ""));

        // 2. Take the lines until we find the end of the markdown comment
        const markdownLines = takeUntil(lines, line =>
            line.trimEnd().endsWith("*)")
        );

        const rest = lines.slice(markdownLines.length);

        const newAccumulator = accumulator.concat(markdownLines);

        const endLine = rest[0];

        // Check if the line ending the markdown comment has some content
        // If yes, capture it and add it to the result
        if (endLine) {
            newAccumulator.push(endLine.replace(endMarkdownCommentRegex, ""));
        }

        // Skip the last line because it is the end of the markdown comment
        // and we don't need it anymore
        let restWithoutEndLine = rest.slice(1);

        return processFile(newAccumulator, restWithoutEndLine);
    } else {
        debug("Start capturing a code block");
        const codeLines = takeUntil(lines, line =>
            line.trim().startsWith("(**")
        );

        debug(`Captured ${codeLines.length} lines of code:`, codeLines);

        const rest = lines.slice(codeLines.length);

        debug(`Rest of the lines:`, rest);

        // Remove non meaningful lines
        let sanetizedCodeLines = skipWhile(
            codeLines,
            line => line === ""
        );
        sanetizedCodeLines = skipWhileFromEnd(
            sanetizedCodeLines,
            line => line === ""
        );

        debug(`Sanetized code lines:`, sanetizedCodeLines);

        /** @type {string []} */
        let actualCode = [];

        // If there are actual code line add them inside of a code block
        if (sanetizedCodeLines.length > 0) {
            actualCode = ["```fs"].concat(sanetizedCodeLines).concat(["```\n"]);
        }

        const newAccumulator = accumulator.concat(actualCode);

        debug(`New accumulator state:`, newAccumulator);

        return processFile(newAccumulator, rest);
    }
}

/**
 * Transforme the provided F# literate text to markdown
 *
 * @param {string} fileContent File content to process
 * @returns {string} The result of transforming the F# literate syntax to markdown
 */
const transformFsxToMarkdown = (fileContent) => {
    const lines = fileContent.replace(/\r\n/g, "\n").split("\n");

    // Remove empty lines at the beginning of the file
    const sanetizedLines = skipWhile(lines, line => line.trim() === "");

    return processFile([], sanetizedLines);
};

export default transformFsxToMarkdown;
