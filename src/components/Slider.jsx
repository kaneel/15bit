import React from 'react'
import styled from 'styled-components'

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

const SliderRow = styled.p`
  display: flex;
  margin: 0 0 .5em;

  input {
    margin: 0 4px;
  }
`


const Slider = ({ label, name, value, onChange, min, max }) => (
  <SliderWrapper>
    <SliderLabel htmlFor={name}>{label}</SliderLabel>
    <SliderRow>
      <input type="range" min={min || 0} max={max || 0x1f} value={value} name={name} onChange={onChange}/>
      <SliderInput type="text" value={value} onChange={e => {
        let { target: { value } } = e;
        
        if (value > 31) value = value.substr(0, 1)

        onChange({ target: { value } })
      }} />
    </SliderRow>
  </SliderWrapper>
)

export default Slider
