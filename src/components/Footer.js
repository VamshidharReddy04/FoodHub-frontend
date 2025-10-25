import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-light text-muted mt-5" aria-labelledby="footer-heading">
      <div className="container py-4">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h5 id="footer-heading" className="text-dark">FoodHub</h5>
            <p className="small mb-2">
              Fast. Fresh. Friendly. Order your favourite dishes, track delivery progress and confirm on receipt.
            </p>
            <p className="small text-muted mb-0">© {year} FoodHub, Inc</p>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="text-dark">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none">Explore</Link></li>
              <li><Link to="/cart" className="text-muted text-decoration-none">My Cart</Link></li>
              <li><Link to="/order" className="text-muted text-decoration-none">My Orders</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-dark">Help & Support</h6>
            <ul className="list-unstyled small">
              <li><a href="/faq" className="text-muted text-decoration-none">FAQ</a></li>
              <li><a href="/terms" className="text-muted text-decoration-none">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-muted text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-12 col-md-3">
            <h6 className="text-dark">Contact</h6>
            <p className="small mb-1 text-muted">Email: <a href="mailto:support@foodhub.example" className="text-muted">support@foodhub.example</a></p>
            <p className="small mb-2 text-muted">Phone: <a href="tel:+1234567890" className="text-muted">+1 234 567 890</a></p>
            <div className="d-flex gap-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">Twitter</a>
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <div className="d-flex flex-column flex-md-row justify-content-between small">
          <div className="text-muted">Built with ❤️ — Local demo app</div>
          <div className="text-muted">Made by FoodHub Team</div>
        </div>
      </div>
    </footer>
  )
}
