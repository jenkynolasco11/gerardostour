const appMetaDefault = {
  cantAuth : false,
  badAuth : false,
  // isViewingInfo : false,
}

export const meta = (store=appMetaDefault, action) => {
  switch(action.type) {
    case 'CANT_AUTH_META':
      return { ...store, ...action.payload }
    case 'BAD_AUTH_META':
      return { ...store, ...action.payload }
    case 'CLEAR_META':
      return appMetaDefault
    default:
      return store
  }
}