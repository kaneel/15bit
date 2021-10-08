import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, Save } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from '../../components/Button'
import Alert from '../../components/Alert'
import ModalContext, {
  ModalHeader,
  ModalContentWrapper,
  ModalActions,
} from '../../context/Modal'
import { MicroPalette } from './Palette'

const SaveForm = styled.form`
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
  margin: 0.5em 0;
  text-align: left;

  p {
    margin: 0;
  }
`

const SaveButtonForm = ({ palette }) => {
  const modalContext = useContext(ModalContext)
  const [name, setName] = useState('palette')
  const palettes = JSON.parse(localStorage.getItem('palettes') || '{}')

  const onSave = useCallback(
    (e) => {
      e.preventDefault()
      palettes[name] = palette
      localStorage.setItem('palettes', JSON.stringify(palettes))
      modalContext.closeModal()
    },
    [name, palette, palettes]
  )

  return (
    <SaveForm onSubmit={onSave}>
      <ModalContentWrapper>
        <ModalHeader>Save</ModalHeader>
        <div>
          {!!palettes[name] && (
            <Alert type={Alert.TYPES.WARNING}>
              A palette with this name already exist, it will be overwritten
            </Alert>
          )}
          <FormRow>
            <p>
              <label htmlFor="name">Name:</label>
            </p>
            <input
              type="text"
              name="name"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
            />
          </FormRow>
        </div>
        <MicroPalette palette={palette} />
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}>
            <ArrowReturnLeft />
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">
            <Save />
            OK!
          </PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </SaveForm>
  )
}

const SaveButton = ({ palette }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => <SaveButtonForm palette={palette} />

  return (
    <PrimaryButton
      disabled={palette.length === 0}
      small
      type="button"
      onClick={() => modalContext.openModal(modalContent)}
    >
      <Save /> Save
    </PrimaryButton>
  )
}

export default SaveButton
