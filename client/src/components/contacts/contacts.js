import React, { Fragment, useContext, useEffect } from "react";
import ContactItem from "./contactItem";
import ContactContext from "../../context/contact/ContactContext";

const Contacts = () => {
  const contactContext = useContext(ContactContext);
  const { contacts, filtered, getContacts } = contactContext;
  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);
  if (contacts !== null && contacts.length === 0) {
    return <h4>Please enter Contacts</h4>;
  }
  return (
    <Fragment>
      {filtered !== null
        ? filtered.map((contact) => (
            <ContactItem contact={contact} key={contact.id} />
          ))
        : contacts.map((contact) => (
            <ContactItem contact={contact} key={contact._id} />
          ))}
    </Fragment>
  );
};
export default Contacts;
