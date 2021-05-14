import React from 'react'
import styled from 'styled-components'

const SliderWrapper = styled.div`
  margin: 1em 0;
`

const SliderInput = styled.input`
  width: 20px;
`

const SliderRow = styled.p`
  display: flex;
  margin: .5em 0;

  input {
    margin: 0 4px;
  }
`


const Slider = ({ label, name, value, onChange }) => (
  <SliderWrapper>
    <label htmlFor={name}>{label}</label>
    <SliderRow>
      <input type="range" min={0} max={0x1f} value={value} name={name} onChange={onChange}/>
      <SliderInput type="text" value={value} onChange={e => {
        let { target: { value } } = e;
        
        if (value > 31) value = value.substr(0, 1)

        onChange({ target: { value } })
      }} />
    </SliderRow>
  </SliderWrapper>
)

export default Slider
