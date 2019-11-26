import React from "react"
import PropTypes from 'prop-types'

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HC_heatmap from "highcharts/modules/heatmap"

// init the module
HC_heatmap(Highcharts)

const HighchartsHeatmap = props => {
  const { chartHeight, hasDynamicHeight, heatmapRowHeight } = props

  let matrixData = []
  let i=0, j=0
  if(props.axisData.x && props.heatmapData) {
    while(i < props.axisData.x.length){
      while(j < props.axisData.y.length){
        if(props.heatmapData[j][i]!==undefined){matrixData.push([i, j, Math.floor(props.heatmapData[j][i] * 1000) / 1000 + 1])}
        else{matrixData.push([i,j,null])}
        j++
      }
      i++
      j=0
    }
  }
  console.log(`matrixData`, matrixData, props.axisData.y,)

  const options = {
    chart: {
      type: `heatmap`,
      zoomType: `y`,
      height: hasDynamicHeight ? props.axisData.y && props.axisData.y.length * heatmapRowHeight : chartHeight,
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
      categories: props.axisData.x,
      opposite: true,
      labels: {
        autoRotation: [-90]}
    },

    yAxis: {
      categories: props.axisData.y,
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
      min: 0.1,
      max: 1000,
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
      align: `center`,
      verticalAlign: `top`,
      layout: `horizontal`,
      symbolWidth: 280
    },

    series: [
      {
        data: matrixData,
        nullColor: `#eaeaea`,
        states: {
          hover: {
            brightness: 0,
            borderColor: `coral`,
            borderWidth: 2
          }
        },
        borderWidth: 1,
        borderColor: `#dddddd`
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

HighchartsHeatmap.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired,
  axisData: PropTypes.shape({
    y: PropTypes.array,
    x: PropTypes.array
  }).isRequired,
  heatmapData: PropTypes.array.isRequired
}

export default HighchartsHeatmap
