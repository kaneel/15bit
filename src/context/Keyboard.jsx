import React, { Component, createContext } from 'react'

const KEYS = {
  SPACE: ' ',
  ENTER: 'Enter',
  META: 'Meta',
}
const initialState = { keys: [] }
const KeyboardContext = createContext({ ...initialState })

class KeyboardProvider extends Component {
  state = { ...initialState }

  constructor(props) {
    super(props)

    this.onKeydown = this.onKeydown.bind(this)
    this.onKeyup = this.onKeyup.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('keyup', this.onKeyup)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
  }

  onKeydown(e) {
    const { keys } = this.state
    const { key } = e

    if (!keys.includes(key)) {
      this.setState({
        keys: [...keys, key],
      })
    }
  }

  onKeyup(e) {
    const { keys } = this.state
    const { key } = e

    if (keys.includes(key)) {
      this.setState({
        keys: keys.filter((c) => key !== c),
      })
    }
  }

  render() {
    const { children } = this.props

    return (
      <KeyboardContext.Provider value={this.state}>
        {children}
      </KeyboardContext.Provider>
    )
  }
}

export default KeyboardContext
export { KEYS, KeyboardProvider }
