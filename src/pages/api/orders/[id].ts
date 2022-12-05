import shopwareClient from "@lib/shopware";

export default async function handler(req, res) {
  const { id } = req.query;
  const data = await shopwareClient(`orders/${id}`);

  res.status(200).json({ data: data.data.data });
}
