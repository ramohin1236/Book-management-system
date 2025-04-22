import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Home from './Pages/Home.jsx';
import Shop from './Pages/shop/Shop.jsx';
import BookDetails from './Pages/BookDetails.jsx';
import EditBook from './Pages/EditBook.jsx';
import AddBook from './Pages/AddBook.jsx';
import SignUp from './Pages/Auth/SignUp.jsx';
import Login from './Pages/Auth/Login.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Shop/>} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
