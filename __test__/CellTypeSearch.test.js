import React from 'react'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {Route, MemoryRouter} from 'react-router-dom'

import '@babel/polyfill'

import CellTypeSearch from '../src/CellTypeSearch'
import CellTypeView from '../src/CellTypeView'
import LoadingOverlay from '../src/LoadingOverlay'
import PlotSettingsDropdown from '../src/PlotSettingsDropdown'
import renderer from "react-test-renderer"

Enzyme.configure({ adapter: new Adapter() })

describe(`CellTypeSearch`, () => {
  const props = {
    history: {},
    resource: `json/metadata-search/expression/name/inferred_cell_type/value/`,
    host: `http://localhost:8080/gxa/sc/`,
    speciesList: [`Homo sapiens`],
    cellTypePayload: {"Homo sapiens":{"E-MTAB-5061":[`[beta cell]`,`[not available]`,`[pancreatic A cell]`]}}
  }

  beforeAll(() => {
    delete window.location
    window.location = { search: `?species=Homo%20sapiens&cellType=beta%20cell` }
  })

  test(`renders two dropdown boxes and one button for searching`, () => {
    const wrapper = shallow(<CellTypeSearch {...props} />)
    expect(wrapper.find(PlotSettingsDropdown).length).toBe(2)
    expect(wrapper.find(`button`).length).toBe(1)
  })

  test(`renders a loading overlay while loading`, () => {
    const wrapper = shallow(<CellTypeSearch {...props} />)
    expect(wrapper.find(LoadingOverlay).length).toBe(1)
  })

  test(`renders a cell type heatmap after loading`, () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ `/search?species=Homo%20sapiens&cellType=beta%20cell` ]}>
        <Route
          exact path={`/search`}
          render={
            ({history}) =>
              <CellTypeSearch
                {...props}
                history={history}/>
          } />
      </MemoryRouter>
    )
    expect(wrapper).toContainMatchingElement(CellTypeView)
  })

  test(`with no explicit props matches snapshot`, () => {
    const tree = renderer
      .create(<CellTypeSearch {...props}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

})
