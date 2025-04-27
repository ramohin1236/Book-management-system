import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from "react-router"
import Home from './Pages/Home.jsx';
import Shop from './Pages/shop/Shop.jsx';
import BookDetails from './Pages/BookDetails.jsx';
import EditBook from './Pages/EditBook.jsx';
import AddBook from './Pages/AddBook.jsx';
import SignUp from './Pages/Auth/SignUp.jsx';
import Login from './Pages/Auth/Login.jsx';
import PrivateRoute from './Pages/Auth/PrivateRoute.jsx';
import AuthProvider from './context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider> {/* ✅ wrap everything */}
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Shop />} />

          {/* 🔐 Admin-only Routes */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/books/edit/:id" element={<EditBook />} />
            <Route path="/books/add" element={<AddBook />} />
          </Route>
          <Route  element={<PrivateRoute userOnly={true} />}>
            <Route  path="/books/:id" element={<BookDetails />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
