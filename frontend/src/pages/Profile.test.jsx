import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import Profile from './Profile';
import '@testing-library/jest-dom/extend-expect';

// Mock axios
import axios from 'axios';
jest.mock('axios');

// Mock user data
const mockUser = {
  name: 'Abian',
  email: 'abian@example.com',
  classCode: '5B',
  avatar_url: ''
};

// Mock context
jest.mock('../context/AuthContext', () => {
  const actual = jest.requireActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      fetchUser: jest.fn(),
    }),
  };
});

describe('Profile Component', () => {
  it('renders user information', async () => {
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );

    expect(screen.getByText('Abian')).toBeInTheDocument();
    expect(screen.getByDisplayValue('abian@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5B')).toBeInTheDocument();
  });

  it('can update name and submit', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Updated' } });

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    );

    const nameInput = screen.getByLabelText(/nama/i);
    fireEvent.change(nameInput, { target: { value: 'Abian Baru' } });

    const saveBtn = screen.getByText(/simpan/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });
  });
});
