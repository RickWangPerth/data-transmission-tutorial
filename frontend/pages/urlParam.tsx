import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
}

const UrlParamPage = () => {
    // State to hold the items fetched from the backend
    const [items, setItems] = useState<Item[]>([]);
    // State to indicate loading status
    const [loading, setLoading] = useState<boolean>(false);
    // State to hold the name filter value
    const [nameFilter, setNameFilter] = useState('');
    // State to hold the price filter value
    const [priceFilter, setPriceFilter] = useState('');
    // Router to manage URL changes and navigation
    const router = useRouter();

    // Function to fetch items from the backend based on filter parameters
    const fetchItems = async (filterParams?: string) => {
        setLoading(true); // Set loading state to true
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/url_app/items?${filterParams}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data); // Set the fetched items to the state
        } catch (error) {
            console.error('Failed to fetch items:', error); // Log error if fetch fails
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    // Function to apply filters and update the URL with filter parameters
    const applyFilters = () => {
        const query = new URLSearchParams();
        if (nameFilter) query.set('name', nameFilter);
        if (priceFilter) query.set('price', priceFilter);
        const queryString = query.toString();
        // Update the URL with filter parameters without a full page reload
        router.push(`/urlParamPage?${queryString}`, undefined, { shallow: true });
        fetchItems(queryString); // Fetch items based on the applied filters
    };

    // Effect to fetch items based on URL query parameters when the component mounts
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const name = query.get('name') || '';
        const price = query.get('price') || '';
        setNameFilter(name); // Initialize name filter from URL
        setPriceFilter(price); // Initialize price filter from URL
        fetchItems(query.toString()); // Fetch items based on the URL parameters
    }, [router.query]); // Dependencies array to re-run the effect when the URL query changes

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-semibold text-gray-900 my-6">Items</h1>
            <div className="flex gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)} // Update name filter state on input change
                    className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="text"
                    placeholder="Filter by price"
                    value={priceFilter}
                    onChange={e => setPriceFilter(e.target.value)} // Update price filter state on input change
                    className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                    onClick={applyFilters} // Apply filters when the button is clicked
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Apply Filters
                </button>
            </div>
            {loading ? (
                <p className="text-center">Loading...</p> // Show loading indicator while fetching data
            ) : (
                <ul className="list-disc pl-5">
                    {items.map(item => (
                        <li key={item.id} className="py-2">
                            {item.name} - ${item.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UrlParamPage;
