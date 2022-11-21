/**
 * @type {import("ava").TestFn<T>}
 */
const test = require('ava');
const Eleventy = require("@11ty/eleventy");

test("eleventy-fsharp-literate works", async (t) => {

    const elev = new Eleventy("./11ty-integration-1/", "./11ty-integration-1/_site/", {
        configPath: "./11ty-integration-1/.eleventy.js"
    });

    const json = await elev.toJSON();
    const expected = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="referrer" content="no-referrer-when-downgrade">
        <title>This is the title of the script</title>
    </head>
    <body>
        <pre><code class="language-fs">let a = 1
</code></pre>
<h1>First-level heading</h1>
<p>Some more documentation using <code>Markdown</code>.</p>
    </body>
</html>
`

    t.deepEqual(json[0].content, expected);
});

test("nunjucks filters are supported from inside the F# file", async (t) => {

    const elev = new Eleventy("./11ty-integration-2/", "./11ty-integration-2/_site/", {
        configPath: "./11ty-integration-2/.eleventy.js"
    });

    const json = await elev.toJSON();
    const expected = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="referrer" content="no-referrer-when-downgrade">
        <title>This is the title of the script</title>
    </head>
    <body>
        <p>Nunjucks filters are support from inside the F# file.</p>
<p>SOME TEXT</p>
    </body>
</html>
`

    t.deepEqual(json[0].content, expected);
});
