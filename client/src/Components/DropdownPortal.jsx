import { createPortal } from "react-dom";

const DropdownPortal = ({ children }) => {
  return createPortal(children, document.body);
};

export default DropdownPortal;
