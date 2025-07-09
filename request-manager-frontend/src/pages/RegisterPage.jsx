import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password))
      return 'Strong';
    return 'Medium';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = getPasswordStrength(value);
      setStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const { confirmPassword, ...dataToSend } = formData; // exclude confirmPassword
      const response = await axios.post('http://localhost:8080/api/users/register', dataToSend);

      alert('Registration successful!');
      setFormData({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
      setStrength('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const message = error.response.data;
        if (message.includes("Username already exists")) {
          alert("This username is already taken. Try a different one.");
        } else if (message.includes("Email already exists")) {
          alert("An account with this email already exists.");
        } else {
          alert("Registration failed: " + message);
        }
      } else {
        alert("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {['name', 'email', 'username'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <sup className="text-red-600">*</sup>
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password <sup className="text-red-600">*</sup></label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded pr-10"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2.5 cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          {formData.password && (
            <p className={`text-sm mt-1 ${strength === 'Strong' ? 'text-green-600' : strength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              Strength: {strength}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium">Re-enter Password <sup className="text-red-600">*</sup></label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>

        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
