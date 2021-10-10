import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react'

import { convertRGB15toRGB24 } from '../../helpers'
import KeyboardContext, { KEYS } from '../../context/Keyboard'
import Alert from '../../components/Alert'
import { PrimaryButton } from '../../components/Button'

const CodeArea = ({ value, onGenerate, onChange, palette }) => {
  const [error, setError] = useState(null)
  const button = useRef(null)
  const { keys } = useContext(KeyboardContext)

  const generate = useCallback(
    (e) => {
      e.preventDefault()

      const imageData = new ImageData(240, 160)
      setError(null)

      try {
        const fn = new Function('imageData', 'x', 'y', 'pal', value)

        for (let y = 0; y < 160; y++) {
          for (let x = 0; x < 240; x++) {
            fn(imageData, x, y, palette.map(convertRGB15toRGB24))
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
      <p>fn(imageData, x, y, pal)</p>
      <form action="" onSubmit={generate}>
        <textarea rows="4" cols="50" value={value} onChange={onChange} />
        <p>
          <PrimaryButton type="submit" ref={button}>
            generate
          </PrimaryButton>
        </p>
      </form>
    </>
  )
}

export default CodeArea
