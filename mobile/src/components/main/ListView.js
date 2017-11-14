import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native'

import ListItem from './ListItem'

const renderHeader = (title /*, onPress*/) => (
  <TouchableWithoutFeedback
//    onPress={ onPress }
    onPress={ () => console.log(`${ title } pressed`)}
  >
    <View>
      <Text>{ title }</Text>
    </View>
  </TouchableWithoutFeedback>
)

class ListView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // style : props.rides.map((_,i) => ({ [i] : { animatedHeight : {}}}))
      style : {},
    }

    // this._setHeight = this._setHeight.bind(this)
    // this._startAnimation = this._startAnimation.bind(this)
    // this._toggleCollapse = this._toggleCollapse.bind(this)
    // this._onToggleCollapse = this._onToggleCollapse.bind(this)
  }

  // _setHeight(e, i) {
  //   const { height } = e.nativeEvent.layout
  //   const { style } = this.state

  //   // setTimeout(() => {
  //   // this.setState({
  //   //   style : {
  //   //     ...style,
  //   //     [`${i}`] : { 
  //   //       height,
  //   //       collapsed : false,
  //   //       animated : {
  //   //         height : new Animated.Value(height),
  //   //         opacity : new Animated.Value(1),
  //   //       }
  //   //     }
  //   //   }
  //   // })
  //   // }, 1000)
  // }

  // _toggleCollapse(i) {
  //   return () => this._onToggleCollapse(i)
  // }

  // _startAnimation(height, opacity, hv, ov, i) {
  //   const self = this
  //   Animated.parallel([
  //     Animated.timing(height,{
  //       toValue : hv,
  //       duration : 1000,
  //       easing : Easing.in
  //     }),
  //     Animated.timing(opacity,{
  //       toValue : ov,
  //       duration : 1000,
  //       easing : Easing.linear
  //     }),
  //   ]).start(() => {
  //     self.setState({
  //       style : {
  //         ...self.state.style,
  //         [`${i}`] : {
  //           ...self.state.style[i],
  //           collapsed : ov ? false : true
  //         }
  //       }
  //     })
  //   })
  // }

  // _onToggleCollapse(i) {
  //   const { style } = this.state
  //   const obj = style[i]

  //   console.log(style)
  //   // console.log(obj)
  //   // const { height, opacity } = obj.animated

  //   // if(obj) {
  //   //   if(obj.collapsed) this._startAnimation( height, opacity, obj.height, 1, i)
  //   //   else this._startAnimation( height, opacity, 0, 0, i)
  //   // }
  // }

  componentDidMount() {
    // console.log(this)
  }

  render() {
    const { onPress, rides } = this.props
    const { style } = this.state
    let key = 0

    const getStyle = i => style[`${i}`] ? style[`${i}`].animated : {}
    
    return (
      rides.map((ride, i) => (
        // <View key={i} onLayout={ (e) => this._setHeight(e,i)>
        <View key={i}>
          <Animated.View style={ getStyle(i)}>
            { renderHeader(ride.day.slice(0,10) /*, this._toggleCollapse(i)*/) }
            { 
              ride.content.map( ride => (
                <ListItem key={key} {...{ index : key++, ride, onPress}} />
              ))
            }
          </Animated.View>
        </View>
      ))
    )
  }
}

export default ListView