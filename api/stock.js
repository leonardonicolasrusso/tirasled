// api/stock.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ status: "error", message: "Missing url parameter" });
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Respuesta no OK desde la tienda:", response.status, response.statusText);
      res.status(500).json({ status: "error" });
      return;
    }

    const html = await response.text();
    const status = html.includes("SIN STOCK") ? "no-stock" : "in-stock";

    // Permitimos que cualquier origen consuma esta API (por si algún día lo usás desde otro lado)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ status });
  } catch (error) {
    console.error("Error consultando URL remota:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ status: "error" });
  }
}
