import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route } from 'react-router-dom'

import CellTypeSearch from './CellTypeSearch'

const CellTypeHeatmapRouter = () =>
  <BrowserRouter basename={``}>
    <Route
      path={`/`}
      render={
        ({history}) =>
          <CellTypeSearch
            history={history}/>
      } />
  </BrowserRouter>

CellTypeHeatmapRouter.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  basename: PropTypes.string.isRequired
}

export default CellTypeHeatmapRouter