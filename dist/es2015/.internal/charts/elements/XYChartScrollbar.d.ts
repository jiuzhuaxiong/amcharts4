/**
 * A module with functionality for buildin a scrollbar with an XY graph in it.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Scrollbar, IScrollbarProperties, IScrollbarAdapters, IScrollbarEvents } from "../../core/elements/Scrollbar";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { List, IListEvents } from "../../core/utils/List";
import { XYSeries } from "../series/XYSeries";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { XYChart } from "../types/XYChart";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[XYChartScrollbar]].
 */
export interface IXYChartScrollbarProperties extends IScrollbarProperties {
}
/**
 * Defines events for [[XYChartScrollbar]].
 */
export interface IXYChartScrollbarEvents extends IScrollbarEvents {
}
/**
 * Defines adapters for [[XYChartScrollbar]].
 *
 * @see {@link Adapter}
 */
export interface IXYChartScrollbarAdapters extends IScrollbarAdapters, IXYChartScrollbarProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A special version of the Scrollbar that has an XY chart in it.
 *
 * Used mainly as an advanced scrollbar with a preview for other XY charts.
 *
 * However, can be used as standalone element.
 *
 * @see {@link IXYChartScrollbarEvents} for a list of available events
 * @see {@link IXYChartScrollbarAdapters} for a list of available Adapters
 * @important
 */
export declare class XYChartScrollbar extends Scrollbar {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IXYChartScrollbarProperties}
     */
    _properties: IXYChartScrollbarProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IXYChartScrollbarAdapters}
     */
    _adapter: IXYChartScrollbarAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<XYChartScrollbar, IXYChartScrollbarEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<XYChartScrollbar, IXYChartScrollbarEvents>>;
    /**
     * An [[XYSeries]] used to draw a graph on the Scrollbar.
     *
     * @type {List<XYSeries>}
     */
    protected _series: List<XYSeries>;
    /**
     * A chart element Scrollbar is for.
     *
     * @type {MutableValueDisposer}
     */
    protected _chart: MutableValueDisposer<XYChart>;
    /**
     * A chart instance that shows mini-chart within Scrollbar.
     *
     * @type {XYChart}
     */
    protected _scrollbarChart: XYChart;
    /**
     * [_unselectedOverlay description]
     *
     * @todo Description
     * @type {Sprite}
     */
    protected _unselectedOverlay: Sprite;
    /**
     * Constructor
     */
    constructor();
    /**
     * A list of series that are used to draw graph(s) on the scrollbar.
     *
     * @readonly
     * @return {List<XYSeries>} Series
     */
    readonly series: List<XYSeries>;
    /**
     * Decorates a new series when they are pushed into a `series` list.
     *
     * @param {IListEvents<XYSeries>["insert"]} event Event
     */
    protected handleSeriesAdded(event: IListEvents<XYSeries>["insert"]): void;
    /**
     * @ignore
     */
    protected updateByOrientation(): void;
    /**
     * Cleans up after series are removed from Scrollbar.
     *
     * @param {IListEvents<XYSeries>["remove"]}  event  Event
     */
    protected handleSeriesRemoved(event: IListEvents<XYSeries>["remove"]): void;
    /**
     * A chart element that is used to display graphs in the Scrollbar.
     *
     * This is not the same as `chart`. It's a totally independent instance of
     * [[XYChart]] with separate config, series, etc.
     *
     * It can be configured just like any other [[XYChart]].
     *
     * @readonly
     * @return {XYChart} Scrollbar's internal chart
     */
    readonly scrollbarChart: XYChart;
    /**
     * @return {XYChart} Chart
     */
    /**
     * A chart that Scrollbar belongs to.
     *
     * @param {XYChart} chart  Chart
     */
    chart: XYChart;
    /**
     * Updates Scrollbar's internal chart's data when the main chart's data
     * changes.
     *
     * @ignore Exclude from docs
     */
    handleDataChanged(): void;
    /**
     * Zooms out all axes on the internal chart.
     */
    protected zoomOutAxes(): void;
    /**
     * Updates scrollbar thumb.
     */
    protected updateThumb(): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
