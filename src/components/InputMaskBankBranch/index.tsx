import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacityProps
} from 'react-native'

import { TextInputMask } from 'react-native-masked-text'

type InputProps = TextInputProps

export function InputMaskBankBranch({ ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInputMask
        type={'custom'}
        options={{
          mask: '999/9999'
        }}
        {...rest}
        style={styles.inputStyle} />
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10
  },
  inputStyle: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 14,
    marginTop: 2,
  }
})