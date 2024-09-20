import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddProduct from './components/shared/AddProduct'
import Home from './components/shared/Home'
import ProductDetail from './components/shared/ProductDetail'


const App = () => {
  const routes = [
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/add/product",
      element:<AddProduct/>
    },
    {
      path:"/update/product/:id",
      element:<AddProduct/>
    },
    {
      path:"/product/view/:id",
      element:<ProductDetail/>
    },
  ]
  return (
    <Routes>
       {
        routes.map((route,i)=>{
         return <Route path={route.path} element={route.element} key={i}/>
        })
       }
    </Routes>
  )
}

export default App