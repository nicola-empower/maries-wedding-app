// src/components/MenuPage.jsx

import './MenuPage.css'; // We'll create this CSS file next

function MenuPage() {
  return (
    <div className="menu-container">
      <h1>The Wedding Menu 🍽️</h1>
      
      <div className="menu-card">
        
        <div className="menu-section">
          <h2 className="course-title">Soup</h2>
          <div className="menu-item">
            <p className="item-title">Country Vegetable v gf vg</p>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="course-title">Starters</h2>
          <div className="menu-item">
            <p className="item-title">Prawn Platter</p>
            <p className="item-description">(gf option available) north atlantic prawns, shredded tossed salad with a toasted ciabatta wedge</p>
          </div>
          <div className="menu-item">
            <p className="item-title">Three King's homemade pate</p>
            <p className="item-description">(gf option available) served with chargrilled brioche and an apple celeriac slaw</p>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="course-title">Mains</h2>
          <div className="menu-item">
            <p className="item-title">Fillet of sea bass gf</p>
            <p className="item-description">served with a flavoursome salsa verde</p>
          </div>
          <div className="menu-item">
            <p className="item-title">Supreme of chicken</p>
            <p className="item-description">french trimmed chicken breast stuffed with chorizo finished with a vibrant arabic sauce</p>
          </div>
          <div className="menu-item">
             <p className="item-title">Roasted butternut wellington v, vg</p>
             <p className="item-description">Vegetarian & vegan option</p>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="course-title">Desserts</h2>
          <div className="menu-item">
            <p className="item-title">Chefs selection of biscuits and cheese</p>
            <p className="item-description">selection of cheeses, served with grapes, homemade red onion chutney & cheese biscuits</p>
          </div>
           <div className="menu-item">
            <p className="item-title">Mixed berry & cream tart</p>
            <p className="item-description">served with a strawberry jam, berry compote & chantilly cream</p>
          </div>
           <div className="menu-item">
            <p className="item-title">Chocolate & orange tart</p>
            <p className="item-description">served with burnt orange crisp, chocolate soil & orange zested chantilly cream</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MenuPage;
