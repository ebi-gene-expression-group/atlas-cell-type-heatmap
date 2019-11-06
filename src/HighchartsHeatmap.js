import React from "react"
import PropTypes from 'prop-types'

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HC_heatmap from "highcharts/modules/heatmap"

// init the module
HC_heatmap(Highcharts)

const HighchartsHeatmap = props => {
  let matrixData = []
  let i=0, j=0
  if(props.axisData.x && props.heatmapData) {
    while(i < props.axisData.x.length){
      while(j < props.axisData.y.length){
        matrixData.push([i, j, Math.floor(props.heatmapData[j][i] * 1000) / 1000 + 1])
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
      height: props.axisData.y && props.axisData.y.length*20,
      width: props.axisData.x && props.axisData.x.length*100

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
        autoRotation: [-20]}
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
      type: `logarithmic`,
      minColor: `#FFFFFF`,
      maxColor: `#024990`,
      stops: [[0, `#FFFFFF`], [0.67, `#9ecae1`], [1, `#3182bd`]],
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
  axisData: PropTypes.shape({
    y: PropTypes.array,
    x: PropTypes.array
  }).isRequired,
  heatmapData: PropTypes.array.isRequired
}

export default HighchartsHeatmap
