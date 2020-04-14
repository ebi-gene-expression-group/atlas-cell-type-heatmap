import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeHeatmapRouter from '../src/index'
import OrganismSearch from './OrganismSearch'

const render = (options, mountNodeId1, mountNodeId2) => {
  //ReactDOM.render(<OrganismSearch {...options} />,  document.getElementById(mountNodeId1))
  ReactDOM.render(<CellTypeHeatmapRouter {...options} />,  document.getElementById(mountNodeId2))
}

export { render }
