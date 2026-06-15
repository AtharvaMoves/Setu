import assert from "node:assert/strict";
import test from "node:test";
import { stripMdxToText } from "../src/utils/ai-text-stripper.ts";

test("preserves Markdown and fenced code", () => {
  const source = "# Heading\n\n```html\n<div>Example</div>\n```";
  assert.equal(stripMdxToText(source), source);
});

test("removes quiz answer data", () => {
  const source =
    "# Check\n\n<Quiz title=\"Test\" questions={[{ question: 'Q', options: ['A'], answer: 0 }]} />";
  const result = stripMdxToText(source);
  assert.equal(result, "# Check");
  assert.equal(result.includes("answer"), false);
});

test("extracts playground source", () => {
  const source =
    '<CodePlayground code={`<h1>Hello</h1>`} title="index.html" />';
  assert.equal(stripMdxToText(source), "```html\n<h1>Hello</h1>\n```");
});
