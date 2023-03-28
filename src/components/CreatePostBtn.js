import React from 'react'

export const CreatePostBtn = ({ open, loading}) => {
  return (
    <button
      disabled={loading}
      type={`${open && "submit"}`}
      className={`create-post-btn ${open && "bg"}`}
    >
      {open ? (
        <>
          <i className="fa fa-plus-circle mr-2" />
          {loading ? (
            <i
              className="fa fa-spinner fa-spin"
              style={{ fontSize: "24px" }}
            ></i>
          ) : (
            <>Post</>
          )}
        </>
      ) : (
        "+ Create Post"
      )}
    </button>
  );
}
