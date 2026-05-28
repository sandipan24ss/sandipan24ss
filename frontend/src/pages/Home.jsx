import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [listings, setListings] = useState([]);
  useEffect(() => {
    fetch('/api/listings').then(res => res.json()).then(setListings);
  }, []);
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {listings.map(l => (
        <div key={l.id} className="border rounded p-2 shadow">
          <img src={l.images?.[0] || 'https://via.placeholder.com/300'} alt={l.title} className="w-full h-48 object-cover" />
          <h2 className="text-xl font-bold">{l.title}</h2>
          <p>${l.price_per_night} / night</p>
          <p>{l.location}</p>
          <Link to={`/listing/${l.id}`} className="text-blue-500">View Details</Link>
        </div>
      ))}
    </div>
  );
}
