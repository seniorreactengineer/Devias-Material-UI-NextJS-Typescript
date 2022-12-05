import shopwareClient from "@lib/shopware";

export default async function handler(req, res) {
  const data = await shopwareClient("ShopmasterDocumentType");
  res.status(200).json({ data: data.data.data });
}
