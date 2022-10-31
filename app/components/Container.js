import React, { useEffect } from "react"

function Container({children, isWide=false}) {
  return (
    <div className={`container ${!isWide?"container--narrow":""} py-md-5`}>
        {children}
    </div>
  )
}

export default Container
