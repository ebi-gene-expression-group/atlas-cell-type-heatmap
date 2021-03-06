import React from 'react'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import CalloutAlert from '../src/CalloutAlert'
import CellTypeView from '../src/CellTypeView'
import CellTypeHighchartsHeatmap from '../src/CellTypeHighchartsHeatmap'

Enzyme.configure({ adapter: new Adapter() })

describe(`CellTypeHeatmap`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  const props = {
    host: `foo/`,
    resource: `bar`
  }

  const validProps = {
    host: 'http://localhost:8080/gxa/sc/',
    resource: 'json/experiments/celltype/name/organism_part/value/pancreas'
  }

  test(`Renders error if API request is unsuccessful`, () => {
    const wrapper = shallow(<CellTypeView {...props} />)
    expect(wrapper.exists(CalloutAlert)).toBe(true)
  })

  test(`Renders heatmap if API request is successful`, () => {
    const wrapper = mount(<CellTypeView {...validProps} />)

    Promise
      .resolve(wrapper)
      .then(() => wrapper.update())
      .then(() => wrapper.update())
      .then(() => {
        expect(wrapper.exists(CellTypeHighchartsHeatmap)).toBe(true)
      })
  })

})
