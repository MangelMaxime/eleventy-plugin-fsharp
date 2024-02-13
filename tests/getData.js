/**
 * @type {import("ava").TestFn<T>}
 */
import test from "ava";
import getData from "../src/getData.js";

test("getData works with F# literate style of front matter", (t) => {
    const data = getData("tests/fixtures/getData.fsx");
    const expected = {
        title: "getData.fsx",
        summary: "A script that gets data from a web service.",
        tags: ["fsharp", "web"]
    };

    t.deepEqual(data, expected);
});
