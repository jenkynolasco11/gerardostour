import React from 'react'
import { 
  ScrollView,
  View,
  // TouchableWithoutFeedback,
  Text,
} from 'react-native'

import styles from './styles'

const Body = props => (
    <View style={[ 
      styles.body,
      styles.flex_4
    ]}>
      <ScrollView>
        <Text>Hey</Text>
      </ScrollView>
    </View>
)

export default Body