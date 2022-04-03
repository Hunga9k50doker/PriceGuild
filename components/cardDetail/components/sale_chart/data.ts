import { SaleData } from "model/data_sport/card_sport";
import markerClusters from "highcharts/modules/marker-clusters";
import Highcharts from "highcharts/highstock";
import { formatNumber } from "utils/helper";
import moment from 'moment';
import ImageDefault from "assets/images/card_default.png"
const ISSERVER = typeof window === "undefined";
if (!ISSERVER) {
    markerClusters(Highcharts);
}

export const checkImageExist = async (img: string) => {
    return new Promise(function(resolve) {
        if (!img) resolve(false)
        const image = new Image()
        image.src = img
        image.onload = function() { resolve(true) }
        image.onerror = function() { resolve(false) }
    })
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

export const colorCluster = '#124DE3';

export const getCluster = (fillColor: string = colorCluster) => {
    return {
        enabled: true,
        allowOverlap: true,
        zoomType: 'x',
        minimumClusterSize: 3,
        animation: {
            duration: 450
        },
        layoutAlgorithm: {
            type: 'grid',
            gridSize: 50
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

const navigatorHangle = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHZpZXdCb3g9IjAgMCA0NCA0NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxjaXJjbGUgY3g9IjIyIiBjeT0iMjAiIHI9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIyMiIgY3k9IjIwIiByPSIxNS41IiBzdHJva2U9IiNFOUVBRUQiLz4KPC9nPgo8bGluZSB4MT0iMTYuNSIgeTE9IjE0IiB4Mj0iMTYuNSIgeTI9IjI2IiBzdHJva2U9IiM2RDc1ODgiLz4KPGxpbmUgeDE9IjIyLjUiIHkxPSIxNCIgeDI9IjIyLjUiIHkyPSIyNiIgc3Ryb2tlPSIjNkQ3NTg4Ii8+CjxsaW5lIHgxPSIyOC41IiB5MT0iMTQiIHgyPSIyOC41IiB5Mj0iMjYiIHN0cm9rZT0iIzZENzU4OCIvPgo8L3N2Zz4K)'

export const listRecordValid: SaleData[] = [];

export const seriesConfig: {[key: string]: Highcharts.SeriesOptionsType} = {
    areaspline: {
        type: "areaspline",
        name: "MA(28) = 28 Day Moving Average",
        data: [],
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
        tooltip: {
            valueDecimals: 2,
        },
        stickyTracking: false,
        showInNavigator: true,
        enableMouseTracking: true,
    },
    line: {
        type: "line",
        name: "MA(28) = 28 Day Moving Average",
        data: [],
        color: '#124DE3',
        shadow: true,
        borderRadius: 20,
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
                return isLast ? this.series.name : null
            }
        },
        stickyTracking: false,
        showInNavigator: true,
        enableMouseTracking: true,
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
        }
    },
    scatter: {
        type: "scatter",
        name: "Sale",
        data: [],
        cluster: getCluster(),
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
        stickyTracking: false,
    }
}

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
        crosshair: false,
        ordinal: false,
        minRange: 24 * 3600 * 1000,
        events: {
            setExtremes: function (e) {
                if (e.trigger && ["rangeSelectorButton", "navigator"].includes(e.trigger)) {
                    this.chart.zoomOut()
                }
            }
        }
    },
    yAxis: {
        opposite: false,
        labels: {
            align: 'right',
        }
    },
    scrollbar: {
        liveRedraw: false,
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
    navigator: {
        adaptToUpdatedData: false,
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
    boost: {
        useGPUTranslations: true,
        usePreallocated: true,
    },
    tooltip: {
        split: false,
        backgroundColor: '#FFFFFF',
        useHTML: true,
        headerFormat: '<div style="display: flex; padding: 10px;background: #FFF" class="tooltip-scatter">',
        borderRadius: 6,
        borderColor: "#E9EAED",
        //@ts-ignore
        formatter: function (tooltip) {
            if (this.series.type === 'line' || this.series.type === 'areaspline') return false
             //@ts-ignore
            return tooltip.defaultFormatter.call(this, tooltip)
        },
        pointFormatter: function() {
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
                <img src="${img || ImageDefault.src}" class="${classCustom}" alt="${cardName}" data-noaft="1" style="width: 85px; height: 120px;">
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
        series: {
            // enableMouseTracking: false,
            turboThreshold: 0, //larger threshold or set to 0 to disable
        },
    },
    series: [],
    legend: {
        enabled: false,
    },
    chart: {
        height: 530,
        zoomType: 'x',
        animation: false,
    },
    credits: {
        enabled: false
    },
    drilldown: {
      series: []
    },
    exporting : {
        enabled: false
    }
};
  