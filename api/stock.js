// api/stock.js

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(400).json({
      status: "error",
      message: "Missing url parameter",
    });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Respuesta no OK desde la tienda:",
        response.status,
        response.statusText
      );
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(500).json({
        status: "error",
        message: "Remote not OK",
      });
    }

    const html = await response.text();

    // 👇 LÓGICA SIMPLE:
    // Si aparece el texto "Agregar al carrito" => EN STOCK
    // Si NO aparece => SIN STOCK
    const hasAddToCart = html.includes("Agregar al carrito");

    const status = hasAddToCart ? "in-stock" : "no-stock";

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ status });
  } catch (error) {
    console.error("Error consultando URL remota:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({
      status: "error",
      message: "Exception in stock function",
    });
  }
}
