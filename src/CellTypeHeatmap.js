import React from "react"
import PropTypes from 'prop-types'

import URI from 'urijs'
import _ from "lodash"

import HighchartsHeatmap from "./HighchartsHeatmap"
import CalloutAlert from './CalloutAlert'
import LoadingOverlay from './LoadingOverlay'


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

  async _fetchExpressionDataForHeatmap({resource, host}) {
    this.setState({
      isLoading: true
    })

    //  `http://localhost:8080/gxa/sc/json/experiments/celltype/name/organism_part/value/pancreas`
    // "https://gist.githubusercontent.com/lingyun1010/095f414db81d34cef2a3bc8eaf56544f/raw/e898dd2ce08fb427e929df6c8dac262920f244a7/cellTypeAPIJsonResponse.json"

    const url = URI(resource, host).toString()

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const results = Object.values(await response.json())[0]
      const experimentAccessions = Object.keys(results)
      const markerGenes = _.flatMap(experimentAccessions.map(accession => Object.keys(results[accession])))
      const cellTypes = _.flatMap(experimentAccessions.map(accession =>
        Object.keys(results[accession][Object.keys(results[accession])[0]])))
      this.setState({
        experimentAccession: Object.keys(results),
        expressionByCellTypeData: response,
        responseByAccession: results,
        axisData: this._heatmapAxis(experimentAccessions, cellTypes, markerGenes),
        heatmapData:  this._factorHeatmapData(markerGenes, results, cellTypes),
        isLoading: false
      })

    } catch(e) {
      this.setState({
        data: null,
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
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
    const { heatmapData, axisData, hasError, isLoading } = this.state

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
        <div className="row">
          <div className="sections large-9 columns">
            <HighchartsHeatmap axisData={axisData} heatmapData={heatmapData} />
          </div>
          <LoadingOverlay
            show={isLoading}
          />
        </div>
    )
  }
}

CellTypeHeatmap.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired
}

export default CellTypeHeatmap
