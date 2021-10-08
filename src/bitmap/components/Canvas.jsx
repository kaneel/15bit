import React, { Component, createRef } from 'react'
import styled from 'styled-components'

import Positioner from './Positioner'
import { convertRGB15toRGB24 } from '../../helpers'

const Container = styled.div`
  position: relative;
  border: 1px solid;
  display: flex;
  background: #999;
  width: 100%;
  height: 100%;
  overflow: hidden;

  canvas {
    width: 240px;
    height: 160px;
    background: #fff;
  }
`

const plot = (ctx, color, thickness, x, y) => {
  const imageData = ctx.getImageData(0, 0, 240, 160)
  const colorRGB24 = convertRGB15toRGB24(color)
  const ht = Math.floor(thickness / 2)

  for (let xx = x - ht; xx <= x + ht; xx++) {
    for (let yy = y - ht; yy <= y + ht; yy++) {
      const point = (yy * 240 + xx) * 4
      imageData.data[point] = colorRGB24.r
      imageData.data[point + 1] = colorRGB24.g
      imageData.data[point + 2] = colorRGB24.b
      imageData.data[point + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

const plotLine = (ctx, color, thickness, x0, y0, x1, y1) => {
  var dx = Math.abs(x1 - x0),
    sx = x0 < x1 ? 1 : -1
  var dy = Math.abs(y1 - y0),
    sy = y0 < y1 ? 1 : -1
  var err = (dx > dy ? dx : -dy) / 2

  while (true) {
    plot(ctx, color, thickness, x0, y0)
    if (x0 === x1 && y0 === y1) break
    var e2 = err
    if (e2 > -dx) {
      err -= dy
      x0 += sx
    }
    if (e2 < dy) {
      err += dx
      y0 += sy
    }
  }
}

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.ref = createRef()
    this.handlePaint = this.handlePaint.bind(this)
    this.startDrawing = this.startDrawing.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)
  }

  componentDidMount() {
    this.ctx.imageSmoothingEnabled = false
    const { data } = this.props

    if (data.length) this.ctx.putImageData(data[data.length - 1], 0, 0)
  }

  componentDidUpdate() {
    const { data } = this.props

    if (data.length) this.ctx.putImageData(data[data.length - 1], 0, 0)
  }

  handlePaint(e, start) {
    const { isDrawing } = this
    const { disabled, color, size } = this.props
    const { left, top } = this.ref.current.getBoundingClientRect()

    if (!isDrawing || disabled) return

    const { clientX, clientY } = e
    const x = Math.floor(clientX - left)
    const y = Math.floor(clientY - top)

    if (!start) {
      plotLine(this.ctx, color, size, this.lastX, this.lastY, x, y)
    } else {
      plot(this.ctx, color, size, x, y)
    }

    this.lastX = x
    this.lastY = y
  }

  startDrawing(e) {
    this.isDrawing = true
    this.handlePaint(e, true)
  }

  stopDrawing() {
    const { onPaint } = this.props
    const data = this.ctx.getImageData(0, 0, 240, 160)

    onPaint(data)
    this.isDrawing = false
  }

  render() {
    return (
      <Container onMouseDown={this.startDrawing} onMouseUp={this.stopDrawing}>
        <Positioner containerDimensions={{ width: 600, height: 600 }}>
          <canvas
            width={240}
            height={160}
            onMouseMove={this.handlePaint}
            ref={this.ref}
          />
        </Positioner>
      </Container>
    )
  }

  get ctx() {
    return this._ctx || (this._ctx = this.ref.current.getContext('2d'))
  }
}

export default Canvas
