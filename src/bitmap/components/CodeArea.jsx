import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react'

import KeyboardContext, { KEYS } from '../../context/Keyboard'
import Alert from '../../components/Alert'

const CodeArea = ({ value, onGenerate, onChange }) => {
  const [error, setError] = useState(null)
  const button = useRef(null)
  const { keys } = useContext(KeyboardContext)

  const generate = useCallback(
    (e) => {
      e.preventDefault()

      const imageData = new ImageData(240, 160)
      setError(null)

      try {
        const fn = new Function('imageData', 'x', 'y', value)

        for (let y = 0; y < 160; y++) {
          for (let x = 0; x < 240; x++) {
            fn(imageData, x, y)
          }
        }
      } catch (e) {
        setError(e)
      }

      onGenerate(imageData)
    },
    [value]
  )

  useEffect(() => {
    if (keys.includes(KEYS.META) && keys.includes(KEYS.ENTER))
      button.current.click()
  }, [keys])

  return (
    <>
      {error && <Alert type={Alert.TYPES.ERROR}>{error.message}</Alert>}
      <p>fn(imageData, x, y)</p>
      <form action="" onSubmit={generate}>
        <textarea value={value} onChange={onChange} />
        <button type="submit" ref={button}>
          generate
        </button>
      </form>
    </>
  )
}

export default CodeArea
