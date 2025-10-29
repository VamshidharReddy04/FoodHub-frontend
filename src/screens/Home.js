import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Carousel from '../components/carousel';
import { getFoodItems } from '../api';

export default function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // load data from backend and fetch food items and categories
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFoodItems();
      const items = Array.isArray(data) ? data[0] : (Array.isArray(data?.food_items) ? data.food_items : []);
      const catData = Array.isArray(data) ? data[1] : (Array.isArray(data?.foodCategory) ? data.foodCategory : []);
      setFoodItems(items || []);
      setFoodCategories(catData || []);
    } catch (e) {
      setError(e.message || 'Failed to load');
      setFoodItems([]);
      setFoodCategories([]);
    } finally {
      setLoading(false);
    }
  };
  // useEffect for loading data on mount
  useEffect(() => {
    loadData();
  }, []);
  // simple stringify for search across nested item fields
  const stringifyForSearch = (val) => {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return val.map(stringifyForSearch).join(' ');
    if (typeof val === 'object') return Object.values(val).map(stringifyForSearch).join(' ');
    return '';
  };
  // filter items based on search query
  const q = (search || '').trim().toLowerCase();
  const filteredItems = !q
    ? foodItems
    : (Array.isArray(foodItems) ? foodItems.filter(it => {
        try {
          return stringifyForSearch(it).toLowerCase().includes(q);
        } catch {
          return false;
        }}) : []);
  const categoriesToShow = Array.isArray(foodCategories) ? foodCategories : [];
  const wrapperStyle = { backgroundImage: "linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0.36)), url('https://images.unsplash.com/photo-1543353071-087092ec3938?auto=format&fit=crop&w=1600&q=80')",
 backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', color: '#fff',};
  return (
    <div style={wrapperStyle}>
      <Navbar />
      <div className="m-1"><Carousel /></div>
      <div className="m-3 container" style={{ color: '#c5d3e1ff' }}>
        <div className="mb-3 d-flex gap-2">
          <input className="form-control" placeholder="Explore foods..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-secondary" onClick={() => setSearch('')}>Clear</button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {categoriesToShow.length > 0 ? categoriesToShow.map((cat, idx) => {
          const catName = (cat.CategoryName || cat.category || '').trim();
          const itemsForCat = Array.isArray(filteredItems)
            ? filteredItems.filter(it => {
                const itCat = (it.CategoryName || it.category || '').trim();
                return itCat === catName || itCat.includes(catName) || catName.includes(itCat);
              })
            : [];
          return (
            <section className="mb-5" key={cat._id || catName || idx}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="m-0 category-title">
                  {cat.CategoryName} <small className="text-muted category-sub">({itemsForCat.length})</small>
                </h3>
              </div>
              <div className="row">
                {itemsForCat.length > 0 ? itemsForCat.map((item, iidx) => (
                  <div className="col-12 col-sm-6 col-md-3 mb-3" key={item._id || `${item.name}-${iidx}`}>
                    <Cards item={item} />
                  </div>
                )) : (
                  <div className="col-12"><small className="text-muted">No items in this category</small></div>
                )}
              </div>
            </section>
          );
        }) : <div style={{ color: '#fff' }}>No Categories Found</div>}
      </div>
      <Footer />
    </div>
  );
}
