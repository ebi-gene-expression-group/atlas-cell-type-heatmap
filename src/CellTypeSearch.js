import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'
import CellTypeView from './CellTypeView'
import LoadingOverlay from "./LoadingOverlay"
import PlotSettingsDropdown from "./PlotSettingsDropdown"
import _ from "lodash"

class CellTypeSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSpecies: ``,
      selectedCellType: ``,
      cellType: ``
    }
  }

  render() {
    const requestParams = URI(location.search).query(true)
    const {speciesList, cellTypePayload, host, resource} = this.props
    const {selectedSpecies, selectedCellType, isLoading} = this.state

    const cellTypeList = speciesList.map(species => _.uniq(_.flatMap(Object.values(cellTypePayload[species]))))

    const cellTypesOptions = selectedSpecies ?
      cellTypeList[speciesList.indexOf(selectedSpecies)]
        .map((v) => ({
          value: v.toString().substring(1, v.length - 1),
          label: v.toString().substring(1, v.length - 1),
          isDisabled: false
        }))
        .filter(v => v.value !== `not available` && v.value !== `not applicable` && v.value !== ``) :
      []

    const speciesOptions = speciesList
      .map((v) => ({
        value: v.toString(),
        label: v,
        isDisabled: false
      }))

    return (
      <div>
        <div className={`row expanded`}>
          <div className={`small-12 medium-5 columns`}>
            <PlotSettingsDropdown
              labelText={`Species:`}
              options={speciesOptions}
              onSelect={(selectedOption) => {
                this.setState({
                  selectedSpecies: selectedOption.value
                })
              }}
              value={{value: selectedSpecies || requestParams.species, label: selectedSpecies || requestParams.species}}
            />
          </div>
          <div className={`small-12 medium-5 columns`}>
            <PlotSettingsDropdown
              labelText={`Inferred cell types:`}
              options={cellTypesOptions}
              onSelect={(selectedOption) => {
                this.setState({
                  selectedCellType: selectedOption.value
                })
              }}
              value={{value: selectedCellType || requestParams.cellType, label: selectedCellType || requestParams.cellType}}
            />
          </div>
          <div className={`small-12 medium-2 columns`} style={{paddingTop: `25px`}}>
            <button className={`button`} onClick={(event) => {
              event.preventDefault()
              this.props.history.push(`/search?species=` + this.state.selectedSpecies + `&cellType=` + this.state.selectedCellType)
              this.setState({
                cellType: this.state.selectedCellType
              })}}>
              Search
            </button>
          </div>

        </div>
        {
          requestParams.cellType && <div style={{paddingBottom: `25px`}}>
            <CellTypeView
              wrapperClassName={`row expanded`}
              resource={`${resource}/${requestParams.cellType}`}
              host={host}
              hasDynamicHeight={true}
              species={requestParams.species}
              heatmapRowHeight={30}
            />
          </div>
        }
        <LoadingOverlay
          show={isLoading}
        />
      </div>
    )
  }
}

CellTypeSearch.propTypes = {
  history: PropTypes.object.isRequired,
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  speciesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  cellTypeList: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default CellTypeSearch