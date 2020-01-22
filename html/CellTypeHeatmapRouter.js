import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route } from 'react-router-dom'

import CellTypeView from './CellTypeView'

const CellTypeHeatmapRouter = ({atlasUrl, basename}) =>
  <BrowserRouter basename={basename}>
    <Route
      path={`/search`}
      render={
        ({match, location, history}) =>
          <CellTypeView
            atlasUrl={atlasUrl}
            history={history}/>
      } />
  </BrowserRouter>

CellTypeHeatmapRouter.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  basename: PropTypes.string.isRequired
}

export default CellTypeHeatmapRouter