import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeHeatmapRouter from '../src/index'

const render = (options, mountNodeId) => {
  ReactDOM.render(<CellTypeHeatmapRouter {...options} />,  document.getElementById(mountNodeId))
}

export { render }
