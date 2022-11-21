(***
title: This is the title of the script
description: This is a post on My Blog about agile frameworks.
layout: layouts/base.njk
***)

// This code should be highlighted
let add (a : int) (b : int) = a + b

(*** hide ***)

let ``you should not see me`` = 42

(*** show ***)

let ``you should see me`` = 42

(**

# This should be markdown content

With [a link](https://www.google.com)

*)

// This code should be highlighted
let moreCode = 54

(** This text **should** be included

And you should see a date: {{ null | now }}

This means that nunjucks compilation is working
*)
