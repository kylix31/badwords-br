const localList = require("./lang.json").words;
const baseList = require("badwords-list").array;

class Filter {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */
  constructor(options = {}) {
    Object.assign(this, {
      list: this.#filteredTexts(
        (options.emptyList && []) ||
          Array.prototype.concat.apply(localList, [
            baseList,
            options.list || [],
          ])
      ),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\b/,
      placeHolder: options.placeHolder || "*",
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g,
    });
  }

  /** Remove special characters main function (for brazilian purposes)
   * @param {string} text - Text to remove special characters
   */
  #removeSpecials(text) {
    text = text.replace(/[ÀÁÂÃÄÅ]/, "A");
    text = text.replace(/[àáâãäå]/, "a");
    text = text.replace(/[ÈÉÊËÂ]/, "E");
    text = text.replace(/[èéêẽ]/, "e");
    text = text.replace(/[ÌÍÎĨ]/, "I");
    text = text.replace(/[ìíîî]/, "i");
    text = text.replace(/[ÒÓÔÕ]/, "O");
    text = text.replace(/[òóôõ]/, "o");
    text = text.replace(/[ÙÚÛŨ]/, "U");
    text = text.replace(/[ùúûũ]/, "u");
    text = text.replace(/[Ç]/, "C");
    text = text.replace(/[ç]/, "c");

    return text;
  }

  /** Remove accentuation from a string or array of strings
   * @param {string|array} text - String or array of strings to remove accents from.
   */
  #filteredTexts(texts) {
    if (typeof texts === "string") {
      return this.#removeSpecials(texts);
    }

    if (Array.isArray(texts)) {
      return (texts = texts.map((text) => this.#removeSpecials(text)));
    }

    throw new Error("Invalid argument type in filteredTexts");
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return (
      this.list.filter((word) => {
        if (this.exclude.includes(word.toLowerCase())) {
          return false;
        }

        const wordExp = new RegExp(
          `/*${word.replace(/(\W)/g, "\\$1")}/*`,
          "gi"
        );

        return wordExp.test(this.#filteredTexts(this.#filteredTexts(string)));
      }).length > 0 || false
    );
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    return string
      .replace(this.regex, "")
      .replace(this.replaceRegex, this.placeHolder);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    return string
      .split(this.splitRegex)
      .map((word) => {
        return this.isProfane(word) ? this.replaceWord(word) : word;
      })
      .join(this.splitRegex.exec(string)[0]);
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    let words = this.#filteredTexts(Array.from(arguments));

    this.list.push(...words);

    words
      .map((word) => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(
      ...Array.from(arguments).map((word) => word.toLowerCase())
    );
  }
}

module.exports = Filter;
