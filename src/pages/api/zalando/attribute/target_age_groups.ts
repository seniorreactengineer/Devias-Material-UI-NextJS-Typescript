import zalandoClient from "@lib/zalando";

export default async function handler(req, res) {
  const data = await zalandoClient("attribute-types/target_age_groups/attributes");
  res.status(200).json({ data: data.items});
}