import { Auth } from "aws-amplify";

// Sign in with email and password (no Hosted UI)
export const login = async (email, password) => {
  return Auth.signIn(email, password);
};

// Logs out of Cognito session
export const logout = async () => {
  return Auth.signOut();
};
