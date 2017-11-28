// const defaultState = {
//   switches : [],
//   which : null,
//   passingProps : {},
//   history : [],
// }

// export const router = (state = defaultState, action) => {
//   switch(action.type) {
//     case 'ADD_SWITCH' :
//       return { ...state, switches : [].concat(action.payload) }
//     case 'ANOTHER' :
//       return { ...state }
//     case 'POP_HISTORY' :
//       return {
//         ...state,
//         history : [].concat(state.history.slice(0, -1))
//       }
//     case 'PUSH_HISTORY' :
//       return {
//         ...state,
//         history : [].push(state.history, action.payload)
//       }
//     case 'SWITCH' :
//       return {
//         ...state,
//         which : action.payload.which,
//         passingProps : action.payload.props || {},
//       }
//     default :
//       return state
//   }
// }