import React from 'react'
import styled from 'styled-components'

import { SecondaryButton } from './Button'

const SliderWrapper = styled.div`
  margin: 1em 0;
  display: flex;
  flex-direction: column;
`

const SliderLabel = styled.label`
  text-align: left;
`

const SliderInput = styled.input`
  width: 20px;
`

const SliderRow = styled.div`
  display: flex;
  margin: 0 0 .5em;

  input {
    margin: 0 4px;
  }
`

const SliderButtonGroup = styled.div`
  display: flex;

  button, input {
    margin: 0;
    border: 1px solid;
  }

  button:active {
    transform: none;
    padding-top: 5px;
    padding-bottom: 3px;
  }

  input:focus {
    outline: none;
  }

  button:first-child {
    border-right: 0;
  }

  button:last-child {
    border-left: 0;
  }

  input {
    text-align: center;
  }
`


const Slider = ({ label, name, value, onChange, min = 0, max = 0x1f }) => (
  <SliderWrapper>
    <SliderLabel htmlFor={name}>{label}</SliderLabel>
    <SliderRow>
      <input type="range" min={min} max={max} value={value} name={name} onChange={onChange}/>
      <SliderButtonGroup>
        <SecondaryButton type="button" small onClick={() => onChange({target: { value: Math.max(min, value - 1) } })}>-</SecondaryButton>
        <SliderInput readOnly="readonly" type="text" value={value}  />
        <SecondaryButton type="button" small onClick={() => onChange({target: { value: Math.min(max, value + 1) } })}>+</SecondaryButton>
      </SliderButtonGroup>
    </SliderRow>
  </SliderWrapper>
)

export default Slider
