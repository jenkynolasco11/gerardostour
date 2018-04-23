import { LOGGED_IN } from '../const'

const defaultState = {
    isLoggedIn : false
}

const app = (state = defaultState, { type, payload }) => {
    switch(type) {
        case LOGGED_IN:
            return { ...state, isLoggedIn : true }
        default:
            return { ...state }
    }
}

export default app
