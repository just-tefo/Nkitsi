import { Auth } from "aws-amplify";

// Opens Cognito Hosted UI in browser
export const login = async () => {
  await Auth.federatedSignIn();
};

// Logs out of Cognito session
export const logout = async () => {
  await Auth.signOut();
};
