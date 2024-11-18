import { useState, useEffect } from 'react';
import axios from 'axios';

const CRUDComponent = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editItem, setEditItem] = useState(null);

  // Fetch all items from MongoDB
  const fetchData = async () => {
    try {
      const response = await axios.get('YOUR_MONGODB_DATA_API_URL');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create a new item
  const createItem = async () => {
    try {
      await axios.post('YOUR_MONGODB_DATA_API_URL', { item: newItem });
      setNewItem('');
      fetchData();
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  // Update an item
  const updateItem = async (id:any, updatedItem:any) => {
    try {
      await axios.put(`YOUR_MONGODB_DATA_API_URL/${id}`, { item: updatedItem });
      setEditItem(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  // Delete an item
  const deleteItem = async (id:any) => {
    try {
      await axios.delete(`YOUR_MONGODB_DATA_API_URL/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Items List</h2>
      <ul>
        {data.map((item:any) => (
          <li key={item._id} className="flex items-center justify-between border-b py-2">
            {editItem === item._id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => updateItem(item._id, e.target.value)}
                  className="border rounded py-1 px-2 mr-2"
                />
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded"
                  onClick={() => updateItem(item._id, item.item)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-4">{item.item}</span>
                <button
                  className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => setEditItem(item._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-4">Add New Item</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter new item"
          className="border rounded py-2 px-4 mr-2"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={createItem}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default CRUDComponent;
