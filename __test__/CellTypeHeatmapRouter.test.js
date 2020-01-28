import { Router, Link } from 'react-router-dom'
import 'babel-polyfill'
import CellTypeSearch from '../html/CellTypeSearch'
import { render , fireEvent} from '@testing-library/react'
import { createMemoryHistory } from "history"

test(`link prop validation`, () => {
  const history = createMemoryHistory({ initialEntries: [`/`] })
  const RenderResult = render(
    <Router history={history}>
      <Link to={{pathname: `/example`}}>Home</Link>
    </Router>
  )
  fireEvent.click(RenderResult.getByText(`Home`));
  expect(history.location.pathname).toBe(`/example`);
})

test(`query prop validation`, () => {
  const history = createMemoryHistory({ initialEntries: [`/`] })
  const RenderResult = render(
    <Router history={history}>
      <Link to={{search: `?author=Raissa`}}>Home</Link>
    </Router>
  )
  fireEvent.click(RenderResult.getByText(`Home`))
  expect(history.location.search).toBe(`?author=Raissa`)
  expect(history.location.pathname).toBe(`/`)
})

// test(`loading species and cell type based on URL`, () => {
//   const history = createMemoryHistory()
//   history.push(`/search?species=hello&cellType=bye`)
//   const { getAllByLabelText } = render(
//     <Router history={history}>
//       <CellTypeSearch atlasUrl={`badURL`} history={history}/>
//     </Router>
//   )
//   expect(getAllByLabelText(`Characteristic value:`)).toExist()
// })
