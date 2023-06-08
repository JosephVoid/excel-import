import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/landing_page';
import ImportViewPage from './pages/import_view_page';
import NotFoundPage from './pages/not_found_page';
import ListPage from './pages/list_page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
    children: [
      {
        path: "/",
        element: <ListPage/>
      },
      {
        path: "/import",
        element: <ImportViewPage page='NEW'/>
      },
      {
        path: "/view/:id",
        element: <ImportViewPage page='VIEW'/>
      }
    ]
  },  
  {
    path: "*",
    element: <NotFoundPage/>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />     
    </>
  );
}

export default App;
