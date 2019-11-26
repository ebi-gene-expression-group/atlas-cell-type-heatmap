import React from "react"
import PropTypes from 'prop-types'

import URI from 'urijs'
import _ from "lodash"

import HighchartsHeatmap from "./HighchartsHeatmap"
import CalloutAlert from './CalloutAlert'
import LoadingOverlay from './LoadingOverlay'
import PlotSettingsDropdown from './PlotSettingsDropdown'


class CellTypeHeatmap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expressionByCellTypeData: [],
      solrResponse: [],
      experimentAccessions: [],
      responseByAccession: [],
      axisData: {},
      selectedExperiment: null
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
      const markerGenes = Object.keys(results[experimentAccessions[0]]).sort()

      this.setState({
        markerGenes: markerGenes,
        experimentAccessions: Object.keys(results),
        expressionByCellTypeData: response,
        responseByAccession: results,
        axisData: this._heatmapAxis(markerGenes, results),
        heatmapData: this._factorHeatmapData(markerGenes, results),
        filteredData: this._factorHeatmapData(markerGenes, results),
        isLoading: false,
        selectedExperiment: null
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

  _factorHeatmapData(markerGenes, results, selectedExperiment) {
    const experimentAccessions = selectedExperiment ? [selectedExperiment] : Object.keys(results)
    const cellTypes = experimentAccessions.map(accession =>
      Object.keys(results[accession][Object.keys(results[accession])[0]])
    )
    const heatmapData = markerGenes.map(markerGene =>
      _.flatMap(
        experimentAccessions.map((experimentAccession, idx) =>
          cellTypes[idx].map(cellType => {
            return results[experimentAccession][markerGene][cellType]
          })
        )
      )
    )
    return heatmapData
  }

  _heatmapAxis(markerGenes, results, selectedExperiment) {
    const experimentAccessions = selectedExperiment ? [selectedExperiment] : Object.keys(results)
    const cellTypes = experimentAccessions.map(accession =>
      Object.keys(results[accession][Object.keys(results[accession])[0]])
    )

    const yAxisCategory = _.flatMap(
      experimentAccessions.map((experimentAccession, idx) =>
        cellTypes[idx].map(
          cellType => `${cellType} <br> ${experimentAccession}`
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
    const { wrapperClassName, plotWrapperClassName } = this.props
    const { hasDynamicHeight, defaultHeatmapHeight, heatmapRowHeight } = this.props
    const { selectedExperiment, experimentAccessions, markerGenes, responseByAccession, filteredData } = this.state

    const experimentOptions = experimentAccessions
      .sort((a, b) => a-b)
      .map((v) => ({
        value: v.toString(),
        label: v,
        isDisabled: false
      }))

    if (experimentOptions.length > 1) {
      experimentOptions.unshift({
        value: `all`,
        label: `All`,
        isDisabled: false
      })
    }

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
        <div>
          <div className={wrapperClassName}>
            <div className={`small-12 medium-6 columns`}>
              <PlotSettingsDropdown
                labelText={`Show Gene Expressions for Experiment:`}
                options={experimentOptions}
                onSelect={(selectedOption) =>{
                  this.setState({
                    filteredData: selectedOption.value === `all` ?
                      _.cloneDeep(heatmapData) :
                      this._factorHeatmapData(markerGenes, responseByAccession, selectedOption.value),
                    axisData: selectedOption.value === `all` ?
                      this._heatmapAxis(markerGenes, responseByAccession) :
                      this._heatmapAxis(markerGenes, responseByAccession, selectedOption.value),
                    selectedExperiment: selectedOption
                  })
                }}
                value={selectedExperiment || experimentOptions[0]}
              />
            </div>
          </div>
          <div className={wrapperClassName}>
            <div className={plotWrapperClassName} style={{position: `relative`}}>
              <HighchartsHeatmap
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
        </div>
    )
  }
}

CellTypeHeatmap.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  plotWrapperClassName: PropTypes.string,
  defaultHeatmapHeight: PropTypes.number,
  hasDynamicHeight: PropTypes.bool,
  heatmapRowHeight: PropTypes.number
}

CellTypeHeatmap.defaultProps = {
  wrapperClassName: `row`,
  plotWrapperClassName: `small-12 columns`,
  defaultHeatmapHeight: 300,
  hasDynamicHeight: true,
  heatmapRowHeight: 20
}
export default CellTypeHeatmap
