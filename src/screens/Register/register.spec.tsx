import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeProvider } from "styled-components/native";
import theme from "../../global/styles/theme";

import { Register } from ".";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe("Register Screen", () => {
  it("should open the category modal when the category button is clicked", () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Providers,
    });

    const categoryModal = getByTestId("category-modal");
    const categoryButton = getByTestId("category-button");
    fireEvent.press(categoryButton);

    expect(categoryModal.props.visible).toBeTruthy();
  });
});
