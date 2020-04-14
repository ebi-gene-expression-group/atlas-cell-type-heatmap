import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import DataSeriesHeatmapLegend from '../src/DataSeriesHeatmapLegend'
import { DataSeriesHeatmapLegendBox } from '../src/DataSeriesHeatmapLegend'

Enzyme.configure({ adapter: new Adapter() })

describe(`PlotSettingsDropdown`, () => {
  test(`contains four coloured legend boxes with default props`, () => {
    const wrapper = shallow(<DataSeriesHeatmapLegend />)
    expect(wrapper.find(DataSeriesHeatmapLegendBox).length).toBe(4)
  })

  test(`with no explicit props matches snapshot`, () => {
    const tree = renderer
      .create(<DataSeriesHeatmapLegend />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
