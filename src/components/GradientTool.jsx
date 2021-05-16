import React, { useCallback, useContext, useReducer } from 'react'
import styled from 'styled-components'

import Slider from './Slider'
import { PaletteSelector } from './Palette'
import { PrimaryButton, SecondaryButton } from './Button'
import ModalContext, { ModalHeader, ModalContentWrapper, ModalActions } from '../context/Modal'

const initialState = { gradientSteps: 1, selected: [] }

const ModalSubheader = styled.h2`
  text-align: left;
`

function reducer(state, action) {
  switch (action.type) {
    case 'selectColour': {
      const { selected } = state

      if (selected.includes(action.payload)) {
        return {
          ...state, 
          selected: selected.filter((item) => item !== action.payload)
        }
      }

      if(selected.length === 2) {
        return { ...state }
      }

      if(selected.length > 0 && 
        (selected[0] - action.payload !== 1 && 
        action.payload - selected[0] !== 1)
      ) {
        return { ...state }
      }

      return {
        ...state,
        selected: [...selected, action.payload]
      }
    }
    case 'changeGradientSteps': {
      return {
        ...state,
        gradientSteps: action.payload
      }
    }
  }
}

const GradientToolContentForm = styled.form`
  position: absolute;
  width :1040px;
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

const GradientToolContent = ({ palette, onGradientSubmit }) => {
  const modalContext = useContext(ModalContext)
  const [state, dispatch] = useReducer(reducer, {...initialState, palette: [...palette] });
  const { gradientSteps, selected } = state;

  // actions
  const changeGradientSteps = useCallback(({ target: { value } }) => dispatch({ type: 'changeGradientSteps', payload: value }))
  const selectColour = useCallback((index) => dispatch({ type: 'selectColour', payload: index }))

  return (
    <GradientToolContentForm onSubmit={e => { 
      e.preventDefault()
      onGradientSubmit(selected, gradientSteps)
      modalContext.closeModal()
    }}>
      <ModalContentWrapper>
        <ModalHeader>Gradient tool</ModalHeader>
        <ModalSubheader>Choose 2 adjacent colours</ModalSubheader>
        <PaletteSelector onSelect={selectColour} selected={selected} palette={palette} />
        <Slider label="Gradient steps" min="1" name="gradient-steps" value={gradientSteps} onChange={changeGradientSteps} />
        <ModalActions>
          <SecondaryButton type="button" onClick={modalContext.closeModal}>Cancel</SecondaryButton>
          <PrimaryButton disabled={selected.length < 2} type="submit">OK</PrimaryButton>
        </ModalActions>
      </ModalContentWrapper>
    </GradientToolContentForm>
  )
}

const GradientTool = ({ enabled, palette, onGradientSubmit }) => {
  const modalContext = useContext(ModalContext)
  const modalContent = () => (<GradientToolContent palette={palette} onGradientSubmit={onGradientSubmit} />)

  return (
    <SecondaryButton small disabled={!enabled} onClick={() => modalContext.openModal(modalContent)}>Gradient</SecondaryButton>
  )
}

export default GradientTool

