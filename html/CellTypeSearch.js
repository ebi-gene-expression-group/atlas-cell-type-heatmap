import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'
import CellTypeView from '../src/index.js'
import PlotSettingsDropdown from "../src/PlotSettingsDropdown"
import _ from "lodash"
import LoadingOverlay from "../src/LoadingOverlay"

const names = [`sex`, `organism_part`], values = [[`female`, `male`], [`lymph node`, `pancreas`, `skin`]]

class CellTypeSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedName: `organism_part`,
      selectedValue: `pancreas`,
      specieses: [],
      cellTypes: {}
    }
  }

  async _fetchCellTypes(name, value) {
    this.setState({
      isLoading: true
    })

    const url = `http://localhost:8080/gxa/sc/json/metadata-search/cell-type/name/${name}/value/${value}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const result = Object.values(await response.json())[0]
      const specieses = Object.keys(result)
      const cellTypes = specieses.map(species => _.uniq(_.flatMap(Object.values(result[species]))))

      this.setState({
        result: result,
        specieses: specieses,
        cellTypes: cellTypes,
        isLoading: false
      })
    } catch(e) {
      this.setState({
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message,
          isLoading: false
        }
      })
    }
  }

  render() {
    const requestParams = URI(location.search).query(true)
    const {selectedName, selectedValue, selectedSpecies, selectedCellType, specieses, cellTypes, isLoading} = this.state

    const valueOptions = values[names.indexOf(selectedName)]
      .map((v) => ({
        value: v.toString(),
        label: v,
        isDisabled: false
      }))

    const nameOptions = names
      .map((v) => ({
        value: v.toString(),
        label: v,
        isDisabled: false
      }))

    const cellTypesOptions = selectedSpecies ?
      cellTypes[specieses.indexOf(selectedSpecies)]
        .map((v) => ({
          value: v.toString().substring(1, v.length - 1),
          label: v.toString().substring(1, v.length - 1),
          isDisabled: false
        }))
        .filter(v => v.value !== `not available` && v.value !== `not applicable` && v.value !== ``) :
      []

    const speciesOptions = specieses
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
              labelText={`Characteristic name:`}
              options={nameOptions}
              onSelect={(selectedOption) => {
                this.setState({
                  selectedName: selectedOption.value
                })
              }}
              value={{value: selectedName, label: selectedName}}
            />
          </div>
          <div className={`small-12 medium-5 columns`}>
            <PlotSettingsDropdown
              labelText={`Characteristic value:`}
              options={valueOptions}
              onSelect={(selectedOption) => {
                this.setState({
                  selectedValue: selectedOption.value
                })
              }}
              value={{value: selectedValue, label: selectedValue}}
            />
          </div>
          <div className={`small-12 medium-2 columns`} style={{paddingTop: `25px`}}>
            <button className={`button`} onClick={(event) => {
              event.preventDefault()
              this.props.history.push(`/`)
              this._fetchCellTypes(this.state.selectedName, this.state.selectedValue)
              this.setState({
                selectedSpecies: ``,
                selectedCellType: ``
              })
            }}>
              Search</button>
          </div>
        </div>



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
              resource={`json/metadata-search/expression/name/inferred_cell_type/value/${requestParams.cellType}`}
              host={`http://localhost:8080/gxa/sc/`}
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
  atlasUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
  // If we really need to know history’s propTypes (e.g. for tests) here they are:
  // history: PropTypes.shape({
  //   length: PropTypes.number.isRequired,
  //   action: PropTypes.oneOf([`POP`, `PUSH`, `REPLACE`]).isRequired,
  //   location: PropTypes.shape({
  //     hash: PropTypes.string.isRequired,
  //     key: PropTypes.string.isRequired,
  //     query: PropTypes.string,
  //     state: PropTypes.string
  //   }).isRequired,
  //   createHref: PropTypes.func.isRequired,
  //   push: PropTypes.func.isRequired,
  //   replace: PropTypes.func.isRequired,
  //   go: PropTypes.func.isRequired,
  //   goBack: PropTypes.func.isRequired,
  //   goForward: PropTypes.func.isRequired,
  //   block: PropTypes.func.isRequired,
  //   listen: PropTypes.func.isRequired
  // })
}

export default CellTypeSearch