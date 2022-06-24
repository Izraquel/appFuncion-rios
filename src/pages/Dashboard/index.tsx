import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  View,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { InputMaskCpf } from '../../components/InputMaskCpf'
import { InputMaskSalary } from '../../components/InputMaskSalary'
import { InputMaskBankBranch } from '../../components/InputMaskBankBranch'
import { InputMaskBirthDate } from '../../components/InputMaskBirthDate'

export function Dashboard() {
  const [cpf, setCpf] = useState('')
  const [name, setName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [account, setAccount] = useState('')
  const [salary, setSalary] = useState('')
  const [birthDate, setBirthDate] = useState('')

  async function handleAddUser() {
    const employee = {
      id: new Date().getTime(),
      cpf,
      name,
      bankBranch,
      account,
      salary: formatSalary(salary),
      birthDate: convertDate(birthDate)
    }
    console.log(employee)
    try {
      const data = await AsyncStorage.getItem('@si:employees')
      const currentData = data ? JSON.parse(data) : []
      const dataFormatted = [
        ...currentData,
        employee
      ]
      await AsyncStorage.setItem('@si:employees',
        JSON.stringify(dataFormatted))
    } catch (err) {
      console.log(err)
      Alert.alert('Error ao salvar o funcionário')
    }
    setCpf('')
    setName('')
    setBankBranch('')
    setAccount('')
    setSalary('')
    setBirthDate('')
  }

  async function loadDataEmployee() {
    const data = await AsyncStorage.getItem('@si:employees')
    const currentData = data ? JSON.parse(data) : []
  }

  function convertDate(data: string) {
    const dateArray = data.split('/')
    return new Date(dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2])
  }

  function formatSalary(salary: string) {
    return parseFloat(
      salary
        .slice(2, salary.length)
        .replace('.', '')
        .replace(',', '.')
    )
  }

  useEffect(() => {
    loadDataEmployee()
  }, [])

  return (
    <View style={styles.container}>
      <Header title='Cadastro Funcionários' />
      <ScrollView>
        <InputMaskCpf
          placeholder='CPF'
          placeholderTextColor='#5636d3'
          value={cpf}
          keyboardType="numeric"
          onChangeText={value => setCpf(value)}
        />

        <Input
          placeholder='Nome'
          placeholderTextColor='#5636d3'
          value={name}
          autoCapitalize='words'
          onChangeText={value => setName(value)}
        />

        <InputMaskBankBranch
          placeholder='banco/agência'
          placeholderTextColor='#5636d3'
          value={bankBranch}
          onChangeText={value => setBankBranch(value)}
        />

        <Input
          placeholder='conta'
          placeholderTextColor='#5636d3'
          value={account}
          onChangeText={value => setAccount(value)}
        />

        <InputMaskSalary
          placeholder='salário'
          placeholderTextColor='#5636d3'
          value={salary}
          onChangeText={value => setSalary(value)}
        />

        <InputMaskBirthDate
          placeholder='Data Nascimento'
          placeholderTextColor='#5636d3'
          value={birthDate}
          onChangeText={value => setBirthDate(value)}
        />
        <Button
          title='Incluir'
          onPress={handleAddUser}
        />
      </ScrollView>


    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f2f5'
  }
})



