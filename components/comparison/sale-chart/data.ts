import { SaleData, CardModel } from "model/data_sport/card_sport";
import markerClusters from "highcharts/modules/marker-clusters";
import { formatNumber } from "utils/helper";
import moment from 'moment';
import { CalcMaLine, SaleChartState } from "components/cardDetail/BusinessLogic";
import { HelperSales, UtilsColorGrade } from "model/data_sport/pricing_grid";
import Highcharts from "highcharts/highstock";
import _ from "lodash";
import ImageDefault from "assets/images/card_default.png"
// import { checkImageExist } from "pages/card/components/sale_chart/data";
const ISSERVER = typeof window === "undefined";

if (!ISSERVER) {
    markerClusters(Highcharts);
}

/**Tham số nhận data để handle */
export interface ArgumentType {
    data: SaleChartState;
    cardId: string;
    cardCode: string;
    cardName: string;
    cardData: CardModel;
}

export interface TypeChart {
    'calcMaLine'?: number;
    'sale'?: number;
}

export interface ChartData {
    [key: string]: HoldChartData
}

//@ts-ignore
const lineTooltip = (tooltip, x = this.x, points = this.points) => {
    let s = `<b>${x}</b>`;
    //@ts-ignore
    points.forEach((point) =>
        s += `<br/>${point.series.name}: ${point.y}m`
    );

    return s;
}

export const navigatorHangle = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxjaXJjbGUgY3g9IjIyIiBjeT0iMjAiIHI9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyMiIgY3k9IjIwIiByPSIxNS41IiBzdHJva2U9IiNFOUVBRUQiLz4KPC9nPgo8bGluZSB4MT0iMTYuNSIgeTE9IjE0IiB4Mj0iMTYuNSIgeTI9IjI2IiBzdHJva2U9IiM2RDc1ODgiLz4KPGxpbmUgeDE9IjIyLjUiIHkxPSIxNCIgeDI9IjIyLjUiIHkyPSIyNiIgc3Ryb2tlPSIjNkQ3NTg4Ii8+CjxsaW5lIHgxPSIyOC41IiB5MT0iMTQiIHgyPSIyOC41IiB5Mj0iMjYiIHN0cm9rZT0iIzZENzU4OCIvPgo8L3N2Zz4K)'
    if (!ISSERVER) {
        //@ts-ignore
        Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
            return ['M', x, y + h / 2, 'L', x + w / 2, y, 'L', x + w, y + h / 2, 'L', x + w / 2, y + h, 'Z'];
        };
    }

//@ts-ignore
if (Highcharts.VMLRenderer) {
    //@ts-ignore
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}

const colorCluster = '#124DE3';

const getCluster = (fillColor: string = colorCluster) => {
    return {
        enabled: true,
        allowOverlap: true,
        animation: {
            duration: 450
        },
        // layoutAlgorithm: {
        //     type: 'grid',
        //     gridSize: 50
        // },
        // dataLabels: {
        //     style: {
        //         fontSize: '8px'
        //     },
        //     y: -1
        // },
        zones: [{
            from: 0,
            to: 10,
            marker: {
                fillColor: fillColor,
                radius: 13
            }
        },
        {
            from: 6,
            to: 15,
            marker: {
                fillColor: fillColor,
                radius: 15
            }
        }, {
            from: 16,
            to: 30,
            marker: {
                fillColor: fillColor,
                radius: 18
            }
        }, {
            from: 31,
            to: 40,
            marker: {
                fillColor: fillColor,
                radius: 20
            }
        }, {
            from: 41,
            to: 200,
            marker: {
                fillColor: fillColor,
                radius: 23
            }
        }, {
            from: 201,
            to: 99999,
            marker: {
                fillColor: fillColor,
                radius: 25
            }
        }]
    }
}

export const seriesConfig: {[key: string]: Highcharts.SeriesOptionsType} = {
    'calcMaLine': {
        type: "line",
        name: "MA(28) = 28 Day Moving Average",
        data: [],
        marker: {
            enabled: false
        },
        dataLabels: {
            borderColor: '#124DE3',
            backgroundColor: '#124DE3',
            borderRadius: 20,
            padding: 6,
            color:"#fff",
            allowOverlap: true,
            enabled: true,
            borderWidth: 0,
            className: 'label-fix',
            style: {
                fontWeight: '600'
            },
            // @ts-ignore
            formatter: function () {
                // @ts-ignore
                const data = this.series.groupedData || this.series.data
                // @ts-ignore
                const isLast = data.length && this.point.category === data[data.length -1].category
                // @ts-ignore
                return isLast ? this.series?.userOptions?.nameShow : null
            }
        },
        color: '#124DE3',
        shadow: true,
        borderRadius: 20,
        fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1.2 },
            stops: [
                //@ts-ignore
                [0, '#124DE333'],
                //@ts-ignore
                [1, '#124DE300']
            ]
        },
        stickyTracking: false,
        states: {
            hover: {
                animation: {
                    duration: 0
                }
            },
            inactive: {
                animation: {
                    duration: 0
                }
            },
            normal: {
                animation: false
            }
        },
        point: {
            events: {}
        },
        events: {},
        showInNavigator: true,
        enableMouseTracking: true,
    },
    'sale': {
        type: "scatter",
        name: "card sale",
        data: [],
        cluster: getCluster(),
        stickyTracking: false,
        states: {
            hover: {
                animation: {
                    duration: 0
                }
            },
            inactive: {
                animation: {
                    duration: 0
                }
            },
            normal: {
                animation: false
            }
        },
        point: {
            events: {}
        },
        events: {},
    }
};

export const listRecordValid: SaleData[] = [];

export const options: Highcharts.Options = {
    rangeSelector: {
        inputBoxBorderColor: '#DFDFDF',
        inputBoxWidth: 128,
        inputBoxHeight: 20,
        inputStyle: {
            color: '#18213A',
            fontSize: "14px"
        },
        labelStyle: {
            color: 'silver'
        },
        buttons: [{
            type: 'all',
            text: 'All',
            title: 'View all'
        }, {
            type: 'month',
            count: 1,
            text: '1m',
            title: 'View 1 month'
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'View 3 months'
        }, {
            type: 'month',
            count: 6,
            text: '6m',
            title: 'View 6 months'
        }, {
            type: 'year',
            count: 1,
            text: '1y',
            title: 'View 1 year'
        }, {
            type: 'ytd',
            text: 'YTD',
            title: 'View year to date'
        }]
    },
    xAxis: {
        type: 'datetime',
        crosshair: false
    },
    yAxis: {
        opposite: false,
        labels: {
            align: 'right',
        }
    },
    scrollbar: {
        enabled: false,
        height: 0,
        zIndex: -1,
        margin: 0,
        buttonArrowColor: 'transparent',
        buttonBackgroundColor: 'transparent',
        buttonBorderWidth: 0,
        trackBorderWidth: 0,
        trackBackgroundColor: 'transparent',
        rifleColor: 'transparent',
        barBorderWidth: 0,
        barBackgroundColor: 'transparent'
    },
    tooltip: {
        split: false,
        backgroundColor: '#FFFFFF',
        useHTML: true,
        headerFormat: '<div style="display: flex; padding: 10px;background: #FFF" class="tooltip-scatter">',
        borderRadius: 6,
        borderColor: "#E9EAED",
        hideDelay: 200,
        //@ts-ignore
        formatter: function (tooltip) {
            if (this.series.type === 'line') return false
             //@ts-ignore
            return tooltip.defaultFormatter.call(this, tooltip)
        },
        pointFormatter: function () {
            //@ts-ignore
            const { img, y, graded, x, color, colorText, cardName, id } = this;
            const uniqNumber = Math.floor(Math.random() * (999999 - 999 + 1) + 999)
            const classCustom = `tooltip-image-${id}-${cardName}-${uniqNumber}`.replaceAll(' ', '-')
            const checkImage = () => {
                const image = this.series.chart.container.querySelector(`.${classCustom}`) as HTMLImageElement
                if (image) {
                    image.onerror = function() {
                        this.onerror = null
                        this.src = ImageDefault.src
                    }
                }
            }
            if (img) setTimeout(() => checkImage());
            return (
                `<div>
                <img src="${img || ImageDefault.src}" class="${classCustom}" alt="Lấy liên kết URL của hình ảnh – wikiHow"  data-noaft="1" style="width: 85px; height: 120px;">
                </div>
                <div style="margin-left: 10px"> 
                <div style="font-size: 16px;font-weight: bold;color: #18213A;font-family: Manrope; margin-bottom:6px" >$${formatNumber(y)}</div>
                                  <div style="margin-bottom:6px" >
                                  <span style="background: ${color};border-radius: 20px;padding: 3px 6px 4px; font-weight: 600;font-size: 12px;color:${colorText}">
                                  ${graded}
                                  </span>
                                  </div> 
                                  <div style="font-weight: 500;font-size: 14px;font-family: Manrope;color: #18213A">${moment(x).format('MMM DD, YYYY')}</div>
                                  <div style="font-size: 12px;color: #6D7588;font-family: Manrope;margin-bottom:10px">${cardName}</div> 
                                  <span style="color: #124DE3;background: #E9F1FF;
              border-radius: 6px;padding:5px">AU</span> <span style="color: #7909A0;background: #F6DBFF;
              border-radius: 6px;padding:5px">MEM</span>
                </div>
              `
            )
        },
        footerFormat: '</div>',
    },
    plotOptions: {
        // @ts-ignore
        series: {
            label: {enabled: true},
            turboThreshold: 0, //larger threshold or set to 0 to disable
        },
    },
    series: [],
    navigator: {
        // adaptToUpdatedData: false,
        outlineWidth: 0,
        height: 70,
        handles: {
            width: 24,
            height: 24,
            symbols: [navigatorHangle, navigatorHangle]
        },
        series: {
            type: 'line'
        }
    },
    legend: {
        enabled: false,
    },
    chart: {
        height: 530
    },
    credits: {
        enabled: false
    }
};

///New
export class HoldChartData {
    public isShow: boolean = true
    public optionsIndex: TypeChart = {}
    public cardGradeSelected: number = 0
    private saleDataChart: any[] = []
    private calcMaLineDataChart: any = []
    
    constructor(public cardId: string, public cardCode: string, public cardName: string, public saleState: SaleChartState, public calcMaLine: CalcMaLine, public cardData: CardModel) {
        this.isShow = true
        this.cardGradeSelected = this.saleState.cardGradeSelected
        this.initDataGrade()
    }

    get itemCardGradeSelected() {
        return this.saleState.listCardGrade[this.cardGradeSelected]
    }

    initDataGrade() {
        this.saleDataChart = this.getSaleData()
        this.calcMaLineDataChart = []

        for (const key in this.calcMaLine.price) {
            // @ts-ignore
            this.calcMaLineDataChart.push([+key, +this.calcMaLine.price[key]])
        }
    }

    updateDataGradeToChart(optionChart: Highcharts.Options, chart: Highcharts.Chart, onClickTooltip: (e: any, cardData: CardModel) => void) {
        if (!optionChart.series) optionChart.series = []
        if (!('calcMaLine' in this.optionsIndex)) {
            const calcMaLineState = { ...seriesConfig['calcMaLine'] };
            //@ts-ignore
            optionChart.series.push({...calcMaLineState, data: this.calcMaLineDataChart, name: `${this.cardCode}-${this.cardId}`, nameShow: `${this.cardName}`, id: `${this.cardId}-calcMaLine`})
            this.optionsIndex['calcMaLine'] = (options.series || []).length - 1
        }
        if (!('sale' in this.optionsIndex)) {
            const salerState = { ...seriesConfig['sale'] };
            //@ts-ignore
            optionChart.series.push({...salerState, data: this.saleDataChart, name: `${this.cardCode}-${this.cardId}`, id: `${this.cardId}-sale`, linkedTo: `${this.cardId}-calcMaLine`, point: { events: { click: (e) => onClickTooltip(e.point, this.cardData) } } })
            this.optionsIndex['sale'] = (options.series || []).length - 1
        }
        chart.update({...optionChart} as Highcharts.Options, true, true)
    }

    removeSeries(optionChart: Highcharts.Options, chart: Highcharts.Chart) {
        if (!chart) return
        optionChart.series = optionChart.series?.filter((it, index) => ![this.optionsIndex['calcMaLine'], this.optionsIndex['sale']].includes(index)) || []
        chart.update({...optionChart} as Highcharts.Options, true, true)
        this.optionsIndex = {}
        this.saleDataChart = []
        this.calcMaLineDataChart = []
    }

    updateCalcMaLineSeries(optionChart: Highcharts.Options, chart: Highcharts.Chart, calcMaLine: CalcMaLine) {
        if (!chart || !optionChart?.series?.length) return
        this.calcMaLineDataChart = []
        for (const key in calcMaLine.price) {
            // @ts-ignore
            this.calcMaLineDataChart.push([+key, +calcMaLine.price[key]])
        }
        if (this.optionsIndex['calcMaLine'] !== undefined && optionChart.series[this.optionsIndex['calcMaLine']]) {
            optionChart.series[this.optionsIndex['calcMaLine']] = {
                ...optionChart.series[this.optionsIndex['calcMaLine']],
                data: this.calcMaLineDataChart
            }
            chart.update({...optionChart} as Highcharts.Options, true, true)
        }
    }

    getIndexSaleSeries() {
        const res: number[] = []
        if ((this.optionsIndex['sale'] ?? -1) !== -1) res.push(this.optionsIndex['sale'] as number)
        return res
    }

    private getSaleData() {
        let saleData: SaleData[] = []
        switch (this.itemCardGradeSelected.gradeCompany) {
            case 'ALL':
                saleData = this.saleState.mainListSaleRecord
                break;
            case 'RAW':
                saleData = this.saleState.mainListSaleRecord.filter(
                (it) => it.grade_company === null
                );
                break;
            case 'Graded':
                saleData = this.saleState.mainListSaleRecord.filter(
                (it) => it.grade_company !== null
                );
                break;
            default:
                 saleData = this.saleState.mainListSaleRecord.filter(
                (it) =>
                    it.grade_company === this.itemCardGradeSelected.gradeCompany &&
                    (this.itemCardGradeSelected.gradeValue === "ALL" ||
                    it.grade_value === this.itemCardGradeSelected.gradeValue)
                );
                break;
        }
        return saleData.map((element) => {
            let timestamp = moment(element.date).valueOf();
            //@ts-ignore
            let colorScheme = UtilsColorGrade.colorSchemeGrade(element.grade_company ?? "Ungraded");
            return {
                // @ts-ignore
                id: element.id,
                // @ts-ignore
                x: timestamp,
                // @ts-ignore
                y: element.price,
                // @ts-ignore
                color: colorScheme.color_2,
                // @ts-ignore
                colorText: colorScheme.color_1,
                //@ts-ignore
                cardName: this.cardName,
                // @ts-ignore
                img: element.img ? `https://img.priceguide.cards/sp/${element.img}.jpg`: null,
                // @ts-ignore
                graded: element.grade_company ? HelperSales.getStringGrade(element.grade_company, element.grade_value) : 'Ungraded',
                marker: {
                    // @ts-ignore
                    // symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                    // @ts-ignore
                    symbol: element.grade_company  ? 'cross' : 'circle',
                    // @ts-ignore
                    lineColor: element.grade_company ? colorScheme.color_2 : '#124DE3',
                    // @ts-ignore
                    fillColor: 'transparent',
                    // @ts-ignore
                    lineWidth: 2,
                }
            }
        })
    }

    updateDataChart(optionChart: Highcharts.Options, chart: Highcharts.Chart, calcMaLine: CalcMaLine) {
        if (!chart || !optionChart?.series?.length) return
        if (this.optionsIndex['calcMaLine'] !== undefined && (this.optionsIndex['calcMaLine'] ?? -1) !== -1 && optionChart.series[this.optionsIndex['calcMaLine']]) {
            this.calcMaLine = calcMaLine
            this.calcMaLineDataChart = []
            let color = '#124DE3', colorText: string = '#ffffff';
            if (HelperSales.checkDataGradeValid(this.itemCardGradeSelected.gradeCompany, this.itemCardGradeSelected.gradeValue)) {
                //@ts-ignore
                let colorScheme = UtilsColorGrade.colorSchemeGrade(this.itemCardGradeSelected.gradeCompany)
                color = colorScheme.color_2
                colorText = colorScheme.color_1
            }
            for (const key in calcMaLine.price) {
                this.calcMaLineDataChart.push([+key, +calcMaLine.price[key]])
            }
            // @ts-ignore
            optionChart.series[this.optionsIndex['calcMaLine']] = {...optionChart.series[this.optionsIndex['calcMaLine']], data: this.calcMaLineDataChart, color: color, dataLabels: {...optionChart.series[this.optionsIndex['calcMaLine']].dataLabels, color: colorText, backgroundColor: color, borderColor: color}}
        }
        if (this.optionsIndex['sale'] !== undefined && (this.optionsIndex['sale'] ?? -1) !== -1 && optionChart.series[this.optionsIndex['sale']]) {
            this.saleDataChart = this.getSaleData()
            let color = colorCluster
            if (HelperSales.checkDataGradeValid(this.itemCardGradeSelected.gradeCompany, this.itemCardGradeSelected.gradeValue)) {
                //@ts-ignore
                let colorScheme = UtilsColorGrade.colorSchemeGrade(this.itemCardGradeSelected.gradeCompany)
                color = colorScheme.color_2
            }
            // @ts-ignore
            optionChart.series[this.optionsIndex['sale']] = { ...optionChart.series[this.optionsIndex['sale']], data: this.saleDataChart, cluster: getCluster(color) }
        }
        chart.update({...optionChart} as Highcharts.Options, true, true)
    }
}