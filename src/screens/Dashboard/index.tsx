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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightedData, setHighlightedData] = useState<HighlightedData>(
    {} as HighlightedData
  );

  function getLastTransactionDate(type: "negative" | "positive") {
    const lastTransaction = new Date(
      Math.max(
        ...data
          .filter((transaction: DataListProps) =>
            type === "positive"
              ? transaction.type === "positive"
              : transaction.type === "negative"
          )
          .map((transaction: DataListProps) => {
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
    console.log(lastTransaction);
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      {
        month: "long",
      }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
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
    setData(formattedTransactions);

    setHighlightedData({
      entries: {
        total: getBRL(entriesSum),
        lastTransaction: getLastTransactionDate("positive"),
      },
      expenses: {
        total: getBRL(expensesSum),
        lastTransaction: lastExpense,
      },
      balance: {
        total: getBRL(balance),
        lastTransaction: `01 a ${lastExpense}`,
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
                    uri: "https://avatars.githubusercontent.com/u/51683012?v=4",
                  }}
                />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>Marcelo França</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightedCards>
            <HighlightedCard
              type="up"
              title="Entradas"
              amount={highlightedData.entries.total}
              lastTransaction={
                "Última entrada no dia " +
                highlightedData.entries.lastTransaction
              }
            />
            <HighlightedCard
              type="down"
              title="Saídas"
              amount={highlightedData.expenses.total}
              lastTransaction={
                "Última saída no dia " +
                highlightedData.expenses.lastTransaction
              }
            />
            <HighlightedCard
              type="total"
              title="Total"
              amount={highlightedData.balance.total}
              lastTransaction={highlightedData.balance.lastTransaction}
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
