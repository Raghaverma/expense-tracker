import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onAddTransaction, editingTransaction, onUpdateTransaction }) => {
  const initialFormState = {
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    tags: [],
    notes: '',
    recurring: false,
    recurringPeriod: 'monthly'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        date: new Date(editingTransaction.date).toISOString().split('T')[0]
      });
    }
  }, [editingTransaction]);

  const categories = {
    expense: [
      { id: 'rent', label: 'Rent/Mortgage', icon: '🏠' },
      { id: 'utilities', label: 'Utilities', icon: '💡' },
      { id: 'food', label: 'Food & Dining', icon: '🍕' },
      { id: 'transport', label: 'Transportation', icon: '🚗' },
      { id: 'entertainment', label: 'Entertainment', icon: '🎮' },
      { id: 'shopping', label: 'Shopping', icon: '🛍️' },
      { id: 'health', label: 'Healthcare', icon: '⚕️' },
      { id: 'travel', label: 'Travel', icon: '✈️' },
      { id: 'education', label: 'Education', icon: '📚' },
      { id: 'other', label: 'Other', icon: '📝' }
    ],
    income: [
      { id: 'salary', label: 'Salary', icon: '💰' },
      { id: 'freelance', label: 'Freelance', icon: '💻' },
      { id: 'investment', label: 'Investments', icon: '📈' },
      { id: 'rental', label: 'Rental Income', icon: '🏘️' },
      { id: 'gift', label: 'Gifts', icon: '🎁' },
      { id: 'other', label: 'Other', icon: '📝' }
    ]
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'credit', label: 'Credit Card', icon: '💳' },
    { id: 'debit', label: 'Debit Card', icon: '🏧' },
    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
    { id: 'mobile', label: 'Mobile Payment', icon: '📱' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid positive amount';
      }
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      if (isNaN(selectedDate.getTime())) {
        newErrors.date = 'Please enter a valid date';
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      if (editingTransaction) {
        await onUpdateTransaction(transactionData);
      } else {
        await onAddTransaction(transactionData);
      }

      // Reset form on success
      setFormData(initialFormState);
      setErrors({});
      setTagInput('');
      
      // Show success message
      const message = editingTransaction ? 'Transaction updated successfully!' : 'Transaction added successfully!';
      alert(message); // You might want to replace this with a better notification system
    } catch (error) {
      console.error('Transaction error:', error);
      setErrors({
        submit: error.message || 'Failed to save transaction. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <p className="form-subtitle">
          {editingTransaction 
            ? 'Update your transaction details below'
            : 'Enter the details of your transaction below'}
        </p>
      </div>

      <div className="type-selector">
        <button
          type="button"
          className={`type-button ${formData.type === 'expense' ? 'active expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          <span className="type-button-icon">💸</span>
          <span>Expense</span>
        </button>
        <button
          type="button"
          className={`type-button ${formData.type === 'income' ? 'active income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          <span className="type-button-icon">💰</span>
          <span>Income</span>
        </button>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
          <label className="form-label">Category</label>
          <select
            name="category"
            className="category-select"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            {categories[formData.type].map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.category}
            </div>
          )}
        </div>

        <div className={`form-group ${errors.amount ? 'has-error' : ''}`}>
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            className="form-input"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
          />
          {errors.amount && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.amount}
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <input
          type="text"
          name="description"
          className="form-input"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleInputChange}
        />
        {errors.description && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {errors.description}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleInputChange}
          />
          {errors.date && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.date}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select
            name="paymentMethod"
            className="category-select"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.icon} {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className="tags-input-container">
          <div className="tags-list">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => handleTagRemove(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="tags-input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTagAdd(e)}
            />
            <button
              type="button"
              className="tag-add-button"
              onClick={handleTagAdd}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-input"
          placeholder="Add any additional notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows="3"
        />
      </div>

      <div className="form-group recurring-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="recurring"
            checked={formData.recurring}
            onChange={handleInputChange}
          />
          <span>This is a recurring transaction</span>
        </label>
        
        {formData.recurring && (
          <select
            name="recurringPeriod"
            className="category-select"
            value={formData.recurringPeriod}
            onChange={handleInputChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}
      </div>

      {errors.submit && (
        <div className="error-message submit-error">
          <span className="error-icon">⚠️</span>
          {errors.submit}
        </div>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={isSubmitting}
      >
        <span>
          {isSubmitting 
            ? 'Saving...' 
            : editingTransaction 
              ? 'Update Transaction' 
              : 'Add Transaction'}
        </span>
      </button>
    </form>
  );
};

export default TransactionForm; 