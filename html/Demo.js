import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeView from '../src/index.js'
import PlotSettingsDropdown from "../src/PlotSettingsDropdown"
import URI from "urijs"
import LoadingOverlay from "../src/LoadingOverlay"
const names = [`sex`, `organism_part`], values = [[`female`, `male`], [`lymph node`, `pancreas`, `skin`]]

class Demo extends React.Component {
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
      const cellTypes = specieses.map(species => Object.values(result[species])[0])

      console.log(result, specieses, cellTypes)

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
    const {selectedName, selectedValue, selectedSpecies, selectedCellType, specieses, cellTypes, isLoading} = this.state

    console.log(`states`,selectedName, selectedValue, selectedSpecies, specieses, cellTypes )
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
          value: v.toString().substring(1,v.length-1),
          label: v.toString().substring(1,v.length-1),
          isDisabled: false
        })) : []

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
            <button className={`button`} onClick={() => {
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
              value={{value: selectedSpecies, label: selectedSpecies}}
            />
          </div>
          <div className={`small-12 medium-5 columns`}>
            <PlotSettingsDropdown
              labelText={`Cell types:`}
              options={cellTypesOptions}
              onSelect={(selectedOption) => {
                this.setState({
                  selectedCellType: selectedOption.value
                })
              }}
              value={{value: selectedCellType, label: selectedCellType}}
            />
          </div>
          <div className={`small-12 medium-2 columns`} style={{paddingTop: `25px`}}>
            <button className={`button`} onClick={() => {
              this.setState({
                cellType: this.state.selectedCellType
              })}}>
            Search</button>
          </div>


        </div>
        {
          this.state.cellType && <div style={{paddingBottom: `25px`}}>
            <CellTypeView
              wrapperClassName={`row expanded`}
              resource={`json/metadata-search/expression/name/inferred_cell_type/value/${this.state.cellType}`}
              host={`http://localhost:8080/gxa/sc/`}
              hasDynamicHeight={true}
              species={this.state.selectedSpecies}
              heatmapRowHeight={20}
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

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}