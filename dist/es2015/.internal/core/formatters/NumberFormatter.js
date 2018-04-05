/**
 * Number formatting-related functionality.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Language } from "../utils/Language";
import { BaseObject } from "../Base";
import { system } from "../System";
import * as $strings from "../utils/Strings";
import * as $object from "../utils/Object";
import * as $utils from "../utils/Utils";
/**
 * NumberFormatter class. Formats numbers according to specified formats.
 *
 * @todo Apply translations to suffixes/prefixes
 */
var NumberFormatter = /** @class */ (function (_super) {
    __extends(NumberFormatter, _super);
    /**
     * Constructor
     */
    function NumberFormatter() {
        var _this = _super.call(this) || this;
        /**
         * A base value for negative numbers. Will treat all numbers below this value
         * as negative numbers.
         *
         * @type {number}
         */
        _this._negativeBase = 0;
        /**
         * Holds number format.
         *
         * @type {string}
         * @default #,###.#####
         */
        _this._numberFormat = "#,###.#####";
        /**
         * Output format to produce. If the format calls for applying color to the
         * formatted value, this setting will determine what markup to use: SVG or
         * HTML.
         *
         * Available options: svg, html.
         *
         * @default "svg"
         * @type {string}
         */
        _this._outputFormat = "svg";
        /**
         * Holds big number prefixes to apply to numbers if `a` modifier is used in
         * format.
         *
         * @type {Array}
         */
        _this._bigNumberPrefixes = [
            { "number": 1e+3, "suffix": "K" },
            { "number": 1e+6, "suffix": "M" },
            { "number": 1e+9, "suffix": "G" },
            { "number": 1e+12, "suffix": "T" },
            { "number": 1e+15, "suffix": "P" },
            { "number": 1e+18, "suffix": "E" },
            { "number": 1e+21, "suffix": "Z" },
            { "number": 1e+24, "suffix": "Y" }
        ];
        /**
         * Holds small number prefixes to apply to numbers if `a` modifier is used in
         * format.
         *
         * @type {Array}
         */
        _this._smallNumberPrefixes = [
            { "number": 1e-24, "suffix": "y" },
            { "number": 1e-21, "suffix": "z" },
            { "number": 1e-18, "suffix": "a" },
            { "number": 1e-15, "suffix": "f" },
            { "number": 1e-12, "suffix": "p" },
            { "number": 1e-9, "suffix": "n" },
            { "number": 1e-6, "suffix": "μ" },
            { "number": 1e-3, "suffix": "m" }
        ];
        /**
         * Holds prefixes to apply to data size numbers if `b` modifier is used in
         * format.
         *
         * @type {Array}
         */
        _this._bytePrefixes = [
            { "number": 0, "suffix": "B" },
            { "number": 1024, "suffix": "KB" },
            { "number": 1048576, "suffix": "MB" },
            { "number": 1073741824, "suffix": "GB" },
            { "number": 1099511627776, "suffix": "TB" },
            { "number": 1125899906842624, "suffix": "PB" }
        ];
        _this.className = "NumberFormatter";
        _this.applyTheme();
        return _this;
    }
    /**
     * Formats the number according to specific format.
     *
     * @param  {number | string}  value   Value to format
     * @param  {string}           format  Format to apply
     * @return {string}                   Formatted number
     */
    NumberFormatter.prototype.format = function (value, format) {
        // no language?
        if (!this.language) {
            if (this.sprite) {
                this.language = this.sprite.language;
            }
            else {
                this.language = new Language;
            }
        }
        // no format passed in or "Number"
        if (typeof format === "undefined" || format.toLowerCase() === "number") {
            format = this._numberFormat;
        }
        // Clean format
        format = $utils.cleanFormat(format);
        // Get format info (it will also deal with parser caching)
        var info = this.parseFormat(format);
        // cast to number just in case
        // TODO: maybe use better casting
        var source = Number(value);
        // format and replace the number
        var details;
        if (source > this._negativeBase) {
            details = info.positive;
        }
        else if (source < this._negativeBase) {
            details = info.negative;
        }
        else {
            details = info.zero;
        }
        // Format
        var formatted = details.template.split($strings.PLACEHOLDER).join(this.applyFormat(source, details));
        return formatted;
    };
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param {string} format Format string, i.e. "#,###.00"
     */
    NumberFormatter.prototype.parseFormat = function (format) {
        var _this = this;
        // check cache
        if (typeof (this.getCache(format)) !== "undefined") {
            return this.getCache(format);
        }
        // init format parse info holder
        var info = {
            "positive": {
                "thousands": {
                    "active": -1,
                    "passive": -1,
                    "interval": -1,
                    "separator": this.language.translateEmpty("_thousandSeparator")
                },
                "decimals": {
                    "active": -1,
                    "passive": -1,
                    "separator": this.language.translateEmpty("_decimalSeparator")
                },
                "template": "",
                "source": "",
                "parsed": false
            },
            "negative": {
                "thousands": {
                    "active": -1,
                    "passive": -1,
                    "interval": -1,
                    "separator": this.language.translateEmpty("_thousandSeparator")
                },
                "decimals": {
                    "active": -1,
                    "passive": -1,
                    "separator": this.language.translateEmpty("_decimalSeparator")
                },
                "template": "",
                "source": "",
                "parsed": false
            },
            "zero": {
                "thousands": {
                    "active": -1,
                    "passive": -1,
                    "interval": -1,
                    "separator": this.language.translateEmpty("_thousandSeparator")
                },
                "decimals": {
                    "active": -1,
                    "passive": -1,
                    "separator": this.language.translateEmpty("_decimalSeparator")
                },
                "template": "",
                "source": "",
                "parsed": false
            }
        };
        // Escape double vertical bars (that mean display one vertical bar)
        format = format.replace("||", $strings.PLACEHOLDER2);
        // Split it up and deal with different formats
        var parts = format.split("|");
        info.positive.source = parts[0];
        if (typeof parts[2] === "undefined") {
            info.zero = info.positive;
        }
        else {
            info.zero.source = parts[2];
        }
        if (typeof parts[1] === "undefined") {
            info.negative = info.positive;
        }
        else {
            info.negative.source = parts[1];
        }
        // Parse each
        $object.each(info, function (part, item) {
            // Already parsed
            if (item.parsed) {
                return;
            }
            // Check cached
            if (typeof _this.getCache(item.source) !== "undefined") {
                info[part] = _this.getCache(item.source);
                return;
            }
            // Begin parsing
            var partFormat = item.source;
            // Just "Number"?
            if (partFormat.toLowerCase() === "number") {
                partFormat = _this._numberFormat;
            }
            // Let TextFormatter split into chunks
            var chunks = system.textFormatter.chunk(partFormat, true);
            for (var i = 0; i < chunks.length; i++) {
                var chunk = chunks[i];
                // replace back double vertical bar
                chunk.text = chunk.text.replace($strings.PLACEHOLDER2, "|");
                if (chunk.type === "value") {
                    // Parse format
                    // Look for codes
                    var matches = [];
                    if (matches = chunk.text.match(/[#0.,]+[ ]?[abesABES%]?[abesABES‰]?/)) {
                        if (matches === null || matches[0] === "") {
                            // no codes here - assume string
                            // nothing to do here
                            item.template += chunk.text;
                        }
                        else {
                            // look for the format modifiers at the end
                            var mods = [];
                            if (mods = matches[0].match(/[abesABES%‰]{2}|[abesABES%‰]{1}$/)) {
                                item.mod = mods[0].toLowerCase();
                                item.modSpacing = matches[0].match(/[ ]{1}[abesABES%‰]{1}$/) ? true : false;
                            }
                            // break the format up
                            var a = matches[0].split(".");
                            // Deal with thousands
                            if (a[0] === "") {
                                // No directives for thousands
                                // Leave default settings (no formatting)
                            }
                            else {
                                // Counts
                                item.thousands.active = (a[0].match(/0/g) || []).length;
                                item.thousands.passive = (a[0].match(/\#/g) || []).length + item.thousands.active;
                                // Separator interval
                                var b = a[0].split(",");
                                if (b.length === 1) {
                                    // No thousands separators
                                    // Do nothing
                                }
                                else {
                                    // Use length fo the last chunk as thousands length
                                    item.thousands.interval = b.pop().length;
                                    if (item.thousands.interval === 0)
                                        item.thousands.interval = -1;
                                }
                            }
                            // Deal with decimals
                            if (typeof (a[1]) === "undefined") {
                                // No directives for decimals
                                // Leave at defaults (no formatting)
                            }
                            else {
                                // Counts
                                item.decimals.active = (a[1].match(/0/g) || []).length;
                                item.decimals.passive = (a[1].match(/\#/g) || []).length + item.decimals.active;
                            }
                            // Add special code to template
                            item.template += chunk.text.split(matches[0]).join($strings.PLACEHOLDER);
                        }
                    }
                }
                else {
                    // Quoted string - take it as it is
                    item.template += chunk.text;
                }
            }
            // Apply style formatting
            //item.template = system.textFormatter.format(item.template, this.outputFormat);
            // Save cache
            _this.setCache(item.source, item);
            // Mark this as parsed
            item.parsed = true;
        });
        // Save cache (the whole thing)
        this.setCache(format, info);
        return info;
    };
    /**
     * Applies parsed format to a numeric value.
     *
     * @param  {number}  value    Value
     * @param  {any}     details  Parsed format as returned by {parseFormat}
     * @return {string}          Formatted number
     */
    NumberFormatter.prototype.applyFormat = function (value, details) {
        // Use absolute values
        var negative = value < 0;
        value = Math.abs(value);
        // Recalculate according to modifier
        var prefix = "", suffix = "";
        var mods = details.mod ? details.mod.split("") : [];
        if (mods.indexOf("b") !== -1) {
            var a_1 = this.applyPrefix(value, this._bytePrefixes);
            value = a_1[0];
            prefix = a_1[1];
            suffix = a_1[2];
            if (details.modSpacing) {
                suffix = " " + suffix;
            }
        }
        else if (mods.indexOf("a") !== -1) {
            var a_2 = this.applyPrefix(value, value < 1.00 ? this._smallNumberPrefixes : this._bigNumberPrefixes);
            value = a_2[0];
            prefix = a_2[1];
            suffix = a_2[2];
            if (details.modSpacing) {
                suffix = " " + suffix;
            }
        }
        else if (mods.indexOf("%") !== -1) {
            value *= 100;
            suffix = "%";
        }
        else if (mods.indexOf("‰") !== -1) {
            value *= 1000;
            suffix = "‰";
        }
        // Round to passive
        if (mods.indexOf("e") !== -1) {
            // convert the value to exponential
            var exp = void 0;
            if (details.decimals.passive >= 0) {
                exp = value.toExponential(details.decimals.passive).split("e");
            }
            else {
                exp = value.toExponential().split("e");
            }
            value = Number(exp[0]);
            suffix = "e" + exp[1];
            if (details.modSpacing) {
                suffix = " " + suffix;
            }
        }
        else if (details.decimals.passive === 0) {
            value = Math.round(value);
        }
        else if (details.decimals.passive > 0) {
            var d = Math.pow(10, details.decimals.passive);
            value = Math.round(value * d) / d;
        }
        // Init return value
        var res = "";
        // Calc integer and decimal parts
        var a = $utils.numberToString(value).split(".");
        // Format integers
        var ints = a[0];
        // Pad integers to active length
        if (ints.length < details.thousands.active) {
            ints = Array(details.thousands.active - ints.length + 1).join("0") + ints;
        }
        // Insert thousands separators
        if (details.thousands.interval > 0) {
            var ip = [];
            var intsr = ints.split("").reverse().join("");
            for (var i = 0; i <= ints.length; i += details.thousands.interval) {
                var c = intsr.substr(i, details.thousands.interval).split("").reverse().join("");
                if (c !== "") {
                    ip.unshift(c);
                }
            }
            ints = ip.join(details.thousands.separator);
        }
        // Add integers
        res += ints;
        // Add decimals
        if (a.length === 1) {
            a.push("");
        }
        var decs = a[1];
        // Fill zeros?
        if (decs.length < details.decimals.active) {
            decs += Array(details.decimals.active - decs.length + 1).join("0");
        }
        if (decs !== "") {
            res += details.decimals.separator + decs;
        }
        // Can't have empty return value
        if (res === "") {
            res = "0";
        }
        // Add minus sign back
        if (negative && (mods.indexOf("s") === -1)) {
            res = "-" + res;
        }
        // Add suffixes/prefixes
        if (prefix) {
            res = prefix + res;
        }
        if (suffix) {
            res += suffix;
        }
        return res;
    };
    /**
     * Chooses appropriate prefix and suffix based on the passed in rules.
     *
     * @param  {number}  value     Value
     * @param  {any[]}   prefixes  Prefix array
     * @return {any}               Result
     */
    NumberFormatter.prototype.applyPrefix = function (value, prefixes) {
        var newvalue = value, prefix = "", suffix = "";
        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i].number <= value) {
                if (prefixes[i].number === 0) {
                    newvalue = 0;
                }
                else {
                    newvalue = value / prefixes[i].number;
                }
                prefix = prefixes[i].prefix;
                suffix = prefixes[i].suffix;
            }
        }
        return [newvalue, prefix, suffix];
    };
    /**
     * Invalidates the parent [[Sprite]] object.
     */
    NumberFormatter.prototype.invalidateSprite = function () {
        if (this.sprite) {
            this.sprite.invalidate();
        }
    };
    Object.defineProperty(NumberFormatter.prototype, "numberFormat", {
        /**
         * @return {string} A format to use for number formatting
         */
        get: function () {
            return this._numberFormat;
        },
        /**
         * Number format.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
         * @param {string}  format  A format to use for number formatting
         */
        set: function (format) {
            this._numberFormat = format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberFormatter.prototype, "bigNumberPrefixes", {
        /**
         * @return {any[]} Prefixes for big numbers
         */
        get: function () {
            return this._bigNumberPrefixes;
        },
        /**
         * Prefixes for big numbers.
         *
         * It's an array of objects of number/prefix pairs.
         *
         * ```JSON
         * [
         *   { "number": 1e+3, "suffix": "K" },
         *   { "number": 1e+6, "suffix": "M" },
         *   { "number": 1e+9, "suffix": "G" },
         *   { "number": 1e+12, "suffix": "T" },
         *   { "number": 1e+15, "suffix": "P" },
         *   { "number": 1e+18, "suffix": "E" },
         *   { "number": 1e+21, "suffix": "Z" },
         *   { "number": 1e+24, "suffix": "Y" }
         * ]
         * ```
         *
         * If the number is bigger than the `number` ir will be converted to the
         * appropriate bigger number with prefix.
         *
         * E.g. as per above `1500` will be converted to `1.5K`.
         *
         * Please note that for this transformation to be enabled, you need to
         * enable it specific modifier in your format setting.
         *
         * The modifier for big/small number modification is "a":
         *
         * ```Text
         * {myfield.formatNumber("#,###.00a")}
         * ```
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
         * @param {any[]}  prefixes  Prefixes for big numbers
         */
        set: function (prefixes) {
            this._bigNumberPrefixes = prefixes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberFormatter.prototype, "smallNumberPrefixes", {
        /**
         * @return {any[]} Prefixes for small numbers
         */
        get: function () {
            return this._smallNumberPrefixes;
        },
        /**
         * Prefixes for big numbers.
         *
         * It's an array of objects of number/prefix pairs.
         *
         * ```JSON
         * [
         *   { "number": 1e-24, "suffix": "y" },
         *   { "number": 1e-21, "suffix": "z" },
         *   { "number": 1e-18, "suffix": "a" },
         *   { "number": 1e-15, "suffix": "f" },
         *   { "number": 1e-12, "suffix": "p" },
         *   { "number": 1e-9, "suffix": "n" },
         *   { "number": 1e-6, "suffix": "μ" },
         *   { "number": 1e-3, "suffix": "m" }
         * ]
         * ```
         *
         * If the number is smaller than the `number` ir will be converted to the
         * appropriate smaller number with prefix.
         *
         * E.g. as per above `0.0015` will be converted to `1.5m`.
         *
         * Please note that for this transformation to be enabled, you need to
         * enable it specific modifier in your format setting.
         *
         * The modifier for big/small number modification is "a":
         *
         * ```Text
         * {myfield.formatNumber("#,###.00a")}
         * ```
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
         * @param {any[]}  prefixes  Prefixes for small numbers
         */
        set: function (prefixes) {
            this._smallNumberPrefixes = prefixes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberFormatter.prototype, "bytePrefixes", {
        /**
         * @return {any[]} Prefixes for byte-size formatting
         */
        get: function () {
            return this._bytePrefixes;
        },
        /**
         * Basically the same as `bigNumberPrefixes`, except base for calculation
         * is not thousand but byte (1024).
         *
         * The modifier is "b".
         *
         *  ```Text
         * {myfield.formatNumber("#,###.00b")}
         * ```
         *
         * The above `2048` will change to `2K`.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/formatters/formatting-numbers/} Tutorial on number formatting
         * @param {any[]}  prefixes  Prefixes for byte-size formatting
         */
        set: function (prefixes) {
            this._bytePrefixes = prefixes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberFormatter.prototype, "outputFormat", {
        /**
         * @ignore Exclude from docs
         * @return {string} Output format
         */
        get: function () {
            return this._outputFormat;
        },
        /**
         * Ooutput format: "svg" or "html".
         *
         * @ignore Exclude from docs
         * @param {string}  value  Output format
         */
        set: function (outputFormat) {
            this._outputFormat = outputFormat.toLowerCase();
            this.invalidateSprite();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Input text
     * @return {string}        Escaped text
     */
    NumberFormatter.prototype.escape = function (text) {
        return text.replace("||", $strings.PLACEHOLDER2);
    };
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param  {string}  text  Escaped text
     * @return {string}        Unescaped text
     */
    NumberFormatter.prototype.unescape = function (text) {
        return text.replace($strings.PLACEHOLDER2, "|");
    };
    return NumberFormatter;
}(BaseObject));
export { NumberFormatter };
//# sourceMappingURL=NumberFormatter.js.map