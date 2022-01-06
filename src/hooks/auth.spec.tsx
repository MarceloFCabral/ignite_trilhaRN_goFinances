import fetchMock from "jest-fetch-mock";
import { mocked } from "jest-mock";
import { renderHook, act } from "@testing-library/react-hooks";
import { startAsync } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider, useAuth } from "./auth";

fetchMock.enableMocks();

jest.mock("expo-auth-session");

describe("Auth Hook", () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem("@gofinances:user");
  });

  it("should be able to sign in with an existing Google account", async () => {
    const mockedGoogleAuth = mocked(startAsync as any);

    mockedGoogleAuth.mockReturnValueOnce({
      type: "success",
      params: {
        access_token: "any_token",
      },
    });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: "any_id",
        email: "marcelofc12@gmail.com",
        given_name: "Marcelo",
        picture: "any_photo.png",
      })
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => await result.current.signInWithGoogle());

    expect(result.current.user.email).toBe("marcelofc12@gmail.com");
  });

  it("should not be able to sign in if the Google authentication process has been cancelled", async () => {
    const mockedGoogleAuth = mocked(startAsync as any);

    mockedGoogleAuth.mockReturnValueOnce({
      type: "cancel",
      params: {
        access_token: null,
      },
    });

    fetchMock.mockResponseOnce(JSON.stringify({}));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => await result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty("id");
  });
});
