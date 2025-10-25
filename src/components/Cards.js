import React, { useState, useMemo, useEffect } from 'react';
import { useDispatchCart } from './ContextReducer';

export default function Cards({ item }) {
  const dispatch = useDispatchCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(null);
  // safeItem avoids conditional hook calls when `item` is undefined
  const safeItem = item || {};
  //  build normalized price map (handles various DB shapes)
  const buildPriceMap = (it) => {
    const map = {};
    // options as array of objects or key/value objects
    if (Array.isArray(it.options) && it.options.length > 0) {
      const first = it.options[0];
      if (first && typeof first === 'object' && !('name' in first && 'price' in first)) {
        it.options.forEach(optObj => {
          if (optObj && typeof optObj === 'object') {
            Object.entries(optObj).forEach(([k, v]) => {
              if (v != null && v !== '') map[String(k).toLowerCase()] = Number(v);
            });}});
      } else {
        it.options.forEach(opt => {
          if (!opt) return;
          const name = opt.name || opt.title || opt.label || opt.size;
          const price = opt.price ?? opt.value ?? opt.cost ?? opt.amount;
          if (name && price != null) map[String(name).toLowerCase()] = Number(price);
        });}}
    // options as object -> { half: 100, full: 180 }
    if (it.options && !Array.isArray(it.options) && typeof it.options === 'object') {
      Object.entries(it.options).forEach(([k, v]) => {
        if (v != null) map[String(k).toLowerCase()] = Number(v);
      });}
    //  alternate fields: price, unitPrice, prices, priceList, variantPrices
    if (Object.keys(map).length === 0) {
      if (it.price != null) map['regular'] = Number(it.price);
      else if (it.unitPrice != null) map['regular'] = Number(it.unitPrice);
      else if (it.prices && typeof it.prices === 'object') {
        Object.entries(it.prices).forEach(([k, v]) => { if (v != null) map[String(k).toLowerCase()] = Number(v);});
      } else if (Array.isArray(it.priceList)) {
        it.priceList.forEach(p => {
          if (!p) return;
          const name = p.name || p.label || p.size || p.title;
          const price = p.price ?? p.value ?? p.cost;
          if (name && price != null) map[String(name).toLowerCase()] = Number(price);
        });
      } else if (it.variantPrices && typeof it.variantPrices === 'object') {
        Object.entries(it.variantPrices).forEach(([k, v]) => { if (v != null) map[String(k).toLowerCase()] = Number(v);});
      }}
    // fallback: check common numeric fields
    if (Object.keys(map).length === 0) {
      const possible = ['price', 'cost', 'amount', 'value', 'unitPrice'];
      for (const p of possible) {
        if (it[p] != null) {
          map['regular'] = Number(it[p]);
          break;
        }}}
    return map;
  };
  // Hooks — always called in same order
  const priceMap = useMemo(() => buildPriceMap(safeItem), [JSON.stringify(safeItem)]);
  const sizeKeys = useMemo(() => {
    const keys = Object.keys(priceMap);
    const preferred = ['half', 'regular', 'medium', 'full', 'large', 'extra', 'extralarge', 'xl'];
    return keys.sort((a, b) => {
      const ai = preferred.indexOf(a);
      const bi = preferred.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [JSON.stringify(priceMap)]);

  useEffect(() => {
    if (!size && sizeKeys.length > 0) {
      setSize(sizeKeys[0]);
    }
  }, [JSON.stringify(sizeKeys)]); 

  const getPriceFor = (sz) => {
    if (!sz) return 0;
    const key = String(sz).toLowerCase();
    const val = priceMap[key];
    if (val != null && !isNaN(Number(val))) return Number(val);
    if (key === 'regular' && priceMap['half'] != null) return Number(priceMap['half']);
    if (key === 'medium' && priceMap['full'] != null && priceMap['half'] != null) {
      return Math.round((Number(priceMap['full']) + Number(priceMap['half'])) / 2);
    }
    const anyVal = Object.values(priceMap).find(v => !isNaN(Number(v)));
    return anyVal ? Number(anyVal) : 0;
  };
  const unitPrice = useMemo(() => getPriceFor(size), [size, JSON.stringify(priceMap)]);
  const total = useMemo(() => unitPrice * qty, [unitPrice, qty]);
  // safe early return after hooks
  if (!item) return null;
  const handleAddToCart = () => {
    const payload = { _id: item._id || item.id || item.name, name: item.name, img: item.img, qty: Number(qty), size, unitPrice: Number(unitPrice), totalPrice: Number(total), options: item.options || [], };
    dispatch({ type: 'ADD_TO_CART', payload });
  };
  return (
    <div className='card mt-3' style={{ width: '18rem', maxHeight: '360px' }}>
      <img src={item.img || 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg'} className='card-img-top' alt={item.name || 'Food'} style={{ height: 160, objectFit: 'cover' }} />
      <div className='card-body'>
        <h5 className='card-title mt-2'>{item.name}</h5>
        <div className='d-flex gap-2 align-items-center mb-2'>
          <select className='form-select' value={qty} onChange={e => setQty(Number(e.target.value))} aria-label='Quantity' style={{ width: 80 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}</select>
          <select className='form-select' value={size || ''} onChange={e => setSize(e.target.value)} aria-label='Size' style={{ minWidth: 150 }}>
            {sizeKeys.length > 0 ? sizeKeys.map(k => (
              <option key={k} value={k}>{String(k).charAt(0).toUpperCase() + String(k).slice(1)} — ₹{isNaN(getPriceFor(k)) ? '-' : getPriceFor(k)}</option>
            )) : (<option value='regular'>Regular — ₹{isNaN(unitPrice) ? '0' : unitPrice}</option>)}
          </select>
        </div>
      </div>
      <div className='card-footer d-flex justify-content-between align-items-center'>
        <div className='small text-muted'>Total Price:</div>
        <div className='fw-bold fs-5'>₹{isNaN(total) ? '0' : total.toFixed(0)}</div>
        <button className='btn btn-success ms-2' onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
