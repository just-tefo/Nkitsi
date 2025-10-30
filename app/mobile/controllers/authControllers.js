import { Auth } from "aws-amplify";

// Sign Up
export const signupUser = async (userData) => {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });
    console.log("Signup success:", user);
    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Confirm Sign Up
export const confirmSignup = async (email, code) => {
  try {
    await Auth.confirmSignUp(email, code);
    console.log("Account verified");
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);
    console.log("Login success:", user);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};