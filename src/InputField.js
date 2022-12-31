import React from "react";

export default function InputField(props) {
  return (
    <>
      <input
        placeholder={props.placeholder}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        list={props.list}
        className="input-field"
      />
      {props.isDataListOpen && (
        <datalist id={props.list}>
          {props.arraySuggestFilteredNames.map((fullName) => (
            <option value={fullName}>{fullName}</option>
          ))}
        </datalist>
      )}{" "}
    </>
  );
}
