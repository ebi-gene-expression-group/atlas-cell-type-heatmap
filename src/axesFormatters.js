import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDOMServer from 'react-dom/server'

import escapedHtmlDecoder from 'he'

const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component))

const ExperimentIconDiv = styled.div`
  background-color: ${props => props.background};
  color: ${props => props.color};
  border-radius: 50%;
  font-size: 16px;
  height: 20px;
  width: 20px;
  text-align: center;
  padding-top: 1px;
  vertical-align: middle;
  margin-right: 6px;
  opacity: 0.4;
  display: inline-block;
`

const XAxisLabel = ({experimentAccession, technologyType}) => {
  const technologyTypeIcon = [ `10xV2`, `Drop-seq`, `10xV3`].includes(technologyType) ?
    <ExperimentIconDiv key={experimentAccession} background={`green`} color={`white`} data-toggle={`tooltip`} data-placement={`bottom`}
      title={`Droplet CPM`}>C</ExperimentIconDiv> :
    <ExperimentIconDiv key={experimentAccession} background={`orangered`} color={`white`} data-toggle={`tooltip`} data-placement={`bottom`}
      title={`Smart-like TPM`}>T</ExperimentIconDiv>

  const geneNameWithLink =
    <a href={`http://www.ebi.ac.uk/gxa/sc/experiments/${experimentAccession}`} style={{border: `none`, color: `#148ff3`}}>
      {[technologyTypeIcon, experimentAccession]}
    </a>

  return (
    <span title={experimentAccession}>
      {geneNameWithLink}
    </span>
  )
}

const YAxisLabel = ({species, geneSymbol}) => {
  const geneSearchResultUrl = `https://www.ebi.ac.uk/gxa/sc/search?q=${geneSymbol}&species=${species}`
  return <a href={geneSearchResultUrl} style={{border: `none`, color: `#148ff3`}}>
    {geneSymbol}
  </a>
}

XAxisLabel.propTypes = {
  experimentAccession: PropTypes.string.isRequired,
  technologyType: PropTypes.string.isRequired
}

YAxisLabel.propTypes = {
  species: PropTypes.string.isRequired,
  geneSymbol: PropTypes.string.isRequired
}


const XAxisFormatter = value => reactToHtml(
  <XAxisLabel
    experimentAccession={value.experimentAccession}
    technologyType={value.technologyType}
  />
)

const YAxisFormatter = (species, geneSymbol) => {
  return reactToHtml(
    <YAxisLabel
      species={species.species}
      geneSymbol={geneSymbol}
    />
  )
}

export {XAxisFormatter, YAxisFormatter}
