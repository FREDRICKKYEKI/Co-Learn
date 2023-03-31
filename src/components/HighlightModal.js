import React, { useEffect } from 'react'
import { useAuth } from './Contexts/AuthProvider';
import { Highlight } from './Highlight'
import { useSpaceContext } from './LearningSpace';
import { Modal } from './Modal'

export const HighlightModal = ({ open, setOpen, }) => {
  const { currentUser} = useAuth();
  const { user, highlights } = useSpaceContext();

  return (
    <>
      {currentUser ? (
        <Modal open={open} setOpen={setOpen}>
          <Highlight setOpen={setOpen} userObj={user} highlightObj={highlights} forSide={false} />
        </Modal>
      ) : (
        alert("Please sign in to be able to annotate your highlights.")
      )}
    </>
  );
}
