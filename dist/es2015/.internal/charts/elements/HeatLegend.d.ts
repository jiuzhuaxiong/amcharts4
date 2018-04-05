/**
 * HeatLegend module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { Series } from "../series/Series";
import { Color } from "../../core/utils/Color";
import { ListTemplate } from "../../core/utils/List";
import { ValueAxis } from "../../charts/axes/ValueAxis";
/**
 * Defines an interface for a series which can be used by Heat legend. Such a series must have min, max, minColor and maxColor properties.
 *
 */
export interface IHeatLegendSeries extends Series {
    minValue?: number;
    maxValue?: number;
    minColor?: Color;
    maxColor?: Color;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[HeatLegend]].
 */
export interface IHeatLegendProperties extends IContainerProperties {
    /**
     * Minimum color
     *
     * @todo Description
     * @type {color}
     */
    minColor?: Color;
    /**
     * Minimum value
     *
     * @todo Description
     * @type {number}
     */
    minValue?: number;
    /**
     * Maximum value
     *
     * @todo Description
     * @type {number}
     */
    maxValue?: number;
    /**
     * Maximum color
     *
     * @todo Description
     * @type {color}
     */
    maxColor?: Color;
    /**
     * Number of markers (steps)
     *
     * @todo Description
     * @type {number}
     */
    markerCount?: number;
    /**
     * Orientation
     *
     * @todo Description
     * @type {"horizontal" | "vertical"}
     */
    orientation?: "horizontal" | "vertical";
}
/**
 * Defines events for [[HeatLegend]].
 */
export interface IHeatLegendEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[HeatLegend]].
 *
 * @see {@link Adapter}
 */
export interface IHeatLegendAdapters extends IContainerAdapters, IHeatLegendProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link IHeatLegendEvents} for a list of available events
 * @see {@link IHeatLegendAdapters} for a list of available Adapters
 * @important
 */
export declare class HeatLegend extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IHeatLegendProperties}
     */
    _properties: IHeatLegendProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IHeatLegendAdapters}
     */
    _adapter: IHeatLegendAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<HeatLegend, IHeatLegendEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<HeatLegend, IHeatLegendEvents>>;
    /**
     * List of heat legend markers (color step rectangles).
     *
     * @type {ListTemplate<Container>}
     */
    markers: ListTemplate<Container>;
    /**
     * Container which holds markers
     *
     * @type {Container}
     */
    markerContainer: Container;
    /**
     * Value axis of a heat legend
     * @ignore
     * @type {ValueAxis}
     */
    protected _valueAxis: ValueAxis;
    /**
     * Series of a heat legend
     * @ignore
     * @type {IHeatLegendSeries}
     */
    protected _series: IHeatLegendSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Returns minColor value
     * @return {Color}
     */
    /**
     * Min color of a heat legend. If a series is set for the legend, minColor is taken from series.
     *
     * @param {Color}
     */
    minColor: Color;
    /**
     * Returns maxColor value
     * @return {Color}
     */
    /**
     * Max color of a heat legend. If a series is set for the legend, maxColor is taken from series.
     *
     * @param {Color}
     */
    maxColor: Color;
    /**
     * Returns number of color squares (markers).
     * @return {number}
     */
    /**
     * Number of color squares (markers) in the heat legend. If only 1 marker is used, it will be filled with gradient.
     *
     * @param {number}
     */
    markerCount: number;
    /**
     * Returns minimum value of heat legend.
     * @return {number}
     */
    /**
     * Minimum value of heat legend's value axis. If a series is set for the legend, min is taken from series.
     *
     * @param {number}
     */
    minValue: number;
    /**
     * Returns maximum value of heat legend.
     * @return {number}
     */
    /**
     * Maximum value of heat legend's value axis. If a series is set for the legend, max is taken from series.
     *
     * @param {number}
     */
    maxValue: number;
    /**
     * Returns orientation value.
     *
     * @return {"horizontal" | "vertical"}
     */
    /**
    * Heat legend orientation. Note, if you change orientation of a heat legend, you must set value axis renderer properties after that, as with orientation renderer changes.
    *
    * @param {"horizontal" | "vertical"}
    */
    orientation: "horizontal" | "vertical";
    /**
     * Returns valueAxis value.
     * @return {ValueAxis}
     */
    /**
     * Sets a value axis of heat legend. Value axis for heat legend is created automatically.
     * @param {ValueAxis}
     */
    valueAxis: ValueAxis;
    /**
     * Returns series value.
     * @return {IHeatLegendSeries}
     */
    /**
     * You can set series for heat legend. It will take min, max, minColor and maxColor values from this series.
     * @param {IHeatLegendSeries} series
     */
    series: IHeatLegendSeries;
    /**
     * Updates min/max of value axis.
     * @ignore
     */
    protected updateMinMax(min: number, max: number): void;
}
