import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import CellTypeSearch from './CellTypeSearch'

const CellTypeHeatmapRouter = (options) =>
  <BrowserRouter basename={``}>
    <Route
      exact path={`/search`}
      render={
        ({history}) =>
          <CellTypeSearch
            {...options}
            history={history}/>
      } />
  </BrowserRouter>


export default CellTypeHeatmapRouter