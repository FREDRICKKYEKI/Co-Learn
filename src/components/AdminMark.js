import React from 'react'

export const AdminMark = ({ isAdmin, sm=false }) =>
{
  return (
  <>
  {isAdmin && <div className={`admin-mark ${sm&&"am-sm"}`}>{!sm&&"admin"}</div>}
  </>);
}
