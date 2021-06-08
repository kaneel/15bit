import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, FileArrowUp } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from '../../components/Button'
import Alert from '../../components/Alert'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../../context/Modal'
import { MicroPalette } from './Palette'
import { convertRGBToHex, convertRGB24toRGB15 } from '../../helpers'

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
  const [palette, setPalette] = useState([])
  const [error, setError] = useState(null)

  const handleFileChange = useCallback(e => {
    const { target: { files } } = e
    e.preventDefault()

    const fr  = new FileReader()
    fr.onload = e => {
      const contents = e.target.result.split('\n')

      /*
       * 'JASC-PAL
       *  0100
       *  number of colors
       *  R G B
       */
      const header = contents.shift()

      if (header !== 'JASC-PAL') {
        setPalette([])
        setError(new Error('Not a JASC PAL'))
        return;
      }

      // remove the numbers on the second row
      contents.shift()
      // remove the palette length
      contents.shift()

      const palette = contents.map(content => {
        if (content === '') return null

        const [ rr, gg, bb ] = content.split(' ')
        const {r, g, b} = convertRGB24toRGB15({ r: rr, g: gg, b: bb })
        const hex = convertRGBToHex({r, g, b})

        return {
          r,
          g, 
          b, 
          hex 
        }
      }).filter(color => !!color)

      setError(null)
      setPalette(palette)
    }

    fr.readAsText(files[0])
  })

  return (
    <ImportForm onSubmit={e => { 
        e.preventDefault()
        onPaletteSubmit(palette)
        modalContext.closeModal()
      }} enctype="multipart/form-data">
      <ModalContentWrapper>
        <ModalHeader>Import</ModalHeader>
        <MicroPalette palette={palette} />
        <div>
          { !error && palette.length === 0 && <Alert type={Alert.TYPES.WARNING}>/!\ Only for a JASC PAL atm, will try later importing different swatches/palettes</Alert> }
          { error && <Alert type={Alert.TYPES.ERROR}>{error.message}</Alert>}
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

