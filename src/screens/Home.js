import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Carousel from '../components/carousel';
import MyCart from './MyCart';

export default function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [search, setSearch] = useState(''); // <- search state moved here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      let response = await fetch('http://localhost:5000/api/foodData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`Fetch failed ${response.status}`);
      const data = await response.json();

      const items = Array.isArray(data)
        ? data[0]
        : (Array.isArray(data?.food_items) ? data.food_items : []);
      const catData = Array.isArray(data)
        ? data[1]
        : (Array.isArray(data?.foodCategory) ? data.foodCategory : []);

      console.log(items, catData);
      setFoodItems(items);
      setFoodCategories(catData);
    } catch (e) {
      console.error('foodData fetch failed:', e);
      setError(e.message || 'Failed to load');
      setFoodItems([]);
      setFoodCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoriesToShow = Array.isArray(foodCategories) ? foodCategories : [];

  // helper: flatten item to searchable string (handles nested arrays/objects)
  const stringifyForSearch = (val) => {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return String(val);
    }
    if (Array.isArray(val)) {
      return val.map(stringifyForSearch).join(' ');
    }
    if (typeof val === 'object') {
      return Object.values(val).map(stringifyForSearch).join(' ');
    }
    return '';
  };

  const searchLower = (search || '').trim().toLowerCase();

  // simpler robust search: stringify whole item (covers nested fields) and debug logs
  const filteredItems = !searchLower
    ? foodItems
    : (Array.isArray(foodItems) ? foodItems.filter(it => {
        try {
          const text = JSON.stringify(it).toLowerCase();
          const match = text.includes(searchLower);
          // debug: show which items match or not (open DevTools console)
          console.log('search:', searchLower, 'item:', it.name || it.titleName || it._id, 'match:', match);
          return match;
        } catch (e) {
          console.warn('search stringify failed for item', it, e);
          return false;
        }
      }) : []);

  const wrapperStyle = {
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0.36)), url('https://images.unsplash.com/photo-1543353071-087092ec3938?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    color: '#fff',
  };

  const contentStyle = {
    paddingTop: '72px', // space for navbar
    paddingBottom: '40px',
  };

  return (
    <div style={wrapperStyle}>
        <Navbar />
        {/* pass search state and setter to Carousel so user can type search */}
        <div className='m-1'><Carousel /></div>

        <div className='m-3 container' style={{ color: '#c5d3e1ff' }}>
          <div className="mb-3 d-flex gap-2">
            <input
              className="form-control"
              placeholder="Explore foods..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                console.log("search query:", e.target.value);
              }}
            />
            <button className="btn btn-secondary" onClick={() => { setSearch(""); }}>
              Clear
            </button>
          </div>

          {loading && <div>Loading...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {categoriesToShow.length > 0 ? categoriesToShow.map((cat, idx) => {
            const catKey = cat._id || cat.CategoryName || idx;
            // use filteredItems so only searched items appear
            const itemsForCat = Array.isArray(filteredItems) ? filteredItems.filter(it => it.CategoryName === cat.CategoryName || it.category === cat.CategoryName) : [];

            return (
              <section className='mb-5' key={catKey}>
                <div className='d-flex align-items-center justify-content-between mb-3'>
                  <h3 className='m-0 category-title'>
                    {cat.CategoryName}{" "}
                    <small className='text-muted category-sub'>({itemsForCat.length})</small>
                  </h3>
                </div>
                <div className='row'>
                  {itemsForCat.length > 0 ? itemsForCat.map((item, iidx) => (
                    <div className='col-12 col-sm-6 col-md-4 mb-3' key={item._id || `${item.name}-${iidx}`}>
                      <Cards item={item} />
                    </div>
                  )) : (
                    <div className='col-12'><small className='text-muted'>No items in this category</small></div>
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

