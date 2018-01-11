import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Animated } from 'react-native'
import { ListItem } from 'native-base'

import styles from './styles'

const AnimatedListItem = Animated.createAnimatedComponent(ListItem)

// The idea with this is to use opacity when touching the list item.
// ios doesn't do that
class CustomListItem extends Component{
  // state = {
  //   opacity : new Animated.Value(0)
  // }

  render() {
    return (
      <AnimatedListItem
        // Add props in here
      />
    )
  }
}

CustomListItem.propTypes = {
  // translucent : PropTypes.bool,
  // animated : PropTypes.bool,
  // barStyle : PropTypes.oneOf([ 'default', 'light-content', 'dark-content' ]),
  // hidden : PropTypes.bool,
  // networkActivityIndicatorVisible : PropTypes.bool,
  // showHiddenTransition : PropTypes.oneOf([ 'slide', 'fade' ]),
  // backgroundColor : PropTypes.string,
}

export default CustomListItem