// library-inventory-system\src\components\ManageFareSettings.tsx


"use client";

import React, { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LibraryNavbar from './LibraryNavbar';

interface FareSettings {
  _id?: string;
  borrowDuration: number; // in days
  borrowFee: number; // in currency units
  lateFeePerDay: number; // in currency units
  maxBorrowDuration: number; // maximum allowed borrow duration in days
  currency: string; // currency symbol or code
  updatedAt?: Date;
}

const ManageFareSettings: React.FC = () => {
  const [settings, setSettings] = useState<FareSettings>({
    borrowDuration: 14,
    borrowFee: 0,
    lateFeePerDay: 1,
    maxBorrowDuration: 30,
    currency: '$'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fare-settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch fare settings');
      }
      
      const data = await response.json();
      
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      setError('Error loading fare settings. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['borrowDuration', 'borrowFee', 'lateFeePerDay', 'maxBorrowDuration'].includes(name)) {
      setSettings({
        ...settings,
        [name]: parseFloat(value) || 0
      });
    } else {
      setSettings({
        ...settings,
        [name]: value
      });
    }
    
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (settings.borrowDuration <= 0) {
      setError('Borrow duration must be greater than 0');
      return;
    }
    
    if (settings.lateFeePerDay < 0) {
      setError('Late fee cannot be negative');
      return;
    }
    
    if (settings.maxBorrowDuration < settings.borrowDuration) {
      setError('Maximum borrow duration cannot be less than default borrow duration');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/fare-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update fare settings');
      }
      
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('Fare settings updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📝</span> Manage Book Fare Settings
      </h2>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-2" />
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center"
        >
          <FiCheckCircle className="mr-2" />
          {success}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Borrow Duration */}
          <div>
            <label htmlFor="borrowDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Default Borrow Duration (days)
            </label>
            <input
              type="number"
              id="borrowDuration"
              name="borrowDuration"
              value={settings.borrowDuration}
              onChange={handleChange}
              min="1"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          {/* Maximum Borrow Duration */}
          <div>
            <label htmlFor="maxBorrowDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Borrow Duration (days)
            </label>
            <input
              type="number"
              id="maxBorrowDuration"
              name="maxBorrowDuration"
              value={settings.maxBorrowDuration}
              onChange={handleChange}
              min={settings.borrowDuration}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY (¥)</option>
              <option value="₹">INR (₹)</option>
              <option value="₽">RUB (₽)</option>
              <option value="₩">KRW (₩)</option>
              <option value="C$">CAD (C$)</option>
              <option value="A$">AUD (A$)</option>
            </select>
          </div>
          
          {/* Borrow Fee */}
          <div>
            <label htmlFor="borrowFee" className="block text-sm font-medium text-gray-700 mb-1">
              Borrow Fee ({settings.currency})
            </label>
            <input
              type="number"
              id="borrowFee"
              name="borrowFee"
              value={settings.borrowFee}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          {/* Late Fee Per Day */}
          <div className="md:col-span-2">
            <label htmlFor="lateFeePerDay" className="block text-sm font-medium text-gray-700 mb-1">
              Late Fee Per Day ({settings.currency})
            </label>
            <input
              type="number"
              id="lateFeePerDay"
              name="lateFeePerDay"
              value={settings.lateFeePerDay}
              onChange={handleChange}
              min="0"
              step="1"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        
        {settings.updatedAt && (
          <p className="text-sm text-gray-500 italic">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </p>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !isEditing}
            className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
              isLoading || !isEditing
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageFareSettings;
