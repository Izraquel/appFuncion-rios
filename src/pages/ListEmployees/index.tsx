import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { differenceInYears } from 'date-fns'
import { Header } from "../../components/Header";
import { ListCard } from '../../components/ListCard';

interface ListEmployeesProps {
  id: string,
  cpf: string,
  name: string,
  bankBranch: string,
  account: string,
  salary: number,
  birthDate: Date
}

interface ListEmployeesCNABProps {
  id: string;
  bank?: string;
  agency?: string;
  payingBankAccount?: string;
  bankName?: string;
  bankBranch: string;
  account: string;
  salary: number;
  name: string;
  birthDate: Date;
  idade: number;
  fgts: number;
  valeTransport: number;
  irf: number;
  liquid: number;
}

const payingBank = [
  { bankCode: '001', agency: '4530', account: '102030-1', bankName: 'BB' },
  { bankCode: '237', agency: '1230', account: '403020-2', bankName: 'Bradesco' },
  { bankCode: '241', agency: '0140', account: '123040-1', bankName: 'Itaú' },
  { bankCode: '033', agency: '1450', account: '011220-1', bankName: 'Santander' },
]

export function ListEmployees() {
  const [status, setStatus] = useState('')
  const [employeesCnab, setEmployeesCnab] = useState<ListEmployeesCNABProps[]>([])
  let emploeeysAll: ListEmployeesCNABProps[] = []
  let emploeeys: ListEmployeesProps[] = []

  function handleDeleteEmployee(id: string) {
    Alert.alert("Exclusão", 'Tem certeza?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          setStatus('E')
          setEmployeesCnab(employees =>
            employees.filter(employee => employee.id !== id))
        },
      }
    ])
  }

  async function loadDataEmployee() {
    const data = await AsyncStorage.getItem('@si:employees')
    if (data) {
      emploeeys = JSON.parse(data)
      emploeeysAll = emploeeys.map(employee => {
        const [codBank,] = employee.bankBranch.split('/')
        const dataPayingBank = payingBank.find(pk => pk.bankCode === codBank)
        const data = {
          id: employee.id,
          bank: dataPayingBank?.bankCode,
          agency: dataPayingBank?.agency,
          payingBankAccount: dataPayingBank?.account,
          bankName: dataPayingBank?.bankName,
          bankBranch: employee.bankBranch,
          account: employee.account,
          salary: employee.salary,
          name: employee.name,
          birthDate: employee.birthDate,
          idade: differenceInYears(
            new Date(),
            new Date(employee.birthDate)
          ),
          fgts: calculateFgts(employee.salary),
          valeTransport: calculateValeTransport(employee.salary),
          irf: calculateIrf(employee.salary),
          liquid: calculateLiquid(employee.salary),
         // inss: calculateInss(employee.salary)
        }
        return data
      })
      setEmployeesCnab(emploeeysAll)
    }
  }

  function totalContas(banco: string) {
    return employeesCnab.reduce((total, v) => v.bankBranch.includes(banco) ? total += 1 : total += 0, 0)
  }

  function calculateFgts(salary: number) {
    return parseFloat((salary * 8 / 100).toFixed(2))  
    // return salary * 0.08
  }

  function calculateValeTransport(salary: number) {
    //return salary * 6 / 100;
    return parseFloat((salary * 0.06).toFixed(2))
  }

  function calculateLiquid(salary: number) {
    return parseFloat((salary - calculateValeTransport(salary) - calculateIrf(salary)).toFixed(2))
  }

  function calculateIrf(salary: number) {
    let irf = 0
    if (salary >= 1903.99 && salary <= 2826.65) {
      irf = (salary * 7.5 / 100) - 142.80
    } else if (salary >= 2826.66 && salary <= 3751.05) {
      irf = (salary * 15 / 100) - 354.80
    } else if (salary >= 3751.06 && salary <= 4664.68) {
      irf = (salary * 22.5 / 100) - 636.13
    } else if (salary >= 4664.69) {
      irf = (salary * 27.5 / 100) - 869.36
    }
    return parseFloat(irf.toFixed(2))
  }

  function totalSalary() {
    return parseFloat((employeesCnab.reduce((total, emp) => total += emp.salary,0)).toFixed(2))
  }

  function totalFGTS() {
    return parseFloat((employeesCnab.reduce((total, emp) => total += emp.fgts,0)).toFixed(2))
  }

  function totalValeTransport(){
    return parseFloat((employeesCnab.reduce((total, emp) => total += emp.valeTransport,0)).toFixed(2))
  }

  function totalIRF() {
    return parseFloat((employeesCnab.reduce((total, emp) => total += emp.irf,0)).toFixed(2))
  }

  function totalLiquid() {
    return parseFloat((employeesCnab.reduce((total, emp) => total += emp.liquid,0)).toFixed(2))
  }

  useEffect(() => {
    loadDataEmployee()
  }, [])

  useFocusEffect(useCallback(() => {
    loadDataEmployee()
  }, []))

  useEffect(() => {
    async function saveemployees() {
      await AsyncStorage.setItem('@si:employees', JSON.stringify(employeesCnab))
    }
    saveemployees()
  }, [employeesCnab])

  return (
    <View style={styles.container}>
      <Header title='Listam de Funcionários' />
      {/* <View style={styles.content}>
        <Text style={styles.textCard}>Total de contas do Itau: {totalContas('241')}</Text>
        <Text style={styles.textCard}>Total de contas do Santander: {totalContas('033')}</Text>
        <Text style={styles.textCard}>Total de contas do BB: {totalContas('001')}</Text>
        <Text style={styles.textCard}>Total de contas do Bradesco: {totalContas('237')}</Text>
      </View> */}

      <View style={styles.content}>
        <Text style={styles.textCard}>Total do Salario Bruto: {totalSalary()}</Text>
        <Text style={styles.textCard}>Total do FGTS: {totalFGTS()}</Text>
        <Text style={styles.textCard}>Total do Vale Transporte: {totalValeTransport()}</Text>
        <Text style={styles.textCard}>Total do IRF: {totalIRF()}</Text>
        <Text style={styles.textCard}>Total do Salario Liquido: {totalLiquid()}</Text>
      </View>

      <FlatList
        data={employeesCnab}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListCard
            item={item}
            onPress={() => handleDeleteEmployee(item.id)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f2f5'
  },
  content: {
    marginTop: 5,
    marginLeft: 5,
    padding: 6,
  },
  textCard: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 4
  },
})

