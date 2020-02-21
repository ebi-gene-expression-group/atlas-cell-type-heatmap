import React from "react"
import PropTypes from 'prop-types'

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HC_heatmap from "highcharts/modules/heatmap"
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'

import XAxisFormatter from './axesFormatters'
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

const colour = (value) => value < 10 ? `#8cc6ff` : value < 1000 ? `#0000ff` : `#0000b3`

const CellTypeHighchartsHeatmap = props => {
  const { chartHeight, hasDynamicHeight, heatmapRowHeight, axisData, heatmapData } = props

  let matrixData = []
  let i=0, j=0
  if(axisData.x && heatmapData) {
    while(i < axisData.x.length){
      while(j < axisData.y.length){
        if (heatmapData[j][i] === 0) {matrixData.push([i,j,null])}
        else if (heatmapData[j][i] !== undefined) {
          matrixData.push([i, j, Math.floor(heatmapData[j][i] * 1000) / 1000 + 1])
        }

        else {matrixData.push([i,j,null])}
        j++
      }
      i++
      j=0
    }
  }

  const dataWithColour = matrixData.map(info => [{
    data: [{x:info[0], y:info[1], value: info[2]}],
    color: colour(info[2]),
    borderWidth: 1,
    borderColor: `white`
  }][0]
  )

  const options = {
    chart: {
      type: `heatmap`,
      zoomType: `y`,
      height: hasDynamicHeight ? axisData.y && axisData.y.length * heatmapRowHeight : chartHeight,
      animation: false,
      marginRight: matrixData.length !== 0 ? 100 : 0,
      plotBackgroundColor: `#eaeaea`,
      spacingBottom: 0,
      spacingTop: 0,
      plotBorderWidth: 1,
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
    plotOptions: {
      heatmap: {
        turboThreshold: 0
      },

      series: {
        states: {
          hover: {
            color: `#eeec38` //#edab12 color cell on mouse over
          },
          select: {
            color: `#eeec38`
          },
          inactive: {
            opacity: 1
          }
        }
      }
    },
    labels: {
      step: 1
    },
    title: {
      text: `Cell types vs Marker genes`,
      style: {
        fontSize: `25px`,
        fontWeight: `bold`
      }
    },
    legend: {
      enabled: false
    },

    xAxis: {
      useHTML: true,
      categories: axisData.x,
      opposite: true,
      labels: {
        useHTML: true,
        autoRotation: [-90],
        formatter: function() {
          return XAxisFormatter(this.value)
        }
      }
    },

    yAxis: {
      useHTML: true,
      categories: axisData.y,
      credits: {
        enabled: false
      },
      title: false,
      reversed: true,
      startOnTick: false,
      endOnTick: false,
      showEmpty: false
    },

    tooltip: {
      outside: true,
      followPointer: false,
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cell Type:</b> ${this.series.xAxis.categories[this.point.x].cellType} <br/> 
                  <b>Experiment Accession:</b> ${this.series.xAxis.categories[this.point.x].experimentAccession} <br/> 
                  <b>Gene ID:</b> ${this.series.yAxis.categories[this.point.y]} <br /> 
                  <b>Average expression:</b> Not expressed <br/>`
        }
        else {
          return `<b>Cell Type:</b> ${this.series.xAxis.categories[this.point.x].cellType} <br/> 
                  <b>Experiment Accession:</b> ${this.series.xAxis.categories[this.point.x].experimentAccession} <br/> 
                  <b>Gene ID:</b> ${this.series.yAxis.categories[this.point.y]} <br /> 
                  <b>Average expression:</b> ${Math.round(this.point.value-1)} CPM <br/>`
        }
      },
      positioner: function (labelWidth, labelHeight, point) {
        return {
          x: point.plotX + 10,
          y: point.plotY + labelHeight/2 + 200
        }
      }
    },

    series: dataWithColour,

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
