import { useState, useCallback, useEffect } from 'react'

const calculatePosition = (position, oldDragPosition, newDragPosition) => {
  const differenceX = oldDragPosition.pageX - newDragPosition.pageX
  const differenceY = oldDragPosition.pageY - newDragPosition.pageY

  return {
    x: position.x + differenceX,
    y: position.y + differenceY,
  }
}

const getPosition = ({ current }, { x: startX, y: startY }) => {
  if (!current) {
    return {
      top: startX,
      left: startY,
    }
  }

  const bounding = current.getBoundingClientRect()
  const { x, y } = bounding

  return {
    x: x + startX,
    y: y + startY,
  }
}

const useDragger = (ref, start = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState(getPosition(ref, start))
  const [dragPosition, setDragPosition] = useState(0)
  const [dragStarted, startDrag] = useState(false)

  const startDragHandle = useCallback((e) => {
    const { pageX, pageY } = e

    startDrag(true)
    setDragPosition({ pageX, pageY })
  }, [])

  const moveHandle = (e) => {
    if (!dragStarted) return

    const { pageX, pageY } = e

    const newPosition = calculatePosition(position, e, dragPosition)

    setDragPosition({ pageX, pageY })
    setPosition(newPosition)
  }

  const stopHandle = (e) => {
    startDrag(false)

    const { pageX, pageY } = e

    const newPosition = calculatePosition(position, e, dragPosition)

    setDragPosition({ pageX, pageY })
    setPosition(newPosition)
  }

  useEffect(() => {
    if (dragStarted) {
      document.addEventListener('mousemove', moveHandle)
      document.addEventListener('mouseup', stopHandle)
    }

    return () => {
      document.removeEventListener('mousemove', moveHandle)
      document.removeEventListener('mouseup', stopHandle)
    }
  }, [dragStarted])

  useEffect(() => {
    setPosition(getPosition(ref, start))
  }, [ref.current])

  return { position, startDragHandle }
}

export default useDragger
