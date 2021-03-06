/**
 * Serial chart module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, ChartDataItem } from "../Chart";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Series } from "../series/Series";
import { percent } from "../../core/utils/Percent";
import { ColorSet } from "../../core/utils/ColorSet";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[SerialChart]].
 *
 * @see {@link DataItem}
 */
var SerialChartDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(SerialChartDataItem, _super);
    /**
     * Constructor
     */
    function SerialChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "SerialChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return SerialChartDataItem;
}(ChartDataItem));
export { SerialChartDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all series-based charts, like XY, Pie, etc.
 *
 * Is not useful on its own.
 *
 * @see {@link ISerialChartEvents} for a list of available Events
 * @see {@link ISerialChartAdapters} for a list of available Adapters
 */
var SerialChart = /** @class */ (function (_super) {
    tslib_1.__extends(SerialChart, _super);
    /**
     * Constructor
     */
    function SerialChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "SerialChart";
        _this.colors = new ColorSet();
        // Create a container for series
        var seriesContainer = _this.chartContainer.createChild(Container);
        seriesContainer.shouldClone = false;
        seriesContainer.width = percent(100);
        seriesContainer.height = percent(100);
        seriesContainer.isMeasured = false;
        seriesContainer.layout = "none";
        seriesContainer.zIndex = 2;
        _this.seriesContainer = seriesContainer;
        // Create a container for bullets
        var bulletsContainer = _this.chartContainer.createChild(Container);
        bulletsContainer.shouldClone = false;
        bulletsContainer.width = percent(100);
        bulletsContainer.height = percent(100);
        bulletsContainer.isMeasured = false;
        bulletsContainer.zIndex = 3;
        bulletsContainer.layout = "none";
        _this.bulletsContainer = bulletsContainer;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    SerialChart.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.colors) {
            this.colors.dispose();
        }
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor
     */
    SerialChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Serial chart");
        }
    };
    Object.defineProperty(SerialChart.prototype, "series", {
        /**
         * A list of chart's series.
         *
         * @return {List} Chart's series
         */
        get: function () {
            var _this = this;
            if (!this._series) {
                this._series = new ListTemplate(this.createSeries());
                this._series.events.on("inserted", function (event) {
                    _this.handleSeriesAdded(event);
                });
                this._series.events.on("removed", function (event) {
                    _this.dataUsers.removeValue(event.oldValue);
                    _this.dataUsers.each(function (dataUser) {
                        dataUser.invalidateDataItems();
                    });
                    _this.feedLegend();
                });
                this._disposers.push(new ListDisposer(this._series));
                this._disposers.push(this._series.template);
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new [[Series]] object with required parameters when it is
     * added to the chart.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Series>["inserted"]}  event  Event
     */
    SerialChart.prototype.handleSeriesAdded = function (event) {
        var series = event.newValue;
        series.chart = this;
        series.parent = this.seriesContainer;
        series.bulletsContainer.parent = this.bulletsContainer;
        this._dataUsers.moveValue(series);
        this.feedLegend();
    };
    /**
     * Setups the legend to use the chart's data.
     */
    SerialChart.prototype.feedLegend = function () {
        var legend = this.legend;
        if (legend) {
            var legendData_1 = [];
            $iter.each(this.series.iterator(), function (series) {
                legendData_1.push(series);
            });
            legend.dataFields.name = "name";
            legend.itemContainers.template.propertyFields.disabled = "hiddenInLegend";
            legend.data = legendData_1;
        }
    };
    /**
     * Creates and returns a new Series, suitable for this chart type.
     *
     * @return {this} New series
     */
    SerialChart.prototype.createSeries = function () {
        return new Series();
    };
    Object.defineProperty(SerialChart.prototype, "colors", {
        /**
         * @return {ColorSet} Color list
         */
        get: function () {
            return this.getPropertyValue("colors");
        },
        /**
         * Chart's color list.
         *
         * This list can be used by a number of serial items, like applying a new
         * color for each Series added. Or, applying a new color for each slice
         * of a Pie chart.
         *
         * Please see [[ColorSet]] for information on how you can set up to generate
         * unique colors.
         *
         * A theme you are using may override default pre-defined colors.
         *
         * @param {ColorSet} value Color list
         */
        set: function (value) {
            this.setPropertyValue("colors", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all parameters from another [[SerialChart]].
     *
     * @param {SerialChart} source Source SerialChart
     */
    SerialChart.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.series.copyFrom(source.series);
    };
    return SerialChart;
}(Chart));
export { SerialChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SerialChart"] = SerialChart;
//# sourceMappingURL=SerialChart.js.map