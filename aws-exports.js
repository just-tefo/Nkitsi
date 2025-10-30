const awsmobile = {
  aws_project_region: "eu-north-1",
  aws_cognito_region: "eu-north-1",
  aws_user_pools_id: "eu-north-1_X9EUHHsVr", // 👈 replace with your User Pool ID
  aws_user_pools_web_client_id: "5mjvk16h0u6p0go6716496q1d3", // 👈 replace with your App Client ID
  oauth: {
    domain: "eu-north-1x9euhhsvr.auth.eu-north-1.amazoncognito.com", // 👈 replace with your Cognito domain
    scope: ["email", "openid", "phone"],
    redirectSignIn: "nkitsi://callback",
    redirectSignOut: "nkitsi://signout",
    responseType: "code", // 'code' for authorization flow, 'token' for implicit
  },
};

export default awsmobile;
