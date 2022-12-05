import axios from "axios";

import { shopwareConfig } from "../config";

const shopwareClient = async (query, param = {}) => {
  const data = await axios.get(`${shopwareConfig.host}/${query}`, {
    auth: {
      username: shopwareConfig.user,
      password: shopwareConfig.key,
    },
    data: param,
  });
  return data;
};

export default shopwareClient;
