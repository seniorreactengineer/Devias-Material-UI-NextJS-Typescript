import axios from "axios";

import { shopwareConfig, zalandoConfig } from "../config";

const zalandoClient = async (query, param = {}) => {
  const token = await axios.get(`${shopwareConfig.host}/zalando_auth/token`, {
    auth: {
      username: shopwareConfig.user,
      password: shopwareConfig.key,
    },
  });

  const data = await axios.get(`${zalandoConfig.host}/${zalandoConfig.machine_id}/${query}`, {
    headers : { 'Authorization' : 'Bearer '+ token.data.accessToken },
    data: param,
  });

  return data.data;
};

export default zalandoClient;
