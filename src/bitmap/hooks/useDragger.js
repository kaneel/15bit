import { useState, useCallback, useEffect } from 'react'

const getOffset = (direction) =>
  function m(node) {
    if (node === document) return 0
    const value = node[direction]

    return value + m(node.parentNode)
  }

const getOffsetTop = getOffset('offsetTop')
const getOffsetLeft = getOffset('offsetLeft')

const calculatePosition = (position, oldDragPosition, newDragPosition) => {
  const differenceX = newDragPosition.pageX - oldDragPosition.pageX
  const differenceY = newDragPosition.pageY - oldDragPosition.pageY

  return {
    x: position.x + differenceX,
    y: position.y + differenceY,
  }
}

const getPosition = ({ current }, { x: startX, y: startY }) => {
  if (!current) {
    return {
      x: startX,
      y: startY,
    }
  }

  const parentTop = getOffsetTop(current.parentNode)
  const parentLeft = getOffsetLeft(current.parentNode)
  const bounding = current.getBoundingClientRect()
  const { top, left } = bounding

  return {
    x: left - parentLeft,
    y: top - parentTop,
  }
}

const useDragger = (ref, start = { x: 0, y: 0 }, onDragEnd) => {
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

    const newPosition = calculatePosition(position, dragPosition, e)

    setDragPosition({ pageX, pageY })
    setPosition(newPosition)
  }

  const stopHandle = (e) => {
    startDrag(false)

    const { pageX, pageY } = e

    const newPosition = calculatePosition(position, dragPosition, e)

    setDragPosition({ pageX, pageY })
    setPosition(newPosition)
    if (onDragEnd) {
      onDragEnd(newPosition)
    }
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
