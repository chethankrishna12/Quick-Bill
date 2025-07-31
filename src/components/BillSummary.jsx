import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const BillSummary = ({
  order,
  onRemove,
  onPlaceOrder,
  onQuantityChange, // new prop
}) => {
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Your Order</h2>
        <ul className="space-y-4">
          <AnimatePresence>
            {order.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-start bg-gray-50 p-3 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity} ={" "}
                      <strong>₹{item.price * item.quantity}</strong>
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center mt-1 gap-2">
                      <button
                        onClick={() => onQuantityChange(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(index, item.quantity + 1)}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:underline text-lg"
                  title="Remove item"
                >
                  ✕
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl w-full hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default BillSummary;
