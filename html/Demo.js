import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeHeatmap from '../src/index.js'
import PlotSettingsDropdown from "../src/PlotSettingsDropdown"
const names = [`sex`, `organism_part`], values = [[`female`], [`lymph node`, `pancreas`, `skin`]]

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: `organism_part`,
      value: `pancreas`,
      selectedName: `organism_part`,
      selectedValue: `pancreas`
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
              this.setState({
                value: this.state.selectedValue,
                name: this.state.selectedName
              })}}>
              Search</button>
          </div>
        </div>

        <div style={{paddingBottom: `25px`}}>
          <CellTypeHeatmap
            wrapperClassName={`row expanded`}
            resource={`json/metadata-search/name/${this.state.name}/value/${this.state.value}`}
            host={`http://localhost:8080/gxa/sc/`}
            value={this.state.value}
            name={this.state.name}
            hasDynamicHeight={true}
            heatmapRowHeight={20}
          />
        </div>
      </div>
    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}