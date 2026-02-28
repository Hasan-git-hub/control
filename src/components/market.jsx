import { useEffect, useState } from "react";

const MARKET_API = "https://dummyjson.com/products?limit=10";

function MarketTable() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const loadProducts = async () => {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch(MARKET_API, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Market API xatoligi.");
        }

        const nextProducts = Array.isArray(data.products) ? data.products : [];
        if (!ignore) {
          setProducts(nextProducts);
          setStatus("success");
        }
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        if (!ignore) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Market API ulanishda xatolik.";
          setError(message);
          setStatus("error");
        }
      }
    };

    loadProducts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  if (status === "loading") {
    return <p>Market malumotlari yuklanmoqda...</p>;
  } else if (status === "error") {
    return <p className="message message-error">{error}</p>;
  } else if (status === "success" && products.length === 0) {
    return <p>Market royxati bo`sh.</p>;
  }

  return (
    <section className="table-wrap">
      <h3 className="table-title">Market API</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default MarketTable;
