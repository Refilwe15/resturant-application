// import React, { createContext, useContext, useState } from "react";

// /* TYPES */
// type User = {
//   role: "admin" | "user";
// } | null;

// type AuthContextType = {
//   user: User;
//   login: (role: "admin" | "user") => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User>(null);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login: (role) => setUser({ role }),
//         logout: () => setUser(null),
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// /* ROOT LAYOUT */
// // export default function RootLayout() {
// //   return (
// //     <AuthProvider>
// //       <Stack />
// //     </AuthProvider>
// //   );
// // }
// import React from "react";
// import { StripeProvider } from "@stripe/stripe-react-native";
// import { Stack } from "expo-router";
//
// export default function RootLayout() {
//   return (
//     <StripeProvider publishableKey="pk_test_51SsraaKTVBgvw4ZPmE5W4d8pCMDP7NlDqJmUhGgTMg9z5y3XTm1siBLl5YZBspBL3a8hGlVycZvy2KrZeQ7sFA5c00QuyLWasT">
//       <Stack />
//     </StripeProvider>
//   );

import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AuthProvider>
  );
}
