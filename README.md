# eleventy-plugin-fsharp

This plugin add support for F# literate files to Eleventy.

## Installation

**Important**

Only nunjucks templates are supported for now. Can be revisited to add support for other template engines if there is demand.

```js
const eleventyFsharpLiterate = require("@mangelmaxime/eleventy-plugin-fsharp");

module.exports = function (eleventyConfig) {
    // Add the fsharp plugin
    eleventyConfig.addPlugin(eleventyFsharpLiterate);

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

## Syntax

An literate F# literate file is a file ending with `.fsx`.

```fs
(***
---
layout: standard
title: Introduction
---
***)

(**
# First-level heading

Some more documentation using `Markdown`.
*)

// This F# code will be included in the output
let helloWorld() = printfn "Hello world!"

(*** hide ***)

// This F# code will not be included in the output
let add x y = x + y
```

The F# script files is processed as follows:

- It starts with a YAML front matter block delimited by `(***` and `***)`, which is used to set the metadata for the page.
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
