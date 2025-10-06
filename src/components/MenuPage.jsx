// src/components/MenuPage.jsx

import './MenuPage.css';

function MenuPage() {
  return (
    <div className="menu-container">
      <h1>The Wedding Menu</h1>
      
      <div className="menu-card">
        
        <div className="menu-section">
          <h2 className="course-title">Soup</h2>
          <div className="menu-item">
            <p className="item-title">Red Lentil & Bacon</p>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="course-title">Starters</h2>
          <div className="menu-item">
            <p className="item-title">Rolled Oat Haggis Bon Bons</p>
            <p className="item-description">(gf option available) served with crisp rocket & coarse grain mustard mayonnaise</p>
          </div>
          <div className="menu-item">
            <p className="item-title">Tomato & Roasted Red Pepper Bruschetta</p>
            <p className="item-description">(gf option available) toasted ciabatta with diced tomatoes and juicy roasted red peppers finished with rocket and a homemade vibrant pesto</p>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="course-title">Mains</h2>
          <div className="menu-item">
            <p className="item-title">Chicken Highlander</p>
            <p className="item-description">stuffed with haggis and masked with a sping onion & drambuie cream sauce</p>
          </div>
          <div className="menu-item">
            <p className="item-title">Homemade Steak Pie</p>
            <p className="item-description">french trimmed chicken breast stuffed with chorizo finished with a vibrant arabic sauce</p>
          </div>
          <div className="menu-item">
             <p className="item-title">Herb Crusted Cod Fillet</p>
             <p className="item-description">cod fillet topped with a sundried tomato and parsley crumb drizzled with homemade pesto</p>
          </div>
          {/* This item was outside its section before */}
          <div className="menu-item">
             <p className="item-title">Mushroom and Leek Pie</p>
             <p className="item-description">v, vg & gf</p>
          </div>
        </div> {/* <-- THIS </div> WAS MOVED HERE to close 'Mains' */}

        <div className="menu-section">
          <h2 className="course-title">Desserts</h2>
          <div className="menu-item">
            <p className="item-title">Scottish Tablet Cheesecake</p>
            <p className="item-description">homemade white chocolate cheesecake topped with scottish tablet</p>
          </div>
           <div className="menu-item">
            <p className="item-title">Homemade Sticky Toffee Pudding</p>
            <p className="item-description">with a scoop of vanilla ice cream and butterscotch sauce</p>
          </div>
           <div className="menu-item">
            <p className="item-title">Cranachan</p>
            <p className="item-description">traditional scottish cranachan served with fresh raspberries topped with toasted oatmeal and shortbread discs </p>
          </div>
        </div>

      </div> {/* <-- THIS </div> WAS MOVED HERE to close 'menu-card' */}
    </div>
  );
}

export default MenuPage;