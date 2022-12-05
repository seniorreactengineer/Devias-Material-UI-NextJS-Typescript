import shopwareClient from "@lib/shopware";

export default async function handler(req, res) {
  const data = await shopwareClient("orders", {
    limit: 20,
    sort: [{ property: "orderTime", direction: "DESC" }],
  });

  res.status(200).json({ data: data.data.data });
}
