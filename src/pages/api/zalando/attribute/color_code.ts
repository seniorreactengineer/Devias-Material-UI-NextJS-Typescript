import zalandoClient from "@lib/zalando";

export default async function handler(req, res) {
  const data = await zalandoClient("attribute-types/color_code.primary/attributes");
  res.status(200).json({ data: data.items});
}

//.value.localized.en - .label