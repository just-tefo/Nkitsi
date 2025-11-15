import { Auth } from "@aws-amplify/auth";

// debug: log Auth availability at runtime
console.log('Auth (authControllers.js) imported from @aws-amplify/auth:', Auth);

// Sign Up
export const signupUser = async (userData) => {
  const { email, password, fullName } = userData || {};
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: { email, name: fullName },
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
    // get session tokens (access/refresh/id)
    const session = await Auth.currentSession();
    console.log("Login success:", user);
    return { user, session };
  } catch (error) {
    console.error("Login error:", error);
    // Normalize error
    const message = error?.message || error || 'Login failed';
    throw new Error(message);
  }
};