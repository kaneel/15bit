import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, FileArrowUp } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from './Button'
import Warning from './Warning'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'
import { PaletteSelector, MicroPalette } from './Palette'
import { convertRGBToHex, convertRGB24toRGB15 } from '../helpers'

const ImportForm = styled.form`
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

const ImportButtonForm = ({ onPaletteSubmit }) => {
  const modalContext = useContext(ModalContext)
  const [contents, changeContents] = useState('')
  const [palette, changePalette] = useState([])
  const [error, changeError] = useState(null)

  const submitImport = useCallback(e => {
  })

  const handleFileChange = useCallback(e => {
    const { target: { files } } = e
    e.preventDefault()

    const fr  = new FileReader()
    fr.onload = e => {
      const contents = e.target.result.split('\n')

      console.log(contents)
      /*
       * 'JASC-PAL
       *  0100
       *  number of colors
       *  R G B
       */
      const header = contents.unshift()

      if (header !== 'JASC PAL') return changeError(new Error('Not JASC PAL'))

      // remove the numbers on the second row
      contents.unshift()

      const palette = new Array(contentsLength).fill(null).map((_, i) => {
        const [r, g, b] = convertRGB24toRGB15(contents[i].split(' '))
        const ratio = 31/255

        hex = convertRGBToHex({r, g, b})

        return {
          r,
          g, 
          b, 
          hex 
        }
      })

      changeContents(e.target.result)
      changePalette(palette)
    }

    fr.readAsText(files[0])
  })

  return (
    <ImportForm onSubmit={e => { 
        e.preventDefault()
        submitImport(palette)
        modalContext.closeModal()
      }} enctype="multipart/form-data">
      <ModalContentWrapper>
        <ModalHeader>Import</ModalHeader>
        <MicroPalette palette={palette} />
        <div>
          <Warning>/!\ Only for a JASC PAL atm, will try later importing different swatches/palettes</Warning>
          { error && <p>{error.message}</p>}
          <FormRow>
            <p><label htmlFor="file">Filename:</label></p>
            <input onChange={handleFileChange} accept=".pal" type="file" name="file" />
          </FormRow>
        </div>
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}><ArrowReturnLeft />Cancel</SecondaryButton>
          <PrimaryButton type="submit"><FileArrowUp />OK!</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </ImportForm>
  )
}

const ImportButton = ({ onImportSubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<ImportButtonForm onPaletteSubmit={onImportSubmit} />)

  return <PrimaryButton small type="button" onClick={() => modalContext.openModal(modalContent)}><FileArrowUp /> Import</PrimaryButton>
}

export default ImportButton

