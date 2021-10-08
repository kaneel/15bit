import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { ArrowReturnLeft, ArrowCounterclockwise } from '@styled-icons/bootstrap'

import { PrimaryButton, SecondaryButton } from '../../components/Button'
import Alert from '../../components/Alert'
import ModalContext, {
  ModalHeader,
  ModalContentWrapper,
  ModalActions,
} from '../../context/Modal'

const ResetForm = styled.form`
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

const ResetButtonForm = ({ onReset }) => {
  const modalContext = useContext(ModalContext)

  const resetPalette = useCallback((e) => {
    e.preventDefault()
    modalContext.closeModal()
    onReset()
  }, [])

  return (
    <ResetForm onSubmit={resetPalette}>
      <ModalContentWrapper>
        <ModalHeader>Reset</ModalHeader>
        <Alert type={Alert.TYPES.WARNING}>
          Are you sure you want to reset the palette ?
        </Alert>
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}>
            <ArrowReturnLeft />
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">
            <ArrowCounterclockwise />
            OK!
          </PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </ResetForm>
  )
}

const ResetButton = ({ onReset }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => <ResetButtonForm onReset={onReset} />

  return (
    <PrimaryButton
      small
      type="button"
      onClick={() => modalContext.openModal(modalContent)}
    >
      <ArrowCounterclockwise /> Reset
    </PrimaryButton>
  )
}

export default ResetButton
