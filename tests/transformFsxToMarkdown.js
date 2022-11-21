/**
 * @type {import("ava").TestFn<T>}
 */
 const test = require('ava');
 const transformFsxToMarkdown = require("../src/transformFsxToMarkdown")

test("removes empty lines at the beginning", (t) => {
    const input = `


(** Title
*)`;
    const expected = `Title
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("transform F# code into a markdown code block", (t) => {
    const input = `

let x = 42`;
    const expected = `\`\`\`fs
let x = 42
\`\`\`
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("hide instruction hide the code up the end of the file", (t) => {
    const input = `

(*** hide ***)
let x = 42

let y = 43`;
    const expected = ``;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("hide is active up to the next Markdown comment then code after is included", (t) => {
    const input = `

(*** hide ***)
let x = 42

(**
This is a markdown comment
*)

let y = 43`;
    const expected = `
This is a markdown comment

\`\`\`fs
let y = 43
\`\`\`
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("show instruction make the code included in the output after an hide instruction", (t) => {
    const input = `

(*** hide ***)
let x = 42

(*** show ***)
let y = 43`;
    const expected = `\`\`\`fs
let y = 43
\`\`\`
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("show instruction before an F# code without an hide instruction just include the code as normal", (t) => {
    const input = `

(*** show ***)
let x = 42`;
    const expected = `\`\`\`fs
let x = 42
\`\`\`
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});

test("check that mixing the rules works", (t) => {
    const input = `
let add (a : int) (b : int) = a + b

(*** hide ***)

let \`\`you should not see me\`\` = 42

(*** show ***)

let \`\`you should see me\`\` = 42

(**
# This should be markdown content
*)

// This code should be highlighted
let moreCode = 54

(** This text **should** be included
*)
`;
    const expected = `\`\`\`fs
let add (a : int) (b : int) = a + b
\`\`\`

\`\`\`fs
let \`\`you should see me\`\` = 42
\`\`\`


# This should be markdown content

\`\`\`fs
// This code should be highlighted
let moreCode = 54
\`\`\`

This text **should** be included
`;
    const actual = transformFsxToMarkdown(input);
    t.deepEqual(actual, expected);
});
