import React from "react";

const MenuItemCard = ({ item, onAdd }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition duration-300"
      onClick={() => onAdd(item)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h2 className="text-lg font-semibold">{item.name}</h2>
      <p className="text-sm text-gray-600">{item.description}</p>
      <p className="text-md font-bold mt-2">₹{item.price}</p>
    </div>
  );
};

export default MenuItemCard;
