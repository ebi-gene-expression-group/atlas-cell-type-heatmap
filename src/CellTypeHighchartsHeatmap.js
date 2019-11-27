import React from "react"
import PropTypes from 'prop-types'

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HC_heatmap from "highcharts/modules/heatmap"
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'

// init the module
async function addModules() {
  HC_heatmap(Highcharts)
  HighchartsExporting(Highcharts)
  HighchartsExportData(Highcharts)
}

addModules()

Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => [
  // Arrow stem
  `M`, x + w * 0.5, y,
  `L`, x + w * 0.5, y + h * 0.7,
  // Arrow head
  `M`, x + w * 0.3, y + h * 0.5,
  `L`, x + w * 0.5, y + h * 0.7,
  `L`, x + w * 0.7, y + h * 0.5,
  // Box
  `M`, x, y + h * 0.9,
  `L`, x, y + h,
  `L`, x + w, y + h,
  `L`, x + w, y + h * 0.9
]

const CellTypeHighchartsHeatmap = props => {
  const { chartHeight, hasDynamicHeight, heatmapRowHeight, axisData, heatmapData } = props

  let matrixData = []
  let i=0, j=0
  if(axisData.x && heatmapData) {
    while(i < axisData.x.length){
      while(j < axisData.y.length){
        if(heatmapData[j][i] === 0) {matrixData.push([i,j,null])}
        else if(heatmapData[j][i]!==undefined){matrixData.push([i, j, Math.floor(heatmapData[j][i] * 1000) / 1000 + 1])}
        else{matrixData.push([i,j,null])}
        j++
      }
      i++
      j=0
    }
  }

  const options = {
    chart: {
      type: `heatmap`,
      zoomType: `y`,
      height: hasDynamicHeight ? axisData.y && axisData.y.length * heatmapRowHeight : chartHeight,
      animation: false,
      marginRight: matrixData.length !== 0 ? 100 : 0,
      plotBackgroundColor: `#eaeaea`,
      spacingBottom: 0
    },
    lang: {
      noData: `There are no marker genes for this k value. Try selecting another k.`,
    },
    noData: {
      style: {
        fontWeight: `bold`,
        fontSize: `16px`,
        color: `#000000`
      }
    },
    credits: {
      enabled: false
    },
    labels: {
      step: 1
    },
    title: {
      text: `Heatmap for cell types vs marker genes`
    },

    xAxis: {
      categories: axisData.x,
      opposite: true,
      labels: {
        autoRotation: [-90]}
    },

    yAxis: {
      categories: axisData.y,
      credits: {
        enabled: false
      },
      title: false,
      reversed: true,
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      showEmpty: false
    },

    tooltip: {
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cell Type:</b> ${this.series.xAxis.categories[this.point.x]} <br/> 
                  <b>Gene ID:</b> ${this.series.yAxis.categories[this.point.y]} <br /> 
                  <b>Average expression:</b> Not expressed <br/>`
        }
        else {
          return `<b>Cell Type:</b> ${this.series.xAxis.categories[this.point.x]} <br/> 
                  <b>Gene ID:</b> ${this.series.yAxis.categories[this.point.y]} <br /> 
                  <b>Average expression:</b> ${Math.round(this.point.value-1)} CPM <br/>`
        }
      }
    },

    colorAxis: {
      type: `logarithmic`,
      min: 0.1,
      max: 100000,
      stops: [
        [0, `#ffffff`],
        [0.67, `#6077bf`],
        [1, `#0e0573`]
      ],
      marker: {
        color: `#e96b23`
      }
    },

    legend: {
      title: {
        text: `Median expression (CPM)`
      },
      align: `center`,
      verticalAlign: `top`,
      layout: `horizontal`,
      symbolWidth: 480,
      enabled: matrixData.length !== 0
    },

    series: [
      {
        data: matrixData,
        nullColor: `#eaeaea`,
        cursor: `crosshair`,
        states: {
          hover: {
            brightness: 0,
            borderWidth: 2,
            borderColor: `#e96b23`
          }
        },
        turboThreshold: 0
      }
    ],
    boost: {
      useGPUTranslations: true
    },
    navigation: {
      buttonOptions: {
        theme: {
          style: {
            fontSize: `15px`
          },
          states: {
            select: {
              style: {
                fontWeight: `normal`,
                color: `black`
              }
            }
          }
        }
      },
      menuItemStyle: {
        fontSize: `15px`
      }
    },

    exporting: {
      buttons: {
        contextButton: {
          text: `Download`,
          symbol: `download`,
          menuItems: [
            `printChart`,
            `separator`,
            `downloadPNG`,
            `downloadJPEG`,
            `downloadPDF`,
            `downloadSVG`,
            `separator`,
            `downloadCSV`,
            `downloadXLS`
          ]
        }
      }
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

CellTypeHighchartsHeatmap.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired,
  axisData: PropTypes.shape({
    y: PropTypes.array,
    x: PropTypes.array
  }).isRequired,
  heatmapData: PropTypes.array.isRequired
}

export default CellTypeHighchartsHeatmap
