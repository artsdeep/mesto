import React, {Suspense} from 'react';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props  }) => {
  console.log(props)
  return (
    <Route exact>
      {
        () => props.loggedIn ?<Suspense fallback={<div>Loading...</div>}> <Component {...props} /> </Suspense>: <Redirect to="./signin" />
      }
    </Route>
)}

export default ProtectedRoute;
