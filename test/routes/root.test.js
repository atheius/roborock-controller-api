"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("default root route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/",
  });
  t.same(res.payload, "Roborock controller API");
});
