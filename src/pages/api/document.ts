import shopwareClient from "@lib/shopware";

export default async function handler(req, res) {
  const { type, orderId } = req.body;

  const data = await shopwareClient(
    `ShopmasterDocument?type=${type}&orderId=${orderId}`
  );

  res.status(200).json({ data: data.data });
}
