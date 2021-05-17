import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, Save } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'

function start(variable, length) { 
  // palette colors are packed by 2 so we need to divide and round up as we
  // have to account for odd colours
  length = Math.ceil(length / 2)
  return `const unsigned int ${variable}[${length}] = {\n` 
}
const end = `\n};`

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

function download(palette, filename, variable) {
    const colors = palette.map(generateData).filter(val => !!val).join(',')
    const file = new Blob([start(variable, palette.length), "\t", ...colors, end], {type: 'text/plain'})
    
    filename = `${filename}.c`
  
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, filename)
    } else { 
      const a = document.createElement("a")
      const url = URL.createObjectURL(file)

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

  const onExport = useCallback((e) => {
    e.preventDefault();
    download(palette, filename, variable), [palette, filename, variable]
  })

  return (
    <ExportForm onSubmit={onExport}>
      <ModalContentWrapper>
        <ModalHeader>Save as a file</ModalHeader>
        <div>
          <FormRow>
            <p><label htmlFor="filename">Filename:</label></p>
            <input type="text" name="filename" value={filename} onChange={({target: {value }}) => changeFilename(value)} />
          </FormRow>
          <FormRow>
            <p><label htmlFor="variable">Variable name:</label></p>
            <input type="text" name="variable" value={variable} onChange={({target: {value }}) => changeVariable(value)} />
          </FormRow>
        </div>
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
          <PrimaryButton type="submit"><Save />OK!</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </ExportForm>
  )
}

const ExportButton = ({palette}) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<ExportButtonForm palette={palette} />)

  return <PrimaryButton disabled={palette.length === 0} small type="button" onClick={() => modalContext.openModal(modalContent)}><Save /> SAVE</PrimaryButton>
}

export default ExportButton

