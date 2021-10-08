import { useState, cloneElement, Children } from 'react'

const ZCorrecter = ({ children }) => {
  const [indexZHigh, setZHigh] = useState(children.length - 1)

  return Children.map(children, (element, index) =>
    cloneElement(element, {
      isZHigh: indexZHigh === index,
      onClick: () => setZHigh(index),
    })
  )
}

export default ZCorrecter
