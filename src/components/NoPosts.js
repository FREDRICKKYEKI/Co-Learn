import React from 'react'

export const NoPosts = () => {
  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <span style={{ width: "70%", marginInline: "auto", textAlign: "center" }}>
        No posts in this learning space. Be the first to post <div style={{fontSize:"30px"}}>😜</div>
      </span>
    </div>
  );
}
