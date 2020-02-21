import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const LegendItem = styled.div`
  display: inline-block;
  margin-left: 8px;
  padding: 4px;
  vertical-align: middle;
  cursor: default;
  color: #ccc;
  }
`

const LegendRectangle = styled.div `
  width: 12px;
  height: 12px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
  background: ${(props) => props.background};
`

const VerticallyAlignedSpan = styled.span`
  vertical-align: middle;
`

const DataSeriesHeatmapLegendBox = (props) =>
  <LegendItem>
    <LegendRectangle background={props.colour} />
    <VerticallyAlignedSpan>{props.name}</VerticallyAlignedSpan>
  </LegendItem>

DataSeriesHeatmapLegendBox.propTypes = {
  name: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
}

const HeatmapLegendContainer = styled.div`
  color: #606060;
  border: 0 solid olive;
  text-align: right;
`

const InfoIcon = styled.span`
  ::before {
    font-family: 'EBI-Generic', 'sans-serif';
    font-size: 150%;
    color: #7e7e7e;
    content: attr(data-icon);
    margin: 0 0 0 0;
  }
`

const ExperimentIconDiv = styled.div`
  background-color: ${props => props.background};
  color: ${props => props.color};
  border-radius: 50%;
  font-size: 16px;
  height: 20px;
  width: 20px;
  text-align: center;
  padding-left: 1px;
  vertical-align: middle;
  margin-right: 6px;
  margin-left: 10px;
  opacity: 0.4;
  display: inline-block;
`

const DataSeriesHeatmapLegend = (props) =>
  <HeatmapLegendContainer>
    <ExperimentIconDiv background={`green`} color={`white`}>C</ExperimentIconDiv>CPM
    <ExperimentIconDiv background={`orangered`} color={`white`}>T</ExperimentIconDiv>TPM
    <br/>
    <LegendItem>
      <InfoIcon
        data-icon="i" data-toggle="tooltip" data-placement="bottom"
        title={props.title}/>
    </LegendItem>
    {props.legendItems.map(legendItemProps => <DataSeriesHeatmapLegendBox {...legendItemProps} />)}
    <DataSeriesHeatmapLegendBox
      key={props.missingValueLabel}
      name={props.missingValueLabel}
      colour={props.missingValueColour}
      on={true}
    />

  </HeatmapLegendContainer>

DataSeriesHeatmapLegend.propTypes = {
  legendItems: PropTypes.array,
  title: PropTypes.string,
  missingValueColour: PropTypes.string,
  missingValueLabel: PropTypes.string
}

DataSeriesHeatmapLegend.defaultProps = {
  legendItems: [{colour: `#0000b3`, key: `High`, name: `High`, on: true},
    {colour: `#0000ff`,key: `Medium`, name: `Medium`, on: true},
    {colour: `#8cc6ff` ,key: `Low`, name: `Low`, on: true}],
  title: `Single cell expression CPM. ` +
    `Low: <10, Medium: 10-1,000, ` +
    `High: >1,000. `,
  missingValueColour: `white`,
  missingValueLabel: `No data available`
}

export default DataSeriesHeatmapLegend
