# eleventy-plugin-fsharp

This plugin add support for F# literate files to Eleventy.

## Syntax

An literate F# literate file is a file ending with `.fsx`.

```fs
(**
---
layout: standard
title: Introduction
---
**)

(**
# First-level heading

Some more documentation using `Markdonw`.
*)

// This F# code will be included in the output
let helloWorld() = printfn "Hello world!"

(*** hide ***)

// This F# code will not be included in the output
let add x y = x + y
```

The F# script files is processed as follows:

- It starts with a YAML front matter block delimieted by `(**` and `**)`, which is used to set the metadata for the page.
- A multi-line comment starting with `(**` and ending with `*)` is considered a Markdown block.
- A single line comment starting with `(***` and ending with `***)` is considered as a command.

### Commands

**`(*** hide ***)`**

Hide the subsequent snippet from the output up to the next command `show` command or markdown block.

```fs
(*** hide ***)

// This code is hidden
let a = 1

(*** show ***)
// This code is shown
let b = 2

(*** hide ***)
// This code is hidden
let c = 3

(**
This is a markdown block
*)

// This code is shown
let d = 4
```

## Limitations

**Important**

Only nunjucks templates are supported for now. Can be revisited to add support for other template engines if there is demand.

Syntax highlighting is using [@fec/eleventy-plugin-remark](https://www.npmjs.com/package/@fec/eleventy-plugin-remark) internally. So you are encourage, to use the same plugin to add syntax highlighting to your markdown files.

```js
// Store the remark options in a variable so you garantee
// that the same options are used for both plugins
const remarkOptions = {
    enableRehype: false,
    plugins: [
        // ...
    ],
};

module.exports = function (eleventyConfig) {
    // Set remark as your default markdown engine
    eleventyConfig.addPlugin(eleventyRemark, remarkOptions);
    // Add the fsharp plugin
    eleventyConfig.addPlugin(eleventyFsharpLiterate, {
        eleventyRemarkOptions: remarkOptions,
    });

    return {
        dir: {
            input: ".",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
    };
};
```
