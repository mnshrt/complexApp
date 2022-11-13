import React, { useEffect } from "react"
import Page from "./Page"
import {Link} from "react-router-dom"
function NotFound() {
  return (
<Page title="Not Found">
      <div className="text-center">
          <h2>Whoops, we cannnot find that page</h2>
          <p>You can always visit the <Link to="/">homepage</Link> to get a fresh start</p>
      </div>
    </Page>
  )
}

export default NotFound