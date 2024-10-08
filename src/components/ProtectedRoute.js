import React from "react"
import { Navigate, Route } from "react-router"
import { useSelector } from "react-redux"

const ProtectedRoute = props => {
  const auth = useSelector(state => state.auth)

  if (auth.account) {
    if (props.path === "/login") {
      return <Navigate to={"/"} />
    }
    return <Route {...props} />
  } else if (!auth.account) {
    return <Navigate to={"/login"} />
  } else {
    return <div>Not found</div>
  }
}

export default ProtectedRoute
