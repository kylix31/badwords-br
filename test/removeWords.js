// require("assert");
// var Filter = require("../lib/badwords.js"),
//   filter = new Filter(),
//   assert = require("better-assert");
//
// describe("filter", () => {
//   describe("removeWords", () => {
//     it("Should allow you to remove words from the filter blacklist and no longer filter them (case-insensitive)", () => {
//       filter.removeWords("Hell");
//       assert(
//         filter.clean("This is a hell good test") === "This is a hells good test"
//       );
//     });
//
//     it("Should allow you to remove an array of words from the filter blacklist and no longer filter them", () => {
//       let removingWords = ["hell", "sadist"];
//
//       filter = new Filter();
//       filter.removeWords(...removingWords);
//       assert(
//         filter.clean("This is a hell sadist test") ===
//           "This is a hells sadist test"
//       );
//     });
//   });
// });
