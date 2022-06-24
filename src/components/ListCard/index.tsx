import {
  View,
  TouchableOpacity,
  Text, StyleSheet,
  TouchableOpacityProps
} from 'react-native'

import { format } from 'date-fns'

interface ListEmployeesCnabProps {
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

interface ListCardProps extends TouchableOpacityProps {
  item: ListEmployeesCnabProps;
}

export function ListCard({ item, ...rest }: ListCardProps) {

  function convertDate(birthDate: Date) {
    return format(new Date(birthDate), 'dd/MM/yyyy')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonCard}
        key={item.id}
        {...rest}>
        <Text style={styles.titleCard}>Dados do Pagador</Text>
        <Text style={styles.textCard}>Bco/Agencia: {item.bank}</Text>
        <Text style={styles.textCard}>Agencia: {item.agency}</Text>
        <Text style={styles.textCard}>Cod. Bco Pagador: {item.payingBankAccount}</Text>
        <Text style={styles.textCard}>Nome do Banco: {item.bankName}</Text>

        <View style={styles.separator} />

        <Text style={styles.titleCard}>Dados do Recebimento</Text>
        <Text style={styles.textCard}>Bco/Agencia: {item.bankBranch}</Text>
        <Text style={styles.textCard}>Conta: {item.account}</Text>
        <Text style={styles.textCard}>Salario: {item.salary}</Text>
        <Text style={styles.textCard}>Nome: {item.name}</Text>
        <Text style={styles.textCard}>Data Nascimento: {convertDate(item.birthDate)}</Text>
        <Text style={styles.textCard}>Idade: {item.idade}</Text>
        <Text style={styles.textCard}>Fgts: {item.fgts}</Text>
        <Text style={styles.textCard}>Vale Transporte: {item.valeTransport}</Text>
        <Text style={styles.textCard}>Irf: {item.irf}</Text>
        <Text style={styles.textCard}>Liquido: {item.liquid}</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  buttonCard: {
    width: '100%',
    padding: 6,
    backgroundColor: '#b0bbe4',
    borderRadius: 10
  },
  textCard: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  titleCard: {
    color: '#5636d3',
    fontSize: 26,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  }
})




