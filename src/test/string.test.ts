import assert from "node:assert/strict";
import { test } from "node:test";
import { camelCaseDivider, capitalize, cleanString, cn, concat } from "../lib";

test("cn joins class names with spaces, skipping falsy values", () => {
  assert.equal(cn("a", false, undefined, "b"), "a b");
  assert.equal(cn("a", "", null, "b"), "a b");
  assert.equal(cn("btn", { active: true, disabled: false, lg: 1 }), "btn active lg");
  assert.equal(cn(["a", ["b", null]], { d: undefined }), "a b");
  assert.equal(cn(), "");
});

test("concat joins only string parts without separator", () => {
  assert.equal(concat("a", null, true, "b"), "ab");
  assert.equal(concat("/users/", false), "/users/");
  assert.equal(concat(), "");
});

test("capitalize first letter or every word", () => {
  assert.equal(capitalize("hello world"), "Hello world");
  assert.equal(capitalize("hello world", true), "Hello World");
  assert.equal(capitalize(""), "");

  const all: boolean = true;
  assert.equal(capitalize("a b", all), "A B");

  // Literal input keeps a literal return type
  const cap: "Hello" = capitalize("hello");
  assert.equal(cap, "Hello");
});

test("cleanString trims and collapses whitespace", () => {
  assert.equal(cleanString("  a   b \n c "), "a b c");
  assert.equal(cleanString(""), "");
});

test("camelCaseDivider splits camelCase into words", () => {
  assert.equal(camelCaseDivider("helloWorldAgain"), "hello world again");
  assert.equal(camelCaseDivider("helloWorldAgain", true), "Hello world again");
  assert.equal(camelCaseDivider("HelloBigWorld", true, true), "Hello Big World");
  assert.equal(camelCaseDivider("  helloWorld "), "hello world");
});
