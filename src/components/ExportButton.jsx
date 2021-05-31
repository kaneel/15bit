import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, FileArrowDown } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton, ButtonGroup } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'
import { convertRGB15toRGB24 } from '../helpers'

const formats = {
  C: { type: '.c', name: 'C', method: buildC },
  PAL: { type: '.pal', name: 'PAL', method: buildPAL }
}

function buildC(palette, variable) {
  const colors = palette.map(generateData).filter(val => !!val).join(',')
  const file = new Blob([startC(variable, palette.length), "\t", ...colors, `\n};`], {type: 'text/plain'})

  return file
}

function buildPAL(palette) {
  const colors = palette.map(convertRGB15toRGB24).map(({r, g, b}) => `${r} ${g} ${b}`).join('\n')
  const start = `JASC-PAL\n0100\n${palette.length}\n`
  const file = new Blob([start, ...colors, '\n'], {type: 'text/plain'})

  return file
}

function startC(variable, length) { 
  // palette colors are packed by 2 so we need to divide and round up as we
  // have to account for odd colours
  length = Math.ceil(length / 2)
  return `const unsigned int ${variable}[${length}] = {\n` 
}

function getColor({r, g, b}) {
  const color = b<<10 | g<<5 | r
  const hex = color.toString(16)
  const zeros = new Array(4 - hex.length).fill(0).reduce(acc => `${acc}0`, '')

  return `${zeros}${hex}`
}

function generateData(color, i, arr) {
  if (i%2 != 0) return null;

  color = getColor(color)
  // in case of odd colours, we're adding a black colour
  const colorNext = getColor(arr[i + 1] || {r: 0, g: 0, b: 0})

  return `0x${colorNext}${color}`
}

function download(palette, { filename, variable }, { type, method }) {
    const contents = method(palette, variable)
    
    filename = `${filename}${type}`
  
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(contents, filename)
    } else { 
      const a = document.createElement("a")
      const url = URL.createObjectURL(contents)

      a.href = url
      a.download = filename
      document.body.appendChild(a);
      a.click()

      setTimeout(function() {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 0);
    }
}

const ExportForm = styled.form`
  position: absolute;
  width: 300px;
  margin: 0 auto;
  text-align: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  > div {
    align-items: center;
    flex-direction: column;
  }
`

const FormRow = styled.div`
  margin: .5em 0;
  text-align: left;

  p {
    margin: 0;
  }
`

const ExportButtonForm = ({ palette } ) => {
  const modalContext = useContext(ModalContext)
  const [ filename, changeFilename ] = useState('palette')
  const [ variable, changeVariable ] = useState('myPal')
  const [ format, changeFormat ] = useState('C')

  const onExport = useCallback((e) => {
    e.preventDefault()
    download(palette, { filename, variable }, formats[format])
  }, [palette, filename, variable, format])

  return (
    <ExportForm onSubmit={onExport}>
      <ModalContentWrapper>
        <ModalHeader>Export</ModalHeader>
        <div>
          <FormRow>
            <ButtonGroup>
              { Object.entries(formats).map(([key, { type, name }]) => (
                <SecondaryButton key={key} type="button" onClick={(e) => changeFormat(name)} active={name === format}>{type}</SecondaryButton>
              )) }
            </ButtonGroup>
          </FormRow>
          <FormRow>
            <p><label htmlFor="filename">Filename:</label></p>
            <input type="text" name="filename" value={filename} onChange={({target: {value }}) => changeFilename(value)} />
          </FormRow>
          {format === formats.C.name && (
            <FormRow>
              <p><label htmlFor="variable">Variable name:</label></p>
              <input type="text" name="variable" value={variable} onChange={({target: {value }}) => changeVariable(value)} />
            </FormRow>
          )}
        </div>
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
          <PrimaryButton type="submit"><FileArrowDown />OK!</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </ExportForm>
  )
}

const ExportButton = ({palette}) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<ExportButtonForm palette={palette} />)

  return <PrimaryButton disabled={palette.length === 0} small type="button" onClick={() => modalContext.openModal(modalContent)}><FileArrowDown /> Export</PrimaryButton>
}

export default ExportButton

