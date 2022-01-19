require("assert");
var Filter = require("../lib/badwords.js"),
  filter = new Filter(),
  assert = require("better-assert");

describe("filter", function () {
  describe("addWords", function () {
    it("Should append words to the filter list.", function () {
      filter.addWords("dog", "go");
      assert(filter.clean("Go dog go") === "** *** **");
    });

    it("Should append words to the filter list with special characters.", function () {
      filter.addWords("dóg", "gó");
      assert(filter.clean("Go dog go") === "** *** **");
    });

    it("Should append words to the filter using an array", () => {
      let addWords = ["go", "dog"];
      filter = new Filter();
      filter.addWords(...addWords);
      assert(filter.clean("Go dog go") === "** *** **");
    });

    it("Should append words to the filter using an array with special characters", () => {
      let addWords = ["gó", "dóg"];
      filter = new Filter();
      filter.addWords(...addWords);
      assert(filter.clean("Go dog go") === "** *** **");
    });

    it("Should allow a list to be passed to the constructor", function () {
      filter = new Filter({
        list: ["dog"],
      });

      assert(filter.clean("Go dog go") === "Go *** go");
    });

    it("Should allow a list to be passed to the constructor with special characters", function () {
      filter = new Filter({
        list: ["dóg"],
      });

      assert(filter.clean("Go dog go") === "Go *** go");
    });
  });
});
