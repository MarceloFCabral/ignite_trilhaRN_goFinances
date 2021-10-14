import React from "react";

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
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export const Dashboard = () => {
  const data: DataListProps[] = [
    {
      id: "1",
      type: "positive",
      title: "Desenvolvimento de site",
      ammount: "R$ 12.000,00",
      category: { name: "Vendas", icon: "dollar-sign" },
      date: "13/04/2020",
    },
    {
      id: "2",
      type: "negative",
      title: "Hamburgueria Pizzy",
      ammount: "R$ 59,00",
      category: { name: "Alimentação", icon: "coffee" },
      date: "10/04/2020",
    },
    {
      id: "3",
      type: "negative",
      title: "Aluguel do apartamento",
      ammount: "R$ 1.200,00",
      category: { name: "Casa", icon: "shopping-bag" },
      date: "10/04/2020",
    },
  ];
  return (
    <Container>
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
              <UserName>Marcelo</UserName>
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
          ammount="R$ 17.400,00"
          lastTransaction="Última entrada feita dia 13 de abril"
        />
        <HighlightedCard
          type="down"
          title="Saídas"
          ammount="R$ 1.259,00"
          lastTransaction="Última saída feita dia 03 de abril"
        />
        <HighlightedCard
          type="total"
          title="Total"
          ammount="R$ 16.141,00"
          lastTransaction="01 a 16 de abril"
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
    </Container>
  );
};
