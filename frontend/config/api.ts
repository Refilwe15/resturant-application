// Backend API Configuration
// Change this based on your environment or network setup.
// When running in the iOS simulator, `localhost` works fine.
// Android emulator requires 10.0.2.2.
// Physical devices or remote simulators need your machine's LAN IP (e.g. http://10.0.0.113:8000).
// To avoid changing the value constantly we can pick based on Platform.

import { Platform } from "react-native";

// NOTE: adjust this value when running on a real device.  The iOS
// simulator can use localhost, but physical phones must reach your
// computer over the local network using its LAN IP.  Set `LOCAL_IP`
// to whatever `ipconfig`/`ifconfig` shows for your machine.
const LOCAL_IP = "10.196.0.195"; // <-- change me when testing on a device

export const API_BASE_URL = "https://resturant-application-5.onrender.com";

// Export specific endpoint URLs
export const AUTH_API = `${API_BASE_URL}/api/auth`;
export const FOODS_API = `${API_BASE_URL}/api/foods`;
export const ORDERS_API = `${API_BASE_URL}/api/orders`;
export const USERS_API = `${API_BASE_URL}/api/users`;
export const CART_API = `${API_BASE_URL}/api/cart`;
export const PAYMENT_API = `${API_BASE_URL}/api/payment`;
