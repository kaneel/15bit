function bitmapStoreReducer(state, action) {
  switch (action.type) {
    case 'changeCurrentColor': {
      return {
        ...state,
        currentColor: action.payload,
      }
    }
    case 'pushData': {
      return {
        ...state,
        data: [...state.data, action.payload],
      }
    }
    case 'setSize': {
      return {
        ...state,
        size: action.payload,
      }
    }
    case 'setCode': {
      return {
        ...state,
        code: action.payload,
      }
    }
    default:
      return state
  }
}

export default bitmapStoreReducer
