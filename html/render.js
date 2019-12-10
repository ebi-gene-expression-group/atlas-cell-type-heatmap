import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeView from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<CellTypeView {...options} />, document.getElementById(target))
}

export {render}
