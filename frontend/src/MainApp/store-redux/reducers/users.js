// const defaultState = {
//   users : [],
//   count : 0
// }

// export const users = (state = defaultState, action) => {
//   switch(action.type) {
//     case 'ADD_USERS' : 
//       return { 
//         ...state, 
//         users : [].concat(action.payload.users), 
//         count : action.payload.count 
//       }
//     default :
//       return state
//   }
// }