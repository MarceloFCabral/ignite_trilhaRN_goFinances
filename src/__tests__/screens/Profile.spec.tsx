import React from "react";
import { render } from "@testing-library/react-native";

import { Profile } from "../../screens/Profile";

describe("Profile", () => {
  it("Should contain the correct username input placeholder", () => {
    const { getByPlaceholderText } = render(<Profile />);
    const inputName = getByPlaceholderText("Nome");
    expect(inputName).toBeTruthy();
    // debug();
  });

  it("Should load user data", () => {
    const { getByTestId } = render(<Profile />);
    const inputName = getByTestId("input-name");
    const inputSurname = getByTestId("input-surname");

    expect(inputName.props.value).toEqual("Rodrigo");
    expect(inputSurname.props.value).toEqual("Gonçalves");
  });

  it("Should render the title correctly", () => {
    const { getByTestId } = render(<Profile />);
    const titleText = getByTestId("text-title");

    expect(titleText.props.children).toContain("Perfil");
  });
});
