import React from "react";

import {
  Container,
  Title,
  Ammount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles";

interface Category {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: "positive" | "negative";
  title: string;
  ammount: string;
  category: Category;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
  return (
    <Container>
      <Title>{data.title}</Title>
      <Ammount type={data.type}>
        {data.type === "negative" && "- "}
        {data.ammount}
      </Ammount>
      <Footer>
        <Category>
          <Icon name={data.category.icon} />
          <CategoryName>{data.category.name}</CategoryName>
        </Category>
        <Date>{data.date}</Date>
      </Footer>
    </Container>
  );
}
