import zalandoClient from "@lib/zalando";
import axios from "axios"
import { shopwareConfig, zalandoConfig } from "../../../config";

export default async function handler(req, res) {
  const { params } = req.body;
  const token = await axios.get(`${shopwareConfig.host}/zalando_auth/token`, {
    auth: {
      username: shopwareConfig.user,
      password: shopwareConfig.key,
    },
  });

  const data = await axios.post(`${zalandoConfig.host}/${zalandoConfig.machine_id}/product-submissions`, params, {
    headers : { 'Authorization' : 'Bearer '+ token.data.accessToken, 'content-type': 'application/json' },
  });
  
  res.status(200).json({ data: data.status});
}