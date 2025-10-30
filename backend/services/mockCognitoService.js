const users = [];

module.exports = {
  async signUp({ email, password, fullName, phoneNumber }) {
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    users.push({ email, password, fullName, phoneNumber, confirmed: false });
    console.log(`📱 Mock: OTP sent to ${phoneNumber}`);

    return {
      UserConfirmed: false,
      CodeDeliveryDetails: {
        Destination: phoneNumber,
        DeliveryMedium: "SMS",
      },
    };
  },

  async confirmSignUp({ email, code }) {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");
    user.confirmed = true;
    console.log(`✅ Mock: Confirmed ${email} with code ${code}`);
    return { message: "User confirmed successfully" };
  },

  async login({ email, password }) {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");
    if (!user.confirmed) throw new Error("User not confirmed");
    if (user.password !== password) throw new Error("Invalid password");

    return {
      AccessToken: "mock-access-token",
      IdToken: "mock-id-token",
      RefreshToken: "mock-refresh-token",
      ExpiresIn: 3600,
    };
  },
};
