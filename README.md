# eleventy-plugin-fsharp

This plugin add support for F# literate files to Eleventy.

## Syntax

An literate F# literate file is a file ending with `.fsx`.

### Front matter

The front matter section is delimited by `(**` and `**)` and is parsed as YAML.

```
(**
---
title: "My title"
layout: the-layout-name
---
**)
```

### Commands

You can use the `(*** hide ***)` command to hide a block of code up the next command `(*** show ***)` or markdown block.

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

### Markdown blocks

Markdown blocks are defined by using `(** ... *)`. Anything between these tags is going to be treated as markdown.

```md
(**
### This line will be converted to a header

This text is **strong** and this one is in *italic*
*)
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
