import zalandoClient from "@lib/zalando";

export default async function handler(req, res) {
  const data = await zalandoClient("outlines");
  res.status(200).json({ data: data.items});
}