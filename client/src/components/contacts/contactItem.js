import React, { useContext } from "react";
import PropTypes from "prop-types";
import ContactContext from "../../context/contact/ContactContext";
const ContactItem = ({ contact }) => {
  const { _id, name, email, type, phone } = contact;
  const contactContext = useContext(ContactContext);
  const onDelete = () => {
    contactContext.deleteContact(_id);
    contactContext.clearCurrent();
  };
  return (
    <div className='card bg-light'>
      <h3 className='text-primary text-left'>
        {name}{" "}
        <span
          style={{ float: "right" }}
          className={`badge ${
            type === "Professional" ? "badge-success" : "badge-primary"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className='list'>
        {email && <li>{email}</li>}
        {phone && <li>{phone}</li>}
      </ul>
      <p>
        <button
          className='btn btn-sm btn-dark'
          onClick={() => contactContext.setCurrent(contact)}
        >
          Edit
        </button>
        <button className='btn btn-sm btn-danger' onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
};
ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
};
export default ContactItem;
