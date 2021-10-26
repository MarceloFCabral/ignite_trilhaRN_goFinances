import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import getBRL from "../../utils/getBRL";
import formatDate from "../../utils/formatDate";

import { HighlightedCard } from "../../components/HighlightedCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightedCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightedDataProps {
  total: string;
  lastTransaction: string;
}

interface HighlightedData {
  entries: HighlightedDataProps;
  expenses: HighlightedDataProps;
  balance: HighlightedDataProps;
}

export const Dashboard = () => {
  const theme = useTheme();
  const { signOut, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightedData, setHighlightedData] = useState<HighlightedData>(
    {} as HighlightedData
  );

  const { entries, expenses, balance } = highlightedData;

  function getLastTransactionDate(type: "negative" | "positive") {
    const filteredColletion = data.filter((transaction) =>
      type === "positive"
        ? transaction.type === "positive"
        : transaction.type === "negative"
    );

    if (filteredColletion.length === 0) {
      return null;
    }

    const lastTransaction = new Date(
      Math.max(
        ...filteredColletion.map((transaction: DataListProps) => {
          const separatedDate = transaction.date.split("/");
          return new Date(
            "20" +
              separatedDate[2] +
              "-" +
              separatedDate[1] +
              "-" +
              separatedDate[0]
          ).getTime();
        })
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensesSum = 0;

    const formattedTransactions: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        item.type === "positive"
          ? (entriesSum += Number(item.amount))
          : (expensesSum += Number(item.amount));

        const amount = getBRL(Number(item.amount));

        const date = formatDate(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );
    const balance = entriesSum - expensesSum;
    const lastExpense = getLastTransactionDate("negative");
    const lastEntry = getLastTransactionDate("positive");
    const lastTransaction =
      (lastExpense || lastEntry) && lastExpense > lastEntry
        ? lastExpense
        : lastEntry;

    setData(formattedTransactions);

    setHighlightedData({
      entries: {
        total: getBRL(entriesSum),
        lastTransaction: lastEntry ? lastEntry : null,
      },
      expenses: {
        total: getBRL(expensesSum),
        lastTransaction: lastExpense ? lastExpense : null,
      },
      balance: {
        total: getBRL(balance),
        lastTransaction: lastTransaction ? `01 a ${lastTransaction}` : null,
      },
    });
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightedCards>
            <HighlightedCard
              type="up"
              title="Entradas"
              amount={entries.total}
              lastTransaction={
                entries.lastTransaction
                  ? `Última entrada em ${entries.lastTransaction}`
                  : "Não há entradas!"
              }
            />
            <HighlightedCard
              type="down"
              title="Saídas"
              amount={expenses.total}
              lastTransaction={
                expenses.lastTransaction
                  ? `Última saída em ${expenses.lastTransaction}`
                  : "Não há saídas!"
              }
            />
            <HighlightedCard
              type="total"
              title="Total"
              amount={balance.total}
              lastTransaction={
                balance.lastTransaction
                  ? `${balance.lastTransaction}`
                  : "Não há transações!"
              }
            />
          </HighlightedCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};
