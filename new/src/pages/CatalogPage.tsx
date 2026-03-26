import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../api/api';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allColors = [...new Set(products.flatMap(p => p.variants.map(v => v.color)).filter(Boolean))];
  const allSizes = [...new Set(products.flatMap(p => p.variants.map(v => v.size)).filter(Boolean))];

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchColor = selectedColors.length === 0 || p.variants.some(v => selectedColors.includes(v.color));
      const matchSize = selectedSizes.length === 0 || p.variants.some(v => selectedSizes.includes(v.size));
      const matchPrice = p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1];
      return matchSearch && matchColor && matchSize && matchPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.basePrice - b.basePrice;
        case 'price-desc': return b.basePrice - a.basePrice;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };
  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSearchTerm('');
  };
  const hasFilters = selectedColors.length > 0 || selectedSizes.length > 0 || searchTerm !== '';

  return (
    <div className="catalog">
      {/* Header */}
      <div className="catalog__header">
        <div className="catalog__header-content">
          <h1 className="catalog__title">Catálogo</h1>
          <p className="catalog__subtitle">Descubre toda nuestra colección</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="catalog__toolbar">
        <div className="catalog__search">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="catalog__search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="catalog__toolbar-actions">
          <button
            className={`btn btn--filter ${showFilters ? 'btn--filter-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter size={16} /> Filtros
            {hasFilters && <span className="btn__dot" />}
          </button>
          <div className="catalog__sort">
            <FiChevronDown size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Nombre A-Z</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="catalog__filters">
          <div className="filter-group">
            <h4>Colores</h4>
            <div className="filter-group__colors">
              {allColors.map(color => (
                <button
                  key={color}
                  className={`filter-color ${selectedColors.includes(color) ? 'filter-color--active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => toggleColor(color)}
                  title={color}
                />
              ))}
              {allColors.length === 0 && <span className="filter-group__empty">No hay colores</span>}
            </div>
          </div>
          <div className="filter-group">
            <h4>Tallas</h4>
            <div className="filter-group__sizes">
              {allSizes.map(size => (
                <button
                  key={size}
                  className={`filter-size ${selectedSizes.includes(size) ? 'filter-size--active' : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
              {allSizes.length === 0 && <span className="filter-group__empty">No hay tallas</span>}
            </div>
          </div>
          <div className="filter-group">
            <h4>Precio</h4>
            <div className="filter-group__price">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="filter-range"
              />
              <div className="filter-group__price-labels">
                <span>€0</span>
                <span>Hasta €{priceRange[1]}</span>
              </div>
            </div>
          </div>
          {hasFilters && (
            <button className="btn btn--ghost" onClick={clearFilters}>
              <FiX size={16} /> Limpiar Filtros
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="catalog__results-info">
        <span>{filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="products-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-skeleton">
              <div className="product-skeleton__image" />
              <div className="product-skeleton__text" />
              <div className="product-skeleton__text product-skeleton__text--short" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <h3>No encontramos productos</h3>
          <p>Prueba con otros filtros o busca algo distinto</p>
          {hasFilters && (
            <button className="btn btn--primary" onClick={clearFilters}>Limpiar Filtros</button>
          )}
        </div>
      )}
    </div>
  );
}
