import React from "react"
import PropTypes from 'prop-types'

import URI from 'urijs'
import _ from "lodash"
import HighchartsHeatmap from "./HighchartsHeatmap"

const fetchResponseJson = async url => {
  const response = await fetch(url)
  const responseJson = await response.json()
  return responseJson
}

class CellTypeHeatmap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expressionByCellTypeData: [],
      solrResponse: [],
      experimentAccessions: [],
      responseByAccession: [],
      axisData: {}
    }
  }

  _fetchExpressionDataForHeatmap({resource, host}) {
    const expressionByCellTypeDataUrl = URI(resource, host).toString()
    //  `http://localhost:8080/gxa/sc/json/experiments/celltype/name/organism_part/value/pancreas`
    // "https://gist.githubusercontent.com/lingyun1010/095f414db81d34cef2a3bc8eaf56544f/raw/e898dd2ce08fb427e929df6c8dac262920f244a7/cellTypeAPIJsonResponse.json"

    this.setState(
      {
        loading: true
      },
      () => {

        fetchResponseJson(expressionByCellTypeDataUrl)
          .then(responseJson => {
            const results = responseJson.markerGeneExpressionByCellType
            const experimentAccessions = Object.keys(results)
            const markerGenes = _.flatMap(experimentAccessions.map(accession => Object.keys(results[accession])))
            const cellTypes = _.flatMap(experimentAccessions.map(accession =>
              Object.keys(results[accession][Object.keys(results[accession])[0]])))

            this.setState({
              experimentAccession: Object.keys(results),
              expressionByCellTypeData: responseJson,
              responseByAccession: results,
              axisData: this._heatmapAxis(experimentAccessions, cellTypes, markerGenes),
              heatmapData:  this._factorHeatmapData(markerGenes, results, cellTypes),
              loading: false
            })
          })
          .catch(reason => {
            console.error(`Oh no`, reason)
            this.setState({
              loading: false
            })
          })

      }
    )
  }

  _factorHeatmapData(markerGenes, results, cellTypes) {
    const experimentAccessions = Object.keys(results)
    const heatmapData = markerGenes.map(markerGene =>
      _.flatMap(
        cellTypes.map(cellType =>
          experimentAccessions.map((experimentAccession) => results[experimentAccession][markerGene][cellType])
        )
      )
    )
    return heatmapData
  }

  _heatmapAxis(experimentAccessions, cellTypes, markerGenes) {
    const yAxisCategory = _.flatMap(
      experimentAccessions.map(experimentAccession =>
        cellTypes.map(
          cellType => `${cellType}/${experimentAccession}`
        )
      )
    )
    return ({ y: markerGenes, x: yAxisCategory })
  }

  componentDidMount() {
    this._fetchExpressionDataForHeatmap(this.props)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resource !== this.props.resource) {
      this._fetchExpressionDataForHeatmap(this.props)
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }

  render() {
    const { heatmapData, axisData } = this.state

    return (
      <div className="row">
        <div className="sections large-9 columns">
          <HighchartsHeatmap axisData={axisData} heatmapData={heatmapData} />
        </div>
      </div>
    )
  }
}

CellTypeHeatmap.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired
}

export default CellTypeHeatmap
