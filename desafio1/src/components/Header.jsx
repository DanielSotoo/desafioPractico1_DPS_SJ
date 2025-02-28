"use client";
import React, { useState } from "react";

export const Headers = ({
  allProducts,
  setAllProducts,
  total,
  setTotal,
  countProducts,
  setCountProducts,
}) => {
  const [active, setActive] = useState(false);

  const onDeleteProduct = (product) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar ${product.title} del carrito?`)) {
      const results = allProducts.filter(item => item.id !== product.id);
      setTotal(total - product.price * product.quantity);
      setCountProducts(countProducts - product.quantity);
      setAllProducts(results);
    }
  };

  const onCleanCart = () => {
    if (window.confirm("¿Estás seguro que deseas vaciar el carrito de compras?")) {
      setAllProducts([]);
      setTotal(0);
      setCountProducts(0);
    }
  };

  const generateInvoice = () => {
    if (allProducts.length === 0) {
      alert("No hay productos en el carrito para generar una factura");
      return;
    }

    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: "Cliente",
      items: allProducts,
      total: total,
    };

    localStorage.setItem('lastInvoice', JSON.stringify(invoiceData));
    
    const invoiceWindow = window.open('', '_blank');
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factura #${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f4f4f4; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .invoice-items th, .invoice-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .invoice-items th { background-color: #333; color: #fff; }
          .total { text-align: right; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>Factura</h1>
          <p>Factura #: ${invoiceData.invoiceNumber}</p>
          <p>Fecha: ${invoiceData.date}</p>
        </div>
        
        <table class="invoice-items">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">Total: $${invoiceData.total.toFixed(2)}</div>
        
        <div style="margin-top: 50px; text-align: center;">
          <p>¡Gracias por su compra!</p>
        </div>
      </body>
      </html>
    `;
    
    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    
    setAllProducts([]);
    setTotal(0);
    setCountProducts(0);
  };

  return (
    <header>
      <h1>UDB Tecno Center - SJ241841</h1>

      <div className="container-icon">
        <div
          className="container-cart-icon"
          onClick={() => setActive(!active)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="icon-cart"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <div className="count-products">
            <span id="contador-productos">{countProducts}</span>
          </div>
        </div>

        <div className={`container-cart-products ${active ? "" : "hidden-cart"}`}>
          {allProducts.length ? (
            <>
              <div className="row-product">
                {allProducts.map(product => (
                  <div className="cart-product" key={product.id}>
                    <div className="info-cart-product">
                      <img src={product.urlImage} alt={product.title} className="tumbal" />
                      <div>
                        <span className="titulo-producto-carrito">{product.title}</span>
                        <span className="precio-producto-carrito">${product.price}</span> <br />
                        <span className="cantidad-producto-carrito">Cantidad: {product.quantity}</span>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="icon-close"
                      onClick={() => onDeleteProduct(product)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <h3>Total:</h3>
                <span className="total-pagar">${total.toFixed(2)}</span>
              </div>

              <div className="cart-buttons">
                <button className="btn-clear-all" onClick={onCleanCart}>
                  Vaciar Carrito
                </button>
                <button className="btn-clear-all" onClick={generateInvoice} style={{ marginTop: '10px', backgroundColor: '#000', color: '#fff' }}>
                  Realizar Compra
                </button>
              </div>
            </>
          ) : (
            <p className="cart-empty">El carrito está vacío</p>
          )}
        </div>
      </div>
    </header>
  );
};
