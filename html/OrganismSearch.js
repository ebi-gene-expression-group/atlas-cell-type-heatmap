import React from 'react'
import PropTypes from 'prop-types'

import _ from "lodash"
import PlotSettingsDropdown from "../src/PlotSettingsDropdown"

const names = [`sex`, `organism_part`], values = [[`female`, `male`], [`lymph node`, `pancreas`, `skin`]]

class CellTypeSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedName: `organism_part`,
      selectedValue: `pancreas`,
      speciesList: [],
      cellTypeList: {}
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
      const speciesList = Object.keys(result)
      const cellTypes = speciesList.map(species => _.uniq(_.flatMap(Object.values(result[species]))))

      this.setState({
        result: result,
        speciesList: speciesList,
        cellTypeList: cellTypes,
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
    const {selectedName, selectedValue} = this.state

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

    return (
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
          <button className={`button`} onClick={() => {
            this._fetchCellTypes(this.state.selectedName, this.state.selectedValue)
          }}>
              Search
          </button>
        </div>
      </div>
    )
  }
}

CellTypeSearch.propTypes = {
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