import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeHeatmap from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<CellTypeHeatmap {...options} />, document.getElementById(target))
}

export {render}
