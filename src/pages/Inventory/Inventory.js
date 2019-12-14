import React, { useState, useEffect } from 'react';
import './Inventory.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheck } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '../../components/ui-toolkit/Checkbox/Checkbox';
import Loader from '../../images/loader.svg';
import { getAllItems, saveInventoryStatus } from '../../services/restaurantService';

const Inventory = () => {
  const [items, setItems] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [itemsChanges, setItemsChanges] = useState({});

  const getItems = (items, category, subCategory) => {
    return (
      <ul className="items">
        {items &&
          items.map(item => (
            <li key={item.code}>
              <span>{item.name}</span>
              <div className="right-section">
                <span className="price">{item.price}</span>
                <Checkbox
                  value={item.available}
                  onChange={newStatus => handleChange(newStatus, item.code, category, subCategory)}
                />
              </div>
            </li>
          ))}
      </ul>
    );
  };

  const handleChange = (newStatus, itemCode, category, subCategory) => {
    setItemsChanges(current => {
      const newItemsStatus = { ...current };
      if (!newItemsStatus[category]) newItemsStatus[category] = {};
      if (subCategory) {
        if (!newItemsStatus[category][subCategory]) newItemsStatus[category][subCategory] = {};
        if (itemCode) {
          newItemsStatus[category][subCategory][itemCode] = { status: newStatus };
        }
      } else {
        newItemsStatus[category][itemCode] = { status: newStatus };
      }
      return newItemsStatus;
    });

    setItems(current => {
      const newItems = [...current];
      const categoryData = newItems.find(cat => cat.category === category);

      if (categoryData) {
        if (subCategory) {
          const subCatData = categoryData.subCategories.find(subCat => subCat.code === subCategory);
          const subCatItemDetails = subCatData.items.find(item => item.code === itemCode);
          subCatItemDetails.available = newStatus;
        } else {
          const itemDetails = categoryData.items.find(item => item.code === itemCode);
          itemDetails.available = newStatus;
        }
      }

      return newItems;
    });
  };

  const refreshItemsStatus = async () => {
    setLoading(true);
    const { status, data } = await getAllItems();
    if (status === 'success') {
      const { items } = data;
      if (items) {
        setItems(items);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshItemsStatus();
  }, []);

  const saveInventory = async () => {
    setLoadingSave(true);
    const { status } = await saveInventoryStatus(itemsChanges);
    if (status === 'success') {
      setItemsChanges({});
      setMessage(
        <>
          <FontAwesomeIcon icon={faCheck} /> Your changes have been saved.
        </>
      );
    }
    setLoadingSave(false);
  };

  const resetInventoryStatus = () => {
    setItemsChanges({});
    refreshItemsStatus();
  };

  return (
    <div className="inventory-container">
      <h2>
        <FontAwesomeIcon icon={faTruck} /> Manage food inventory
      </h2>
      {message && (
        <div className="error-message" style={{ marginBottom: 10 }}>
          {message}
        </div>
      )}
      {Object.keys(itemsChanges) && Object.keys(itemsChanges).length > 0 && (
        <div className="btn-right-section">
          <button className="btn-save" onClick={saveInventory} disabled={loadingSave}>
            {loadingSave ? 'Saving...' : 'Save Inventory Status'}
          </button>
          <button className="btn-reset" onClick={resetInventoryStatus}>
            Reset Changes
          </button>
        </div>
      )}
      <div className="items-inventory">
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <img src={Loader} alt="Loading" />
          </div>
        )}
        {!loading && items && items.length > 0 && (
          <>
            {items.map((item, i) => (
              <div key={i}>
                <h3>{item.label}</h3>
                {item.items && item.items.length > 0 && getItems(item.items, item.category)}
                {item.subCategories &&
                  item.subCategories.length > 0 &&
                  item.subCategories.map(subCat => (
                    <div key={subCat.code}>
                      <h4>{subCat.label}</h4>
                      {subCat.items &&
                        subCat.items.length > 0 &&
                        getItems(subCat.items, item.category, subCat.code)}
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory;
