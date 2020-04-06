import React from 'react'
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


export default CellTypeHeatmapRouter