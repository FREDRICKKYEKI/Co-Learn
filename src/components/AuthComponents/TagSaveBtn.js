import React from 'react'

export const TagSaveBtn = ({ loading, handleSaveTags, setFocus }) => {
  return (
    <div className="saveBtn d-flex g-2">
      <button
        disabled={loading}
        style={{ all: "unset" }}
        onClick={(e) => handleSaveTags(e)}
      >
        {loading ? (
          <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px" }} />
        ) : (
          <>Save</>
        )}
      </button>
      <i onClick={() => setFocus(false)} className="fa fa-times" />
    </div>
  );
}
