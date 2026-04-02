import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const allColors = [...new Set(products.flatMap((p: Product) => p.variants.map(v => v.color)).filter(Boolean))];
  const allSizes = [...new Set(products.flatMap((p: Product) => p.variants.map(v => v.size)).filter(Boolean))];

  const filtered = products
    .filter((p: Product) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchColor = selectedColors.length === 0 || p.variants.some(v => selectedColors.includes(v.color));
      const matchSize = selectedSizes.length === 0 || p.variants.some(v => selectedSizes.includes(v.size));
      const matchPrice = p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1];
      return matchSearch && matchColor && matchSize && matchPrice;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc': return a.basePrice - b.basePrice;
        case 'price-desc': return b.basePrice - a.basePrice;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedColors, selectedSizes, priceRange, sortBy]);

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
    <div className="catalog-luxe fade-in">
      <header className="catalog-luxe__header">
        <div className="container">
          <div className="catalog-header__top">
            <h1 className="catalog-header__title">Catálogo Completo</h1>
            <p className="catalog-header__subtitle">Explore piezas atemporales seleccionadas para hoy.</p>
          </div>
          
          <div className="catalog-header__toolbar">
            <div className="catalog-header__search">
              <FiSearch size={16} />
              <input 
                type="text" 
                placeholder="Buscar pieza..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="catalog-header__actions">
              <button 
                className={`catalog-header__btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter size={16} /> Filtros {hasFilters && `(${selectedColors.length + selectedSizes.length})`}
              </button>
              <div className="catalog-header__sort">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Alfabético</option>
                  <option value="price-asc">Precio menor</option>
                  <option value="price-desc">Precio mayor</option>
                </select>
                <FiChevronDown size={14} className="sort-icon" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container catalog-luxe__main">
        {showFilters && (
          <aside className="catalog-luxe__sidebar fade-in">
            <div className="filter-sec">
              <h5>Colores</h5>
              <div className="filter-sec__colors">
                {allColors.map(color => (
                  <button
                    key={color as string}
                    className={`color-dot ${selectedColors.includes(color as string) ? 'active' : ''}`}
                    style={{ backgroundColor: color as string }}
                    onClick={() => toggleColor(color as string)}
                  />
                ))}
              </div>
            </div>
            <div className="filter-sec">
              <h5>Tallas</h5>
              <div className="filter-sec__sizes">
                {allSizes.map(size => (
                  <button
                    key={size as string}
                    className={`size-btn ${selectedSizes.includes(size as string) ? 'active' : ''}`}
                    onClick={() => toggleSize(size as string)}
                  >
                    {size as string}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-sec">
              <h5>Precio máximo: €{priceRange[1]}</h5>
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="luxe-range"
              />
            </div>
            {hasFilters && (
              <button className="btn-clear" onClick={clearFilters}>Limpiar Selección</button>
            )}
          </aside>
        )}

        <div className="catalog-luxe__content">
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="products-grid">
                {paginatedProducts.map((product: Product, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="luxe-pagination">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <FiChevronLeft /> Anterior
                  </button>
                  <div className="luxe-pagination__pages">
                    {currentPage} / {totalPages}
                  </div>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    Siguiente <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="catalog-empty">
              <h3>No se han encontrado piezas.</h3>
              <p>Intente ajustar sus criterios de selección.</p>
              <button onClick={clearFilters} className="btn btn--outline">Ver Todo</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
