import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import '@babel/polyfill'
import CellTypeHighchartsHeatmap from '../src/CellTypeHighchartsHeatmap'

Enzyme.configure({ adapter: new Adapter() })

describe(`HighchartsHeatmap`, () => {
  const props = {
    heatmapData: [1, 2, 4, 5, 6.3, 3.3],
    axisData: {x:[`1`, `2`], y: [`a`, `b`, `c`]}
  }
  test(`creates plotlines for every cluster if data isn't filtered`, () => {
    const wrapper = shallow(<CellTypeHighchartsHeatmap {...props}/>)
    const chartOptions = wrapper.props().options

    expect(chartOptions.yAxis.categories).toHaveLength(3)
    expect(chartOptions.xAxis.categories).toHaveLength(2)
  })

})
