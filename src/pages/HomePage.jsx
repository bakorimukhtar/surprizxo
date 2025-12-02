import React from "react";
import "./HomePage.css";

export default function HomePage() {
  const wishlistItems = [
    { id: 1, price: "$18.90", img: "/items/item1.png" },
    { id: 2, price: "$19.90", img: "/items/item2.png" },
    { id: 3, price: "$18.90", img: "/items/item3.png" },
    { id: 4, price: "$19.90", img: "/items/item4.png" },
  ];

  return (
    <div className="home-wrapper">
      <h1 className="logo">Surprizxo</h1>

      <div className="section-title">My Wishlist</div>
      <div className="wishlist-scroll">
        {wishlistItems.map((item) => (
          <div className="wishlist-item" key={item.id}>
            <img src={item.img} alt="" />
            <span className="price-tag">{item.price}</span>
          </div>
        ))}
      </div>

      <div className="upcoming-box">
        <p>Upcoming Moments</p>
        <div className="upcoming-right">XO+</div>
      </div>

      <div className="gift-card">
        <img className="gift-img" src="/items/main-gift.png" alt="" />
        <div className="gift-price">$19.99</div>

        <div className="gift-actions">
          <button className="btn-add">+ Add to Wishlist</button>
          <button className="btn-send">🎁 Send as Gift</button>
        </div>
      </div>

      <div className="bottom-nav">
        <i className="nav-icon">🏠</i>
        <i className="nav-icon center-add">＋</i>
        <i className="nav-icon">🛍</i>
        <i className="nav-icon">💬</i>
        <i className="nav-icon">👤</i>
      </div>
    </div>
  );
}
