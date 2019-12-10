import React from "react"
import PropTypes from 'prop-types'

import URI from 'urijs'
import _ from "lodash"

import CellTypeHighchartsHeatmap from "./CellTypeHighchartsHeatmap"
import CalloutAlert from './CalloutAlert'
import LoadingOverlay from './LoadingOverlay'


class CellTypeView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expressionByCellTypeData: [],
      solrResponse: [],
      experimentAccessionsBySpecies: [],
      responseBySpecies: [],
      axisData: {},
      speciesList: [],
      selectedSpecies: null
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

      const { species } = this.props

      let results = Object.values(await response.json())[0][species]
      //results = fixture.markerGeneExpressionByCellType

      const experimentAccessions = Object.keys(results)
      const markerGenes = Object.keys(results[experimentAccessions[0]]).sort()

      this.setState({
        markerGenes: markerGenes,
        experimentAccessions: experimentAccessions,
        expressionByCellTypeData: response,
        responseBySpecies: results,
        axisData: this._heatmapAxis(markerGenes, results),
        heatmapData: this._factorHeatmapData(markerGenes, results),
        filteredData: this._factorHeatmapData(markerGenes, results),
        isLoading: false,
        selectedSpecies: null
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

  _factorHeatmapData(markerGenesBySpecies, responseBySpecies) {

    const experimentAccessions = Object.keys(responseBySpecies)

    const cellTypes = experimentAccessions.map(accession =>
      Object.keys(responseBySpecies[accession][Object.keys(responseBySpecies[accession])[0]])
    )
    const heatmapData = markerGenesBySpecies.map(markerGene =>
      _.flatMap(
        experimentAccessions.map((experimentAccession, idx) =>
          cellTypes[idx].map(cellType => {
            return responseBySpecies[experimentAccession][markerGene][cellType]
          })
        )
      )
    )
    return heatmapData
  }

  _heatmapAxis(markerGenesBySpecies, responseBySpecies) {
    const experimentAccessions = Object.keys(responseBySpecies)

    const cellTypes = experimentAccessions.map(accession =>
      Object.keys(responseBySpecies[accession][Object.keys(responseBySpecies[accession])[0]])
    )

    const yAxisCategory = _.flatMap(
      experimentAccessions.map((experimentAccession, idx) =>
        cellTypes[idx].map(
          cellType => `${cellType} <br> ${experimentAccession}`
        )
      )
    )
    return ({ y: markerGenesBySpecies, x: yAxisCategory })
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
    const { axisData, hasError, isLoading, filteredData } = this.state
    const { wrapperClassName, plotWrapperClassName } = this.props
    const { hasDynamicHeight, defaultHeatmapHeight, heatmapRowHeight } = this.props

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :

        <div className={wrapperClassName}>
          <div className={plotWrapperClassName} style={{position: `relative`}}>
            <CellTypeHighchartsHeatmap
              axisData={axisData}
              heatmapData={filteredData}
              chartHeight={defaultHeatmapHeight}
              hasDynamicHeight={axisData.y && axisData.y.length > 5 ? hasDynamicHeight : false} // don't want dynamic height if there is little or no data
              heatmapRowHeight={heatmapRowHeight}
            />
            <LoadingOverlay
              show={isLoading}
            />
          </div>
        </div>
    )
  }
}

CellTypeView.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  plotWrapperClassName: PropTypes.string,
  defaultHeatmapHeight: PropTypes.number,
  hasDynamicHeight: PropTypes.bool,
  heatmapRowHeight: PropTypes.number,
  species: PropTypes.string.isRequired
}

CellTypeView.defaultProps = {
  wrapperClassName: `row`,
  plotWrapperClassName: `small-12 columns`,
  defaultHeatmapHeight: 300,
  hasDynamicHeight: true,
  heatmapRowHeight: 20
}

export default CellTypeView
